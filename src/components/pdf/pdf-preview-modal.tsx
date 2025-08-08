"use client";

import { Download03Icon, EyeIcon } from "@hugeicons/core-free-icons";
import { useState } from "react";
import { toast } from "sonner";
import { Icon } from "~/components/shared/icon";
import { Button } from "~/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "~/components/ui/dialog";
import { ScrollArea } from "~/components/ui/scroll-area";
import type {
	CarrierBagDocumentData,
	PatternContentData,
} from "~/hooks/use-pattern-content";
import { downloadCarrierBagPDF } from "./pdf-components";

type PDFPreviewModalProps = {
	documentData: CarrierBagDocumentData;
	disabled?: boolean;
	children?: React.ReactNode;
}

// Web preview components that match the PDF layout
const PreviewCoverPage = ({
	documentData,
}: { documentData: CarrierBagDocumentData }) => (
	<div className="flex min-h-[500px] flex-col items-center justify-center bg-white p-10 text-center">
		<h1 className="mb-5 font-light text-3xl text-primary capitalize">
			{documentData.title}
		</h1>
		<p className="mb-10 text-muted-foreground">{documentData.subtitle}</p>
		<p className="mb-2 text-muted-foreground text-sm">
			Generated on {documentData.date}
		</p>
		<p className="text-muted-foreground text-sm">
			{documentData.patternCount} pattern
			{documentData.patternCount !== 1 ? "s" : ""} collected
		</p>
	</div>
);

const PreviewTableOfContents = ({
	documentData,
}: { documentData: CarrierBagDocumentData }) => (
	<div className="bg-white p-10">
		<h2 className="mb-8 font-light text-2xl text-primary">Contents</h2>
		<div className="space-y-2">
			{documentData.patterns.map((pattern, index) => (
				<div
					key={pattern.header.title}
					className="flex justify-between border-zinc-100 border-b py-2"
				>
					<span className="text-primary text-sm capitalize">
						{pattern.header.title}
					</span>
					<span className="text-muted-foreground text-xs">{index + 3}</span>
				</div>
			))}
		</div>
	</div>
);

const PreviewPatternConnections = ({
	connections,
}: { connections: PatternContentData["connections"] }) => {
	if (connections.length === 0) return null;

	return (
		<div className="mb-8">
			{connections.map((connection) => (
				<div key={connection.type} className="mb-4">
					<h4 className="mb-2 font-semibold text-gray-700 text-xs uppercase">
						{connection.title}
					</h4>
					<div className="flex flex-wrap gap-2">
						{connection.items.map((item) => (
							<span
								key={item.id}
								className="rounded bg-gray-200 px-2 py-1 text-gray-700 text-xs"
							>
								{item.title}
							</span>
						))}
					</div>
				</div>
			))}
		</div>
	);
};

const PreviewSolutions = ({
	solutions,
}: { solutions: PatternContentData["solutions"] }) => {
	if (solutions.length === 0) return null;

	return (
		<div className="mb-8">
			<h3 className="mt-8 mb-4 font-light text-3xl text-primary">Solutions</h3>
			<div className="space-y-6">
				{solutions.map((solution) => (
					<div key={solution.id} className="flex gap-8">
						<div className="w-10 font-normal text-lg text-primary">
							{solution.number}
						</div>
						<div className="flex-1">
							<h4 className="mb-3 font-normal text-lg text-primary">
								{solution.title}
							</h4>
							{solution.description && (
								<p className="mb-3 text-sm text-zinc-500 leading-normal">
									{solution.description}
								</p>
							)}
							{solution.audiences.length > 0 && (
								<div className="flex flex-wrap gap-2">
									{solution.audiences.map((audience) => (
										<span
											key={audience.id}
											className="rounded-md border border-blue-200 bg-blue-100 px-2 py-1 text-blue-800 text-sm"
										>
											{audience.title}
										</span>
									))}
								</div>
							)}
						</div>
					</div>
				))}
			</div>
		</div>
	);
};

const PreviewResources = ({
	resources,
}: { resources: PatternContentData["resources"] }) => {
	if (resources.length === 0) return null;

	return (
		<div className="mb-8">
			<h3 className="mt-8 mb-4 font-light text-3xl text-primary">Resources</h3>
			<div className="space-y-5">
				{resources.map((resource, index) => (
					<div
						key={resource.id}
						className={`border-zinc-300 border-t border-dashed pt-5 pb-5 ${
							index === resources.length - 1 ? "border-b" : ""
						}`}
					>
						<h4 className="mb-2 font-semibold text-base text-primary">
							{resource.title}
						</h4>
						{resource.description && (
							<p className="mb-3 text-sm text-zinc-500 leading-normal">
								{resource.description}
							</p>
						)}
						{resource.relatedSolutions.length > 0 && (
							<p className="text-gray-600 text-xs italic">
								Related solutions: {resource.relatedSolutions.join(", ")}
							</p>
						)}
					</div>
				))}
			</div>
		</div>
	);
};

