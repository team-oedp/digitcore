"use client";
import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";

type Section = {
	id: string;
	heading: string;
	content: string;
};

export function AnimatedTextSections({ sections }: { sections: Section[] }) {
	const ref = useRef(null);
	const { scrollYProgress } = useScroll({
		target: ref,
		offset: ["start end", "end start"],
	});

	const opacities = sections.map((_, index) => {
		const start = index * 0.2;
		const end = start + 0.1;
		return useTransform(
			scrollYProgress,
			[start, start + 0.1, end, end + 0.1, 1],
			[0.3, 1, 1, 0.3, 0.3],
		);
	});

	return (
		<div className="relative h-[300vh]">
			<div className="py-24 sm:py-32">
				<div className="mx-auto max-w-4xl px-6 lg:px-8">
					<div className="flex flex-col items-center space-y-8" ref={ref}>
						{sections.map((feature, index) => (
							<motion.div
								key={feature.id}
								style={{
									opacity: opacities[index],
								}}
							>
								<h2 className="mb-4 font-medium text-2xl text-primary dark:text-primary">
									{feature.heading}
								</h2>
								<div className="text-lg text-primary dark:text-primary">
									{feature.content}
								</div>
							</motion.div>
						))}
					</div>
				</div>
			</div>
		</div>
	);
}
