"use client";

import dynamic from "next/dynamic";
import type React from "react";
import type { default as PatternCombinationComponent } from "./pattern-combination";

type PatternCombinationWrapperProps = React.ComponentProps<
	typeof PatternCombinationComponent
>;

const ClientPatternCombination = dynamic(
	() => import("./pattern-combination"),
	{
		ssr: false,
	},
);

export default function PatternCombinationWrapper(
	props: PatternCombinationWrapperProps,
) {
	return <ClientPatternCombination {...props} />;
}
