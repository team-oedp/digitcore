"use client";

import { Download03Icon, EyeIcon } from "@hugeicons/core-free-icons";
import { pdf } from "@react-pdf/renderer";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Icon } from "~/components/shared/icon";
import { Badge } from "~/components/ui/badge";
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
import { Skeleton } from "~/components/ui/skeleton";
import type {
	CarrierBagDocumentData,
	PatternContentData,
} from "~/hooks/use-pattern-content";
import { svgToPngCached } from "~/lib/svg-to-png";
import { CarrierBagPDFDocument, downloadCarrierBagPDF } from "./pdf-components";

type PDFPreviewModalProps = {
	documentData: CarrierBagDocumentData;
	disabled?: boolean;
	children?: React.ReactNode;
};

// A4 dimensions: 595px x 842px (scaled down for preview)
const A4_WIDTH = 420; // Scaled down from 595px for better fit in modal
const A4_HEIGHT = 594; // Scaled down from 842px for better fit in modal

// Web preview components that match the PDF layout
const PreviewCoverPage = ({
	documentData,
}: { documentData: CarrierBagDocumentData }) => (
	<div
		className="relative flex flex-col items-center justify-center bg-white text-center"
		style={{ width: A4_WIDTH, height: A4_HEIGHT, padding: "28px" }}
	>
		<div className="text-center text-muted-foreground">
			<div className="mb-3 text-sm">A collection of patterns from the</div>
			<div className="mb-3 flex items-center justify-center gap-2">
				<img src="/pattern-logo.svg" alt="Digitcore Logo" className="h-5 w-5" />
				<span className="text-base uppercase">DIGITCORE</span>
			</div>
			<div className="text-sm">Toolkit</div>
		</div>
		<div className="absolute right-0 bottom-5 left-0 flex justify-between px-7 text-gray-400 text-xs">
			<span>Open Environmental Data Project</span>
			<span>
				1/
				{documentData.hasTableOfContents
					? documentData.patterns.length + 2
					: documentData.patterns.length + 1}
			</span>
			<span>{documentData.date}</span>
		</div>
	</div>
);

