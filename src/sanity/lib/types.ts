export type Prettify<T> = {
	[K in keyof T]: T[K];
} & unknown;

/**
 * Represents a reference in Sanity to another entity. Note that the
 * generic type is strictly for TypeScript meta programming.
 */
export declare type SanityReference<_T> = {
	_type: "reference";
	_ref: string;
};

/**
 * Represents a reference in Sanity to another entity with a key. Note that the
 * generic type is strictly for TypeScript meta programming.
 */
export declare type SanityKeyedReference<_T> = {
	_type: "reference";
	_key: string;
	_ref: string;
};

export declare type SanityKeyed<T> = T extends object
	? T & {
			_key: string;
		}
	: T;

export type ResolvedSanityReferences<T> =
	// match `SanityKeyedReference` and unwrap via `infer U`
	T extends SanityKeyedReference<infer U>
		? ResolvedSanityReferences<U>
		: // match `SanityReference` and unwrap via `infer U`
			T extends SanityReference<infer U>
			? ResolvedSanityReferences<U>
			: // match arrays, unwrap with `T[number]`,
				// recursively run through `ResolvedSanityReferences`
				// then re-wrap in an another array
				// biome-ignore lint/suspicious/noExplicitAny: false positive
				T extends any[]
				? Array<ResolvedSanityReferences<T[number]>>
				: // finally utilize mapped types to
					// recursively run children through `ResolvedSanityReferences`
					{ [P in keyof T]: ResolvedSanityReferences<T[P]> };
