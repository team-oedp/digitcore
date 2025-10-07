export function ThemeMiniBadge() {
	return (
		<div className="inset-ring inset-ring-orange-700/10 flex h-[16px] items-center justify-center rounded bg-orange-50 px-1 py-0 text-orange-700 md:h-[18px] md:px-1.5 dark:inset-ring-orange-500/20 dark:bg-orange-950/30 dark:text-orange-400 [a&]:hover:bg-orange-100 dark:[a&]:hover:bg-orange-950/50">
			<span className="font-normal text-[10px] text-orange-700 tracking-tighter md:text-[12px] dark:text-orange-400 [a&]:hover:bg-orange-100 dark:[a&]:hover:bg-orange-950/50 ">
				Theme
			</span>
		</div>
	);
}
