import { ComputerRemoveIcon } from "@hugeicons/core-free-icons";
import { Home } from "lucide-react";
import Link from "next/link";
import { Icon } from "~/components/global/icon";
import { Button } from "~/components/ui/button";

export default function NotFound() {
	return (
		<div className="flex min-h-screen flex-col bg-background">
			<div className="relative flex-1 rounded-lg bg-card">
				<div className="absolute p-5 font-normal text-3xl text-neutral-600 uppercase tracking-[-0.64px]">
					404
				</div>

				<div className="mx-auto flex max-w-[834px] flex-col items-start justify-start px-4 pt-52">
					<div className="mb-10">
						<div className="space-y-6">
							<Icon icon={ComputerRemoveIcon} size={44} color={"#7C7C7C"} />
							<div className="font-mono text-neutral-600 text-sm uppercase">
								Page not found
							</div>

							<div className="space-y-4 text-neutral-600 text-xl leading-normal">
								<p>
									Unfortunately, the page you were looking for cannot be found
									or may not exist.
								</p>
								<p>
									Return to the Digitcore toolkit using your browser's back
									button or click the link below to go to the homepage.
								</p>
							</div>

							<Button
								variant="outline"
								asChild
								className="rounded-md border-border bg-card px-3 py-2 text-neutral-500 text-sm uppercase hover:bg-secondary"
							>
								<Link href="/" className="flex items-center gap-3">
									Go to Digitcore homepage
									<Home className="h-3.5 w-3.5" />
								</Link>
							</Button>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
