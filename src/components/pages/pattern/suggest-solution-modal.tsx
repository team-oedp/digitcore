"use client";

import { useId, useState } from "react";
import { submitSuggestion } from "~/app/actions/submit-suggestion";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { cn } from "~/lib/utils";
import type { PATTERN_UTILITIES_QUERYResult } from "~/sanity/sanity.types";

type SuggestSolutionModalProps = {
	patternName: string;
	patternSlug: string;
	patternUtilities?: PATTERN_UTILITIES_QUERYResult | null;
	trigger: React.ReactNode;
};

export function SuggestSolutionModal({
	patternName,
	patternSlug,
	patternUtilities,
	trigger,
}: SuggestSolutionModalProps) {
	const modalTitle =
		patternUtilities?.suggestSolutionModalTitle ?? "Suggest Solution";
	const modalDescription =
		patternUtilities?.suggestSolutionModalDescription ??
		"Help us improve the Digital Toolkit for Collaborative Environmental Research by suggesting new solutions and resources.";
	const patternLabel = patternUtilities?.patternLabel ?? "Pattern";
	const newSolutionsLabel =
		patternUtilities?.newSolutionsLabel ?? "New Solution(s)";
	const newSolutionsPlaceholder =
		patternUtilities?.newSolutionsPlaceholder ??
		"What new solution(s) would you like to add for this pattern?";
	const newResourcesLabel =
		patternUtilities?.newResourcesLabel ?? "New Resource(s)";
	const newResourcesPlaceholder =
		patternUtilities?.newResourcesPlaceholder ??
		"What new resource(s) would you like to add for this pattern? Please reference a solution and provide a URL if applicable.";
	const additionalFeedbackLabel =
		patternUtilities?.additionalFeedbackLabel ?? "Additional Feedback";
	const additionalFeedbackPlaceholder =
		patternUtilities?.additionalFeedbackPlaceholder ??
		"Do you have any additional feedback on the Pattern or Toolkit?";
	const nameAndAffiliationLabel =
		patternUtilities?.nameAndAffiliationLabel ?? "Name and Affiliation";
	const nameAndAffiliationPlaceholder =
		patternUtilities?.nameAndAffiliationPlaceholder ??
		"Would you like your name and affiliation to be listed on the website?";
	const emailLabel = patternUtilities?.emailLabel ?? "Email";
	const emailPlaceholder =
		patternUtilities?.emailPlaceholder ??
		"Please supply an email where we can contact you.";
	const cancelButtonLabel = patternUtilities?.cancelButtonLabel ?? "Cancel";
	const submitSuggestionButtonLabel =
		patternUtilities?.submitSuggestionButtonLabel ?? "Submit Suggestion";
	const successMessage =
		patternUtilities?.patternSubmittedSuccessfullyMessage ??
		"Pattern submitted successfully!";
	const [isOpen, setIsOpen] = useState(false);
	const baseId = useId();
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [isSuccess, setIsSuccess] = useState(false);
	const [formData, setFormData] = useState({
		newSolutions: "",
		newResources: "",
		additionalFeedback: "",
		nameAndAffiliation: "",
		email: "",
	});

	const handleInputChange = (field: string, value: string) => {
		setFormData((prev) => ({
			...prev,
			[field]: value,
		}));
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsSubmitting(true);
		try {
			await submitSuggestion({
				patternName,
				patternSlug,
				newSolutions: formData.newSolutions,
				newResources: formData.newResources,
				additionalFeedback: formData.additionalFeedback,
				nameAndAffiliation: formData.nameAndAffiliation,
				email: formData.email,
			});
			setIsSuccess(true);
			// Reset form state for next open
			setFormData({
				newSolutions: "",
				newResources: "",
				additionalFeedback: "",
				nameAndAffiliation: "",
				email: "",
			});
			// Auto close after 3s
			setTimeout(() => {
				setIsOpen(false);
				// Wait for dialog close animation before resetting success
				setTimeout(() => setIsSuccess(false), 1000);
			}, 3000);
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<Dialog
			open={isOpen}
			onOpenChange={(open) => {
				setIsOpen(open);
				if (open) {
					// Reset success state only when reopening the dialog, not while closing,
					// to avoid brief flash of the form during the close animation.
					setIsSuccess(false);
				}
			}}
		>
			<DialogTrigger asChild>{trigger}</DialogTrigger>
			<DialogContent
				showCloseButton={!isSuccess}
				className={cn(
					"max-h-[90vh] max-w-5xl overflow-y-auto transition-all duration-300",
					isSuccess ? "border-green-200 bg-green-50" : "border-transparent",
				)}
			>
				{!isSuccess && (
					<DialogHeader>
						<DialogTitle>{modalTitle}</DialogTitle>
						<DialogDescription>{modalDescription}</DialogDescription>
					</DialogHeader>
				)}

				{isSuccess ? (
					<div className="flex flex-col items-start justify-start gap-4 py-16 text-left">
						<svg
							className="size-12 text-green-600"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth="2"
							strokeLinecap="round"
							strokeLinejoin="round"
							aria-hidden="true"
						>
							<path d="M20 6L9 17l-5-5" />
						</svg>
						<p className="font-normal text-foreground text-lg">
							{successMessage}
						</p>
					</div>
				) : (
					<form onSubmit={handleSubmit} className="space-y-6">
						<div className="space-y-3">
							<Label className="block font-normal text-xs">
								{patternLabel}
							</Label>
							<Badge variant="secondary">{patternName}</Badge>
						</div>

						<div>
							<Label
								htmlFor={`${baseId}-newSolutions`}
								className="mb-2 block font-normal text-xs"
							>
								{newSolutionsLabel}
							</Label>
							<textarea
								id={`${baseId}-newSolutions`}
								className="flex min-h-[120px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-transparent focus-visible:ring-offset-transparent disabled:cursor-not-allowed disabled:opacity-50"
								placeholder={newSolutionsPlaceholder}
								value={formData.newSolutions}
								onChange={(e) =>
									handleInputChange("newSolutions", e.target.value)
								}
							/>
						</div>

						<div>
							<Label
								htmlFor={`${baseId}-newResources`}
								className="mb-2 block font-normal text-xs"
							>
								{newResourcesLabel}
							</Label>
							<textarea
								id={`${baseId}-newResources`}
								className="flex min-h-[120px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-transparent focus-visible:ring-offset-transparent disabled:cursor-not-allowed disabled:opacity-50"
								placeholder={newResourcesPlaceholder}
								value={formData.newResources}
								onChange={(e) =>
									handleInputChange("newResources", e.target.value)
								}
							/>
						</div>

						<div>
							<Label
								htmlFor={`${baseId}-additionalFeedback`}
								className="mb-2 block font-normal text-xs"
							>
								{additionalFeedbackLabel}
							</Label>
							<textarea
								id={`${baseId}-additionalFeedback`}
								className="flex min-h-[120px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-transparent focus-visible:ring-offset-transparent disabled:cursor-not-allowed disabled:opacity-50"
								placeholder={additionalFeedbackPlaceholder}
								value={formData.additionalFeedback}
								onChange={(e) =>
									handleInputChange("additionalFeedback", e.target.value)
								}
							/>
						</div>

						<div>
							<Label
								htmlFor={`${baseId}-nameAndAffiliation`}
								className="mb-2 block font-normal text-xs"
							>
								{nameAndAffiliationLabel}
							</Label>
							<Input
								id={`${baseId}-nameAndAffiliation`}
								className="text-sm focus-visible:ring-transparent"
								placeholder={nameAndAffiliationPlaceholder}
								value={formData.nameAndAffiliation}
								onChange={(e) =>
									handleInputChange("nameAndAffiliation", e.target.value)
								}
							/>
						</div>

						<div>
							<Label
								htmlFor={`${baseId}-email`}
								className="mb-2 block font-normal text-xs"
							>
								{emailLabel} <span className="text-red-500">*</span>
							</Label>
							<Input
								id={`${baseId}-email`}
								type="email"
								className="text-sm focus-visible:ring-transparent"
								placeholder={emailPlaceholder}
								value={formData.email}
								onChange={(e) => handleInputChange("email", e.target.value)}
								required
							/>
						</div>

						<DialogFooter className="flex w-full gap-2">
							<Button
								className="flex-1"
								type="button"
								variant="outline"
								onClick={() => setIsOpen(false)}
								disabled={isSubmitting}
							>
								{cancelButtonLabel}
							</Button>
							<Button type="submit" className="flex-1" disabled={isSubmitting}>
								{isSubmitting && (
									<svg
										className="size-4 shrink-0 animate-spin text-current"
										viewBox="0 0 24 24"
										aria-hidden="true"
									>
										<circle
											className="opacity-25"
											cx="12"
											cy="12"
											r="10"
											stroke="currentColor"
											strokeWidth="4"
											fill="none"
										/>
										<path
											className="opacity-75"
											fill="currentColor"
											d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4l-3 3 3 3H4z"
										/>
									</svg>
								)}
								<span className={isSubmitting ? "sr-only" : undefined}>
									{submitSuggestionButtonLabel}
								</span>
							</Button>
						</DialogFooter>
					</form>
				)}
			</DialogContent>
		</Dialog>
	);
}
