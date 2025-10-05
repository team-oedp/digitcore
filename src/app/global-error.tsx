"use client";

import "~/styles/globals.css";

import {
	Alert02Icon,
	ArrowTurnBackwardIcon,
	Home09Icon,
} from "@hugeicons/core-free-icons";
import Link from "next/link";
import { sans, signifier } from "~/app/(frontend)/fonts";
import { ErrorHeader } from "~/components/global/error-header";
import { Icon } from "~/components/shared/icon";
import { PageWrapper } from "~/components/shared/page-wrapper";
import { ThemeProvider } from "~/components/theme/theme-provider";
import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";

export default function GlobalError({
	error,
	reset,
}: {
	error: Error & { digest?: string };
	reset: () => void;
}) {
	return (
		<html lang="en" suppressHydrationWarning>
			<body className={cn(sans.variable, signifier.variable)}>
				<ThemeProvider
					attribute="class"
					defaultTheme="system"
					enableSystem
					disableTransitionOnChange
				>
					<div className="flex min-h-screen flex-col bg-secondary">
						<ErrorHeader />
						<div className="flex-1 pt-16 md:pt-14">
							<div className="mx-2 rounded-md bg-container-background md:m-0">
								<PageWrapper>
									<div className="flex min-h-screen flex-col">
										<div className="relative flex-1 rounded-lg">
											<div className="absolute p-5 font-normal text-3xl text-neutral-600 uppercase tracking-[-0.64px]">
												Error
											</div>

											<div className="mx-auto flex max-w-[834px] flex-col items-start justify-start px-4 pt-52">
												<div className="mb-10">
													<div className="space-y-6">
														<Icon
															icon={Alert02Icon}
															size={44}
															color={"#7C7C7C"}
														/>
														<div className="font-mono text-neutral-600 text-sm uppercase">
															Something went wrong
														</div>

														<div className="space-y-4 text-neutral-600 text-xl leading-normal">
															<p>
																An unexpected error occurred. This has been
																logged and we'll look into it.
															</p>
															<p>
																You can try again or return to the homepage to
																continue using the DIGITCORE toolkit.
															</p>
														</div>

														<div className="flex items-center gap-3">
															<Button
																variant="outline"
																onClick={reset}
																className="rounded-md border-border bg-card px-3 py-2 text-neutral-500 text-sm uppercase hover:bg-secondary"
															>
																<span className="flex items-center gap-3">
																	Try again
																	<Icon
																		icon={ArrowTurnBackwardIcon}
																		size={14}
																	/>
																</span>
															</Button>
															<Button
																variant="outline"
																asChild
																className="rounded-md border-border bg-card px-3 py-2 text-neutral-500 text-sm uppercase hover:bg-secondary"
															>
																<Link
																	href="/"
																	className="flex items-center gap-3"
																>
																	Go to homepage
																	<Icon icon={Home09Icon} size={14} />
																</Link>
															</Button>
														</div>
													</div>
												</div>
											</div>
										</div>
									</div>
								</PageWrapper>
							</div>
						</div>
					</div>
				</ThemeProvider>
			</body>
		</html>
	);
}
