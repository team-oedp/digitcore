import { createClient } from "next-sanity";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { sendSuggestionEmail } from "~/lib/email";
import { type SuggestionFormData, submitSuggestion } from "./submit-suggestion";

vi.mock("next-sanity");
vi.mock("~/lib/email");

// Mock the env module to avoid server-side environment variable access
vi.mock("~/env", () => ({
  env: {
    SUGGESTION_NOTIFICATION_EMAIL: "test@example.com",
    EMAIL_FROM: "Digital Toolkit <noreply@digitcore.local>"
  }
}));

const mockCreateClient = vi.mocked(createClient);
const mockCreate = vi.fn();
const mockSendSuggestionEmail = vi.mocked(sendSuggestionEmail);

// Setup the mock to return an object with a create method
mockCreateClient.mockReturnValue({
	create: mockCreate,
	// biome-ignore lint/suspicious/noExplicitAny: Mocking Sanity client requires any type
} as any);

// Mock Sanity environment variables
vi.mock("~/sanity/env", () => ({
	apiVersion: "2023-01-01",
	dataset: "production",
	projectId: "test-project-id",
}));

// Mock console.error for email failure logging
const mockConsoleError = vi.fn();
vi.stubGlobal("console", { error: mockConsoleError });

// Mock Date.now for consistent timestamps
const mockDate = new Date("2023-12-01T10:30:00Z");
vi.setSystemTime(mockDate);

// Test data
const createMockFormData = (
	overrides?: Partial<SuggestionFormData>,
): SuggestionFormData => ({
	patternName: "Climate Adaptation Strategies",
	patternSlug: "climate-adaptation-strategies",
	newSolutions: "Implement green infrastructure solutions for urban resilience",
	newResources:
		"Urban Climate Toolkit - comprehensive resource for adaptation planning",
	additionalFeedback: "This pattern would benefit from more case studies",
	nameAndAffiliation: "Dr. Jane Smith, University of Climate Studies",
	email: "jane.smith@climate-uni.edu",
	...overrides,
});

