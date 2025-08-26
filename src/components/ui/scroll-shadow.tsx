import {
	type HTMLAttributes,
	type ReactNode,
	type RefObject,
	useEffect,
	useRef,
	useState,
} from "react";
import { cn } from "~/lib/utils";

type Props = HTMLAttributes<HTMLDivElement> & {
	children?: ReactNode;
};

export default function ScrollShadow({ className, children, ...props }: Props) {
	const ref = useRef<HTMLDivElement>(null);
	const { scroll, maxScroll } = useScroll(ref);

	return (
		<div
			ref={ref}
			className={cn(
				"grid h-96 w-96 content-start gap-y-4 overflow-y-auto rounded-lg bg-white p-2 [mask:linear-gradient(180deg,transparent,white_var(--start)_var(--end),transparent)]",
				className,
				scroll > 10 ? "[--start:20%]" : "[--start:0%]",
				scroll >= maxScroll - 10 ? "[--end:100%]" : "[--end:80%]",
			)}
			{...props}
		>
			{children}
		</div>
	);
}

function useScroll(ref: RefObject<HTMLDivElement | null>) {
	const [scroll, setScroll] = useState(0);
	const [maxScroll, setMaxScroll] = useState(0);

	useEffect(() => {
		const element = ref.current;
		if (!element) return;

		const onScroll = () => {
			setScroll(element.scrollTop);
		};

		element.addEventListener("scroll", onScroll);

		setMaxScroll(element.scrollHeight - element.clientHeight);

		return () => {
			element.removeEventListener("scroll", onScroll);
		};
	}, [ref]);

	return {
		scroll,
		maxScroll,
	};
}