const PreviewTableOfContents = ({
	documentData,
}: { documentData: CarrierBagDocumentData }) => (
	<div
		className="relative bg-white"
		style={{ width: A4_WIDTH, height: A4_HEIGHT, padding: "28px" }}
	>
		<h2 className="mb-7 font-light text-primary text-xl">Contents</h2>
		<div className="space-y-2">
			{documentData.patterns.map((pattern, index) => (
				<div
					key={pattern.header.title}
					className="flex justify-between border-neutral-100 border-b py-2"
				>
					<span className="mr-3 flex-1 text-primary text-sm capitalize">
						{pattern.header.title}
					</span>
					<span className="text-muted-foreground text-xs">{index + 3}</span>
				</div>
			))}
		</div>

		{/* Page Footer */}
		<div className="absolute right-0 bottom-5 left-0 flex justify-between px-7 text-gray-400 text-xs">
			<span>Open Environmental Data Project</span>
			<span>2/{documentData.patterns.length + 2}</span>
			<span>{new Date().toLocaleDateString()}</span>
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
					<h4 className="mb-2 font-semibold text-neutral-700 text-xs uppercase">
						{connection.title}
					</h4>
					<div className="flex flex-wrap gap-2">
						{connection.items.map((item) => (
							<span
								key={item.id}
								className="rounded bg-gray-200 px-2 py-1 text-neutral-700 text-xs"
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
		<div className="mb-6">
			<h3 className="mt-6 mb-3 font-light text-primary text-xl">Solutions</h3>
			<div className="space-y-4">
				{solutions.map((solution) => (
					<div key={solution.id} className="flex gap-5">
						<div className="w-7 font-normal text-base text-primary">
							{solution.number}
						</div>
						<div className="flex-1">
							<h4 className="mb-2 font-normal text-base text-primary">
								{solution.title}
							</h4>
							{solution.description && (
								<p className="mb-2 text-xs text-zinc-500 leading-relaxed">
									{solution.description}
								</p>
							)}
							{solution.audiences.length > 0 && (
								<div className="flex flex-wrap gap-1">
									{solution.audiences.map((audience) => (
										<Badge key={audience.id} variant="audience">
											{audience.title}
										</Badge>
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
		<div className="mb-6">
			<h3 className="mt-6 mb-3 font-light text-primary text-xl">Resources</h3>
			<div className="space-y-4">
				{resources.map((resource, index) => (
					<div
						key={resource.id}
						className={`border-neutral-300 border-t border-dashed pt-4 pb-4 ${
							index === resources.length - 1 ? "border-b" : ""
						}`}
					>
						<h4 className="mb-2 font-semibold text-primary text-sm">
							{resource.title}
						</h4>
						{resource.description && (
							<p className="mb-2 text-xs text-zinc-500 leading-relaxed">
								{resource.description}
							</p>
						)}
						{resource.relatedSolutions.length > 0 && (
							<p className="text-neutral-600 text-xs italic">
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
	if (!notes) return null;

	return (
		<div className="mt-5 border-gray-200 border-t pt-4">
			<h5 className="mb-2 font-semibold text-neutral-700 text-sm">
				Your Notes
			</h5>
			<p className="text-neutral-600 text-xs leading-normal">{notes}</p>
		</div>
	);
};

const PreviewPatternPage = ({
	pattern,
	pageNumber,
	totalPages,
}: {
	pattern: PatternContentData;
	pageNumber: number;
	totalPages: number;
}) => (
	<div
		className="relative overflow-auto bg-white"
		style={{ width: A4_WIDTH, minHeight: A4_HEIGHT, padding: "28px" }}
	>
		{/* Pattern Header */}
		<h2 className="mb-4 font-light text-2xl text-primary capitalize">
			{pattern.header.title}
		</h2>

		{pattern.header.description && (
			<p className="mb-5 text-primary text-sm leading-normal">
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

		{/* Page Footer */}
		<div className="absolute right-0 bottom-5 left-0 flex justify-between px-7 text-gray-400 text-xs">
			<span>Open Environmental Data Project</span>
			<span>
				{pageNumber}/{totalPages}
			</span>
			<span>{new Date().toLocaleDateString()}</span>
		</div>
	</div>
);

export function PDFPreviewModal({
	documentData,
	disabled = false,
	children,
}: PDFPreviewModalProps) {
	const [isOpen, setIsOpen] = useState(false);
	const [isDownloading, setIsDownloading] = useState(false);

	// Generate PNG logo once for preview so it matches the downloaded PDF
	const [logoDataUri, setLogoDataUri] = useState<string | undefined>();
	const [previewUrl, setPreviewUrl] = useState<string | undefined>();
	const previewUrlRef = useRef<string | undefined>(undefined);
	const [isGeneratingPreview, setIsGeneratingPreview] = useState(false);
	const [actualPageCount, setActualPageCount] = useState<number | null>(null);

	useEffect(() => {
		// Only run in browser
		svgToPngCached("/pattern-logo.svg", {
			width: 16,
			height: 16,
			scale: 2,
		})
			.then(setLogoDataUri)
			.catch(() => {
				/* silently ignore logo failures */
			});
	}, []);

	// Generate PDF when the modal is opened or when the pattern count changes.
	const patternCountRef = useRef<number | undefined>(undefined);
	useEffect(() => {
		if (!isOpen) return;

		// Avoid regenerating continuously if parent re-renders
		if (
			patternCountRef.current === documentData.patterns.length &&
			previewUrlRef.current
		) {
			return;
		}
		patternCountRef.current = documentData.patterns.length;

		(async () => {
			setIsGeneratingPreview(true);
			try {
				const pdfDoc = pdf(
					<CarrierBagPDFDocument
						documentData={documentData}
						logoDataUri={logoDataUri}
					/>,
				);

				const blob = await pdfDoc.toBlob();

				// Get page count from the PDF
				const pageCount = await new Promise<number>((resolve) => {
					const reader = new FileReader();
					reader.onload = () => {
						const text = reader.result as string;
						const matches = text.match(/\/Type\s*\/Page\s/g);
						resolve(matches ? matches.length : 1);
					};
					reader.readAsText(blob);
				});

				setActualPageCount(pageCount);

				// Revoke old URL (if any) to avoid leaks
				if (previewUrlRef.current) {
					URL.revokeObjectURL(previewUrlRef.current);
				}

				const url = URL.createObjectURL(blob);

				previewUrlRef.current = url;
				setPreviewUrl(url);
			} catch (error) {
				console.error("Failed to generate PDF preview", error);
				toast.error("Failed to render PDF preview");
			} finally {
				setIsGeneratingPreview(false);
			}
		})();
	}, [isOpen, documentData, logoDataUri]);

	// Revoke the object URL when the modal closes or component unmounts
	useEffect(() => {
		if (isOpen) return;

		if (previewUrlRef.current) {
			URL.revokeObjectURL(previewUrlRef.current);
			previewUrlRef.current = undefined;
			setPreviewUrl(undefined);
		}
	}, [isOpen]);

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
			<DialogContent className="flex max-h-[90vh] max-w-4xl flex-col">
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

				<div
					className="flex-1 overflow-auto rounded-sm border bg-white"
					style={{ aspectRatio: "1 / 1.414", maxHeight: "75vh" }}
				>
					{isGeneratingPreview && (
						<div className="flex h-full w-full flex-col gap-4 p-6">
							<Skeleton className="h-full w-full rounded-md" />
						</div>
					)}
					{!isGeneratingPreview && previewUrl && (
						<embed
							src={`${previewUrl}#toolbar=0&navpanes=0&scrollbar=0&view=FitH`}
							type="application/pdf"
							className="h-full w-full"
							style={{ backgroundColor: "white" }}
						/>
					)}
				</div>

				<DialogFooter className="mt-auto flex items-center border-t py-4">
					<div className="flex w-full gap-2">
						<Button
							variant="outline"
							onClick={() => setIsOpen(false)}
							disabled={isDownloading}
							className="flex-1"
						>
							Cancel
						</Button>
						<Button
							onClick={handleDownloadPDF}
							disabled={isDownloading || documentData.patterns.length === 0}
							className="flex flex-1 items-center gap-2"
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