const PreviewPatternNotes = ({
	notes,
	dateAdded,
}: { notes?: string; dateAdded?: string }) => {
	if (!notes && !dateAdded) return null;

	return (
		<div className="mt-5 border-gray-200 border-t pt-4">
			{dateAdded && (
				<div className="mb-2">
					<h5 className="mb-2 font-semibold text-gray-700 text-sm">
						Added to Carrier Bag
					</h5>
					<p className="text-gray-600 text-xs leading-normal">
						{new Date(dateAdded).toLocaleDateString()}
					</p>
				</div>
			)}
			{notes && (
				<div>
					<h5 className="mb-2 font-semibold text-gray-700 text-sm">
						Your Notes
					</h5>
					<p className="text-gray-600 text-xs leading-normal">{notes}</p>
				</div>
			)}
		</div>
	);
};

const PreviewPatternPage = ({ pattern }: { pattern: PatternContentData }) => (
	<div className="bg-white p-10">
		{/* Pattern Header */}
		<h2 className="mb-5 font-light text-3xl text-primary capitalize">
			{pattern.header.title}
		</h2>

		{pattern.header.description && (
			<p className="mb-6 text-primary text-sm leading-normal">
				{pattern.header.description}
			</p>
		)}

		{/* Pattern Connections */}
		<PreviewPatternConnections connections={pattern.connections} />

		{/* Solutions */}
		<PreviewSolutions solutions={pattern.solutions} />

		{/* Resources */}
		<PreviewResources resources={pattern.resources} />

		{/* Personal Notes */}
		<PreviewPatternNotes notes={pattern.notes} dateAdded={pattern.dateAdded} />
	</div>
);

export function PDFPreviewModal({
	documentData,
	disabled = false,
	children,
}: PDFPreviewModalProps) {
	const [isOpen, setIsOpen] = useState(false);
	const [isDownloading, setIsDownloading] = useState(false);

	const handleDownloadPDF = async () => {
		if (documentData.patterns.length === 0) {
			toast.error("No patterns to export");
			return;
		}

		setIsDownloading(true);
		try {
			await downloadCarrierBagPDF(documentData);
			toast.success("PDF downloaded successfully!");
			setIsOpen(false);
		} catch (error) {
			console.error("PDF generation error:", error);
			toast.error("Failed to generate PDF. Please try again.");
		} finally {
			setIsDownloading(false);
		}
	};

	const trigger = children || (
		<Button
			variant="outline"
			size="sm"
			disabled={disabled}
			className="flex items-center gap-2"
		>
			<Icon icon={EyeIcon} size={14} />
			Preview & Download PDF
		</Button>
	);

	return (
		<Dialog open={isOpen} onOpenChange={setIsOpen}>
			<DialogTrigger asChild>{trigger}</DialogTrigger>
			<DialogContent className="max-h-[90vh] max-w-4xl">
				<DialogHeader>
					<DialogTitle className="flex items-center gap-2">
						<Icon icon={EyeIcon} size={20} />
						PDF Preview
					</DialogTitle>
					<DialogDescription>
						Preview your carrier bag export before downloading. Each pattern
						will appear on a separate page in the PDF.
					</DialogDescription>
				</DialogHeader>

				<ScrollArea className="h-[60vh] rounded-lg border">
					<div className="space-y-1">
						{/* Cover Page */}
						<div className="border-gray-200 border-b-2">
							<PreviewCoverPage documentData={documentData} />
						</div>

						{/* Table of Contents */}
						{documentData.hasTableOfContents && (
							<div className="border-gray-200 border-b-2">
								<PreviewTableOfContents documentData={documentData} />
							</div>
						)}

						{/* Pattern Pages */}
						{documentData.patterns.map((pattern, index) => (
							<div
								key={pattern.header.title}
								className="border-gray-200 border-b-2"
							>
								<PreviewPatternPage pattern={pattern} />
								{index < documentData.patterns.length - 1 && (
									<div className="bg-gray-100 px-10 py-2 text-center text-gray-500 text-xs">
										— Page Break —
									</div>
								)}
							</div>
						))}
					</div>
				</ScrollArea>

				<DialogFooter className="flex items-center justify-between">
					<div className="text-muted-foreground text-sm">
						{documentData.patterns.length} pattern
						{documentData.patterns.length !== 1 ? "s" : ""} •
						{documentData.hasTableOfContents
							? documentData.patterns.length + 2
							: documentData.patterns.length + 1}{" "}
						pages
					</div>
					<div className="flex gap-2">
						<Button
							variant="outline"
							onClick={() => setIsOpen(false)}
							disabled={isDownloading}
						>
							Cancel
						</Button>
						<Button
							onClick={handleDownloadPDF}
							disabled={isDownloading || documentData.patterns.length === 0}
							className="flex items-center gap-2"
						>
							<Icon icon={Download03Icon} size={14} />
							{isDownloading ? "Generating..." : "Download PDF"}
						</Button>
					</div>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
