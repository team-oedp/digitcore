"use client";

import dynamic from "next/dynamic";
import type React from "react";
import type { default as CustomizablePatternCombinationComponent } from "./customizable-pattern-combination";

type CustomizablePatternCombinationWrapperProps = React.ComponentProps<
	typeof CustomizablePatternCombinationComponent
>;

const ClientCustomizablePatternCombination = dynamic(
	() => import("./customizable-pattern-combination"),
	{
		ssr: false,
	},
);

export default function CustomizablePatternCombinationWrapper(
	props: CustomizablePatternCombinationWrapperProps,
) {
	return <ClientCustomizablePatternCombination {...props} />;
}

export { CustomizablePatternCombination } from "./customizable-pattern-combination";
