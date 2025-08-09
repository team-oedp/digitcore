import { HugeiconsIcon } from "@hugeicons/react";

type IconSvgObject =
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
	color?: string;
	strokeWidth?: number;
};

export function Icon({
	icon,
	size = 16,
	color = "currentColor",
	strokeWidth = 1.5,
	...rest
}: IconProps) {
	return (
		<HugeiconsIcon
			icon={icon}
			size={size}
			color={color}
			strokeWidth={strokeWidth}
			{...rest}
		/>
	);
}