describe("submitSuggestion", () => {
	beforeEach(() => {
		vi.clearAllMocks();
		process.env.SANITY_API_WRITE_TOKEN = "test-write-token";
		process.env.SANITY_API_READ_TOKEN = undefined;
	});

	afterEach(() => {
		process.env.SANITY_API_WRITE_TOKEN = undefined;
		process.env.SANITY_API_READ_TOKEN = undefined;
	});

	it("should successfully submit suggestion with write token", async () => {
		const formData = createMockFormData();
		mockCreate.mockResolvedValue({ _id: "suggestion123" });
		mockSendSuggestionEmail.mockResolvedValue(undefined);

		const result = await submitSuggestion(formData);

		expect(result).toEqual({ success: true });

		expect(mockCreateClient).toHaveBeenCalledWith({
			projectId: "test-project-id",
			dataset: "production",
			apiVersion: "2023-01-01",
			useCdn: false,
			token: "test-write-token",
		});

		expect(mockCreate).toHaveBeenCalledWith({
			_type: "suggestion",
			patternName: "Climate Adaptation Strategies",
			patternSlug: "climate-adaptation-strategies",
			newSolutions:
				"Implement green infrastructure solutions for urban resilience",
			newResources:
				"Urban Climate Toolkit - comprehensive resource for adaptation planning",
			additionalFeedback: "This pattern would benefit from more case studies",
			nameAndAffiliation: "Dr. Jane Smith, University of Climate Studies",
			email: "jane.smith@climate-uni.edu",
			submittedAt: "2023-12-01T10:30:00.000Z",
		});

		expect(mockSendSuggestionEmail).toHaveBeenCalledWith(formData);
	});

	it("should fallback to read token when write token is not available", async () => {
		process.env.SANITY_API_WRITE_TOKEN = undefined;
		process.env.SANITY_API_READ_TOKEN = "test-read-token";

		const formData = createMockFormData();
		mockCreate.mockResolvedValue({ _id: "suggestion124" });

		await submitSuggestion(formData);

		expect(mockCreateClient).toHaveBeenCalledWith({
			projectId: "test-project-id",
			dataset: "production",
			apiVersion: "2023-01-01",
			useCdn: false,
			token: "test-read-token",
		});
	});

	it("should throw error when no API token is available", async () => {
		process.env.SANITY_API_WRITE_TOKEN = undefined;
		process.env.SANITY_API_READ_TOKEN = undefined;

		const formData = createMockFormData();

		await expect(submitSuggestion(formData)).rejects.toThrow(
			"Missing SANITY_API_WRITE_TOKEN environment variable",
		);

		expect(mockCreate).not.toHaveBeenCalled();
		expect(mockSendSuggestionEmail).not.toHaveBeenCalled();
	});

	it("should handle Sanity client creation errors", async () => {
		const formData = createMockFormData();
		const clientError = new Error("Failed to create Sanity client");
		mockCreate.mockRejectedValue(clientError);

		await expect(submitSuggestion(formData)).rejects.toThrow(
			"Failed to create Sanity client",
		);

		expect(mockSendSuggestionEmail).not.toHaveBeenCalled();
	});

	it("should handle Sanity document creation errors", async () => {
		const formData = createMockFormData();
		const creationError = new Error("Failed to create document");
		mockCreate.mockRejectedValue(creationError);

		await expect(submitSuggestion(formData)).rejects.toThrow(
			"Failed to create document",
		);

		expect(mockSendSuggestionEmail).not.toHaveBeenCalled();
	});

	it("should continue execution even if email sending fails", async () => {
		const formData = createMockFormData();
		mockCreate.mockResolvedValue({ _id: "suggestion125" });
		const emailError = new Error("Email service unavailable");
		mockSendSuggestionEmail.mockRejectedValue(emailError);

		const result = await submitSuggestion(formData);

		expect(result).toEqual({ success: true });
		expect(mockCreate).toHaveBeenCalled();

		// Should log email error but not throw
		await new Promise((resolve) => setTimeout(resolve, 0)); // Wait for async error handling
		expect(mockConsoleError).toHaveBeenCalledWith(
			"Failed to send suggestion email",
			emailError,
		);
	});

	it("should handle all form fields correctly", async () => {
		const formData = createMockFormData({
			patternName: "Sustainable Urban Development",
			patternSlug: "sustainable-urban-development",
			newSolutions:
				"Community-based planning initiatives\nGreen building standards\nPublic transport optimization",
			newResources:
				"Urban Sustainability Handbook\nPlanning Guidelines Documentation",
			additionalFeedback:
				"Consider adding more European case studies and examples from smaller cities",
			nameAndAffiliation:
				"Prof. Maria Rodriguez, Institute for Sustainable Cities",
			email: "m.rodriguez@sustainable-cities.org",
		});

		mockCreate.mockResolvedValue({ _id: "suggestion126" });

		await submitSuggestion(formData);

		expect(mockCreate).toHaveBeenCalledWith({
			_type: "suggestion",
			patternName: "Sustainable Urban Development",
			patternSlug: "sustainable-urban-development",
			newSolutions:
				"Community-based planning initiatives\nGreen building standards\nPublic transport optimization",
			newResources:
				"Urban Sustainability Handbook\nPlanning Guidelines Documentation",
			additionalFeedback:
				"Consider adding more European case studies and examples from smaller cities",
			nameAndAffiliation:
				"Prof. Maria Rodriguez, Institute for Sustainable Cities",
			email: "m.rodriguez@sustainable-cities.org",
			submittedAt: "2023-12-01T10:30:00.000Z",
		});
	});

	it("should handle empty optional fields", async () => {
		const formData = createMockFormData({
			newSolutions: "",
			newResources: "",
			additionalFeedback: "",
		});

		mockCreate.mockResolvedValue({ _id: "suggestion127" });

		await submitSuggestion(formData);

		expect(mockCreate).toHaveBeenCalledWith({
			_type: "suggestion",
			patternName: "Climate Adaptation Strategies",
			patternSlug: "climate-adaptation-strategies",
			newSolutions: "",
			newResources: "",
			additionalFeedback: "",
			nameAndAffiliation: "Dr. Jane Smith, University of Climate Studies",
			email: "jane.smith@climate-uni.edu",
			submittedAt: "2023-12-01T10:30:00.000Z",
		});
	});

	it("should handle very long form inputs", async () => {
		const longText = "A".repeat(5000);
		const formData = createMockFormData({
			newSolutions: longText,
			newResources: longText,
			additionalFeedback: longText,
		});

		mockCreate.mockResolvedValue({ _id: "suggestion128" });

		await submitSuggestion(formData);

		expect(mockCreate).toHaveBeenCalledWith({
			_type: "suggestion",
			patternName: "Climate Adaptation Strategies",
			patternSlug: "climate-adaptation-strategies",
			newSolutions: longText,
			newResources: longText,
			additionalFeedback: longText,
			nameAndAffiliation: "Dr. Jane Smith, University of Climate Studies",
			email: "jane.smith@climate-uni.edu",
			submittedAt: "2023-12-01T10:30:00.000Z",
		});
	});

	it("should handle special characters in form data", async () => {
		const formData = createMockFormData({
			patternName: "Pattërn with Spëcial Charactërs & Symbols! @#$%",
			newSolutions: "Solution with quotes: \"This is a quote\" and 'this too'",
			additionalFeedback:
				"Feedback with unicode: 🌱🌍🔄 and symbols: &lt;script&gt;",
			nameAndAffiliation: "Dr. José María Rodríguez-García, École d'Écologie",
			email: "jose.rodriguez@ecole-ecologie.fr",
		});

		mockCreate.mockResolvedValue({ _id: "suggestion129" });

		await submitSuggestion(formData);

		expect(mockCreate).toHaveBeenCalledWith({
			_type: "suggestion",
			patternName: "Pattërn with Spëcial Charactërs & Symbols! @#$%",
			patternSlug: "climate-adaptation-strategies",
			newSolutions: "Solution with quotes: \"This is a quote\" and 'this too'",
			newResources:
				"Urban Climate Toolkit - comprehensive resource for adaptation planning",
			additionalFeedback:
				"Feedback with unicode: 🌱🌍🔄 and symbols: &lt;script&gt;",
			nameAndAffiliation: "Dr. José María Rodríguez-García, École d'Écologie",
			email: "jose.rodriguez@ecole-ecologie.fr",
			submittedAt: "2023-12-01T10:30:00.000Z",
		});
	});

	it("should generate consistent timestamp", async () => {
		const formData = createMockFormData();
		mockCreate.mockResolvedValue({ _id: "suggestion130" });

		// Call multiple times
		await submitSuggestion(formData);
		await submitSuggestion(formData);

		expect(mockCreate).toHaveBeenCalledTimes(2);

		// Both calls should have the same timestamp since we mocked Date
		const firstCall = mockCreate.mock.calls[0]?.[0];
		const secondCall = mockCreate.mock.calls[1]?.[0];

		expect(firstCall?.submittedAt).toBe("2023-12-01T10:30:00.000Z");
		expect(secondCall?.submittedAt).toBe("2023-12-01T10:30:00.000Z");
	});

	it("should call email function with correct parameters", async () => {
		const formData = createMockFormData();
		mockCreate.mockResolvedValue({ _id: "suggestion131" });
		mockSendSuggestionEmail.mockResolvedValue(undefined);

		await submitSuggestion(formData);

		expect(mockSendSuggestionEmail).toHaveBeenCalledWith(formData);
		expect(mockSendSuggestionEmail).toHaveBeenCalledTimes(1);
	});

	it("should use correct Sanity client configuration", async () => {
		const formData = createMockFormData();
		mockCreate.mockResolvedValue({ _id: "suggestion132" });

		await submitSuggestion(formData);

		expect(mockCreateClient).toHaveBeenCalledWith({
			projectId: "test-project-id",
			dataset: "production",
			apiVersion: "2023-01-01",
			useCdn: false,
			token: "test-write-token",
		});

		expect(mockCreateClient).toHaveBeenCalledTimes(1);
	});

	it("should create document with correct Sanity schema type", async () => {
		const formData = createMockFormData();
		mockCreate.mockResolvedValue({ _id: "suggestion133" });

		await submitSuggestion(formData);

		const createdDocument = mockCreate.mock.calls[0]?.[0];
		expect(createdDocument._type).toBe("suggestion");
		expect(createdDocument).toHaveProperty("patternName");
		expect(createdDocument).toHaveProperty("patternSlug");
		expect(createdDocument).toHaveProperty("newSolutions");
		expect(createdDocument).toHaveProperty("newResources");
		expect(createdDocument).toHaveProperty("additionalFeedback");
		expect(createdDocument).toHaveProperty("nameAndAffiliation");
		expect(createdDocument).toHaveProperty("email");
		expect(createdDocument).toHaveProperty("submittedAt");
	});
});
