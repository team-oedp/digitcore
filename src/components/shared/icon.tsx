import { HugeiconsIcon } from "@hugeicons/react";

export type IconSvgObject =
	| [
			string,
			{
				[key: string]: string | number;
			},
	  ][]
	| readonly (readonly [
			string,
			{
				readonly [key: string]: string | number;
			},
	  ])[];

type IconProps = {
	icon: IconSvgObject;
	size?: number;
	mobileSize?: number;
	color?: string;
	strokeWidth?: number;
	className?: string;
};

export function Icon({
	icon,
	size = 16,
	mobileSize,
	color = "currentColor",
	strokeWidth = 1.5,
	className,
	...rest
}: IconProps) {
	if (mobileSize) {
		return (
			<>
				<HugeiconsIcon
					icon={icon}
					size={mobileSize}
					color={color}
					strokeWidth={strokeWidth}
					className={`lg:hidden ${className ?? ""}`}
					{...rest}
				/>
				<HugeiconsIcon
					icon={icon}
					size={size}
					color={color}
					strokeWidth={strokeWidth}
					className={`hidden lg:block ${className ?? ""}`}
					{...rest}
				/>
			</>
		);
	}

	return (
		<HugeiconsIcon
			icon={icon}
			size={size}
			color={color}
			strokeWidth={strokeWidth}
			className={className}
			{...rest}
		/>
	);
}
