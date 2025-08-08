"use client";

interface LetterNavigationProps<T> {
	itemsByLetter: Partial<Record<string, T[]>>;
	contentId?: string;
}

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

export function LetterNavigation<T>({
	itemsByLetter,
	contentId = "content",
}: LetterNavigationProps<T>) {
	return (
		<div className="fixed left-8 z-20 hidden lg:block">
			<div className="flex flex-col">
				{ALPHABET.map((letter) => {
					const hasItems = (itemsByLetter[letter]?.length ?? 0) > 0;
					const baseClasses =
						"block text-sm font-normal leading-none py-1 transition-colors";
					const activeClasses = "text-neutral-700 hover:text-neutral-900";
					const inactiveClasses =
						"text-neutral-300 pointer-events-none cursor-not-allowed";

					return (
						<a
							key={letter}
							href={hasItems ? `#letter-${letter}` : undefined}
							className={`${baseClasses} ${hasItems ? activeClasses : inactiveClasses}`}
							aria-disabled={!hasItems}
							onClick={(e) => {
								if (hasItems) {
									e.preventDefault();
									const element = document.getElementById(`letter-${letter}`);
									const container = document.getElementById(contentId);
									if (element && container) {
										container.scrollTo({
											top: element.offsetTop - 20,
											behavior: "smooth",
										});
									}
								}
							}}
						>
							{letter}
						</a>
					);
				})}
			</div>
		</div>
	);
}
