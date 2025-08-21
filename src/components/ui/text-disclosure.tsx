"use client";
import { cubicBezier, motion } from "framer-motion";
import { useMemo, useState } from "react";
import {
	Disclosure,
	DisclosureContent,
	DisclosureTrigger,
} from "~/components/ui/disclosure";

const TRANSITION = {
	ease: cubicBezier(0.075, 0.82, 0.165, 1),
	duration: 0.25,
};

type TextDisclosureProps = {
	/**
	 * Plain text content. Use blank lines to separate paragraphs.
	 */
	content: string;
};

export function Text14({ content }: TextDisclosureProps) {
	const paragraphs = useMemo(() => {
		return content
			.trim()
			.split(/\n\s*\n/)
			.map((p) => p.trim())
			.filter(Boolean);
	}, [content]);

	const hasMore = paragraphs.length > 1;
	const [toggle, setToggle] = useState(!hasMore);

	return (
		<div className="py-24 sm:py-32">
			<div className="mx-auto max-w-xl px-6 lg:px-8">
				<div className="relative">
					<motion.p
						className="whitespace-pre-line text-xl text-zinc-500 dark:text-zinc-400"
						initial={{
							maskImage:
								"linear-gradient(to top,#000,#000,transparent 0,#000 200px)",
						}}
						animate={{
							maskImage: !toggle
								? "linear-gradient(to top,#000,#000,transparent 0,#000 200px)"
								: "linear-gradient(to top,#000,#000,transparent 0,#000 0px)",
						}}
						transition={{
							...TRANSITION,
							duration: toggle
								? TRANSITION.duration / 2
								: TRANSITION.duration * 2,
						}}
					>
						{paragraphs[0] ?? ""}
					</motion.p>

					{hasMore ? (
						<Disclosure transition={TRANSITION} onOpenChange={setToggle}>
							<DisclosureContent>
								<div className="flex flex-col items-start space-y-8 pt-8">
									{paragraphs.slice(1).map((p, i) => (
										<p
											key={`${i}-${p}`}
											className="whitespace-pre-line text-xl text-zinc-500 dark:text-zinc-400"
										>
											{p}
										</p>
									))}
								</div>
							</DisclosureContent>
							<DisclosureTrigger>
								<button
									className="mt-4 w-full py-2 text-left text-black text-xl dark:text-white"
									type="button"
								>
									{toggle ? "Show less" : "Show more"}
								</button>
							</DisclosureTrigger>
						</Disclosure>
					) : null}
				</div>
			</div>
		</div>
	);
}
