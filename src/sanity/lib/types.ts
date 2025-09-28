import type { Pattern, Resource, Solution } from "../sanity.types";

// Core Sanity document type constraint
export type SanityDocument = {
	_type: string;
	_id: string;
	_createdAt: string;
	_updatedAt: string;
	_rev: string;
};

// Utility to make types more readable
export type Prettify<T> = {
	[K in keyof T]: T[K];
} & unknown;

// Extract a specific field type from a Sanity document
export type FieldType<
	T extends SanityDocument,
	K extends keyof T,
> = NonNullable<T[K]>;

// Get all field types from a document type
export type DocumentFields<T extends SanityDocument> = {
	[K in keyof T]: FieldType<T, K>;
};

// Document-specific field type collections
export type PatternFields = DocumentFields<Pattern>;
export type ResourceFields = DocumentFields<Resource>;
export type SolutionFields = DocumentFields<Solution>;

// Commonly used field types for convenience
export type PatternDescription = PatternFields["description"];
export type PatternTitle = PatternFields["title"];
export type PatternSlug = PatternFields["slug"];
export type PatternSolutions = PatternFields["solutions"];
export type PatternResources = PatternFields["resources"];

export type ResourceDescription = ResourceFields["description"];
export type ResourceTitle = ResourceFields["title"];

export type SolutionDescription = SolutionFields["description"];
export type SolutionTitle = SolutionFields["title"];

// Array element extraction utilities
export type ArrayElement<T> = T extends (infer U)[] ? U : never;

// Reference resolution utilities
export type ReferenceTarget<T> = T extends { _ref: string; _type: infer U }
	? U
	: never;

// Dereferenced reference type (what we get after GROQ queries)
export type DereferencedReference<T> = T extends { _ref: string }
	? { _id: string; _type: string; [key: string]: unknown }
	: T;
