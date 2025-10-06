/**
 * PDF-specific components with page control and print optimization
 */

"use client";

import {
	Document,
	Font,
	Image,
	Page,
	StyleSheet,
	Text,
	View,
	pdf,
} from "@react-pdf/renderer";
import type {
	CarrierBagDocumentData,
	PatternConnectionData,
	PatternContentData,
	ResourceData,
	SolutionData,
} from "~/hooks/use-pattern-content";
import { applyTextTransform } from "~/lib/style-adapters";
import { svgToPngCached } from "~/lib/svg-to-png";

// Register UntitledSans font variants for PDF rendering
Font.register({
	family: "UntitledSans",
	src: "/fonts/UntitledSans/UntitledSans-Light.ttf",
	fontWeight: 300,
	fontStyle: "normal",
});
Font.register({
	family: "UntitledSans",
	src: "/fonts/UntitledSans/UntitledSans-LightItalic.ttf",
	fontWeight: 300,
	fontStyle: "italic",
});
Font.register({
	family: "UntitledSans",
	src: "/fonts/UntitledSans/UntitledSans-Regular.ttf",
	fontWeight: 400,
	fontStyle: "normal",
});
Font.register({
	family: "UntitledSans",
	src: "/fonts/UntitledSans/UntitledSans-RegularItalic.ttf",
	fontWeight: 400,
	fontStyle: "italic",
});
Font.register({
	family: "UntitledSans",
	src: "/fonts/UntitledSans/UntitledSans-Medium.ttf",
	fontWeight: 500,
	fontStyle: "normal",
});
Font.register({
	family: "UntitledSans",
	src: "/fonts/UntitledSans/UntitledSans-MediumItalic.ttf",
	fontWeight: 500,
	fontStyle: "italic",
});
Font.register({
	family: "UntitledSans",
	src: "/fonts/UntitledSans/UntitledSans-Bold.ttf",
	fontWeight: 700,
	fontStyle: "normal",
});
Font.register({
	family: "UntitledSans",
	src: "/fonts/UntitledSans/UntitledSans-BoldItalic.ttf",
	fontWeight: 700,
	fontStyle: "italic",
});
Font.register({
	family: "UntitledSans",
	src: "/fonts/UntitledSans/UntitledSans-Black.ttf",
	fontWeight: 900,
	fontStyle: "normal",
});
Font.register({
	family: "UntitledSans",
	src: "/fonts/UntitledSans/UntitledSans-BlackItalic.ttf",
	fontWeight: 900,
	fontStyle: "italic",
});

// Create StyleSheet optimized for PDF layout
const styles = StyleSheet.create({
	page: {
		flexDirection: "column",
		backgroundColor: "#ffffff",
		padding: 40,
		fontFamily: "UntitledSans", // Use UntitledSans for PDF rendering
		fontSize: 12,
		lineHeight: 1.6, // Increased for better readability
		color: "#000000",
	},
	watermark: {
		position: "absolute",
		fontSize: 8,
		bottom: 12, // Moved down by 8px
		left: 40,
		right: 40,
		color: "#9ca3af",
		flexDirection: "row",
		justifyContent: "center",
		alignItems: "center",
	},
	watermarkIcon: {
		width: 10,
		height: 10,
		marginRight: 4,
		paddingTop: 2,
		alignSelf: "flex-start",
	},
	watermarkRow: {
		flexDirection: "row",
		alignItems: "baseline", // Align items on their text baseline
		justifyContent: "center",
	},
	// Style for rotated pattern name in margin
	patternMarginLabel: {
		position: "absolute",
		top: 14,
		left: 0,
		right: 0,
		textAlign: "center",
		fontSize: 8,
		color: "#9ca3af",
		letterSpacing: 1,
	},
	// Cover page styles
	coverPage: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		textAlign: "center",
	},
	coverTitle: {
		fontSize: 28, // Slightly smaller for better PDF layout
		fontWeight: 300,
		color: "#000000",
		marginBottom: 24,
		lineHeight: 1.2,
	},
	coverSubtitle: {
		fontSize: 17, // 20% larger than 14
		color: "#71717a",
		marginBottom: 40,
		lineHeight: 1.4,
		textAlign: "center",
		alignItems: "center",
	},
	coverSubtitleRow: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		gap: 8,
		marginBottom: 12,
		fontSize: 19, // 20% larger than 16
	},
	coverSubtitleText: {
		textAlign: "center",
		marginBottom: 12,
	},
	coverMeta: {
		fontSize: 12,
		color: "#a1a1aa",
		lineHeight: 1.4,
		marginBottom: 8,
	},
	// TOC styles
	tocTitle: {
		fontSize: 24,
		fontWeight: 300,
		color: "#000000",
		marginBottom: 30,
		lineHeight: 1.3,
	},
	tocItem: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "flex-start", // Changed from center for better alignment
		paddingVertical: 8,
		borderBottomWidth: 1,
		borderBottomColor: "#f4f4f5",
	},
	tocItemTitle: {
		fontSize: 14,
		color: "#000000",
		lineHeight: 1.4,
		flex: 1, // Allow text to wrap
		marginRight: 10,
	},
	tocItemPage: {
		fontSize: 12,
		color: "#71717a",
		lineHeight: 1.4,
	},
	// Pattern styles with improved spacing - match web UI sizing
	patternTitle: {
		fontSize: 28, // Match web UI desktop size (32px would be too large for PDF)
		fontWeight: 300,
		color: "#000000",
		marginBottom: 20,
		lineHeight: 1.3, // Tighter line height for titles
	},
	patternDescription: {
		fontSize: 14,
		color: "#000000",
		marginBottom: 25,
		lineHeight: 1.6, // More generous line height for body text
	},
	sectionTitle: {
		fontSize: 28, // Match web UI desktop size (32px) - closer to web experience
		fontWeight: 300,
		color: "#000000",
		marginTop: 30,
		marginBottom: 15,
		lineHeight: 1.3,
	},
	// Connection styles
	connectionContainer: {
		marginBottom: 30,
	},
	connectionSection: {
		marginBottom: 15,
	},
	connectionTitle: {
		fontSize: 10,
		fontWeight: 600,
		color: "#374151",
		textTransform: "uppercase",
		marginBottom: 8,
		lineHeight: 1.3,
	},
	tagContainer: {
		flexDirection: "row",
		flexWrap: "wrap",
		gap: 6,
	},
	// Theme badge styles - match web UI ochre colors
	themeTag: {
		backgroundColor: "#fef3e2", // ochre-light equivalent
		borderColor: "#f59e0b", // ochre-default equivalent
		borderWidth: 1,
		color: "#92400e", // ochre-dark equivalent
		fontSize: 10,
		paddingHorizontal: 8,
		paddingVertical: 4,
		borderRadius: 4,
		lineHeight: 1.2,
	},
	// Audience badge styles - match web UI cerulean colors
	audienceTag: {
		backgroundColor: "#dbeafe", // cerulean-light equivalent
		borderColor: "#3b82f6", // cerulean-default equivalent
		borderWidth: 1,
		color: "#1e40af", // cerulean-dark equivalent
		fontSize: 10,
		paddingHorizontal: 8,
		paddingVertical: 4,
		borderRadius: 4,
		lineHeight: 1.2,
	},
	// Tag badge styles - match web UI purple colors
	tagBadge: {
		backgroundColor: "#f3e8ff", // purple-light equivalent
		borderColor: "#a855f7", // purple-default equivalent
		borderWidth: 1,
		color: "#7c2d12", // purple-dark equivalent
		fontSize: 10,
		paddingHorizontal: 8,
		paddingVertical: 4,
		borderRadius: 4,
		lineHeight: 1.2,
	},
	// Solution styles with better spacing - match web UI
	solutionContainer: {
		marginBottom: 25,
	},
	solutionHeader: {
		flexDirection: "row",
		alignItems: "flex-start",
		gap: 24, // Match web UI gap-4 md:gap-8 (32px at desktop)
		marginBottom: 10,
	},
	solutionNumber: {
		fontSize: 18, // Match web UI desktop size (18px)
		fontWeight: 400,
		color: "#000000",
		width: 32, // Match web UI w-8 md:w-10 (40px at desktop)
		lineHeight: 1.25, // Match web UI leading-[22px] at 18px font
	},
	solutionContent: {
		flex: 1,
	},
	solutionTitle: {
		fontSize: 18, // Match web UI desktop size (18px)
		fontWeight: 400,
		color: "#000000",
		marginBottom: 10,
		lineHeight: 1.25, // Match web UI leading-[22px] at 18px font
	},
	solutionDescription: {
		fontSize: 14,
		color: "#71717a",
		lineHeight: 1.6,
		marginBottom: 10,
	},
	audienceContainer: {
		flexDirection: "row",
		flexWrap: "wrap",
		gap: 8, // Match web UI gap-1.5 md:gap-2 (8px at desktop)
	},
	// Solution audience badge styles - match web UI cerulean colors exactly
	solutionAudienceTag: {
		backgroundColor: "#dbeafe", // cerulean-light
		borderColor: "#3b82f6", // cerulean-default
		borderWidth: 1,
		color: "#1e40af", // cerulean-dark
		fontSize: 12,
		paddingHorizontal: 8,
		paddingVertical: 4,
		borderRadius: 6,
		lineHeight: 1.3,
	},
	// Resource styles - match web UI border colors
	resourceContainer: {
		borderTopColor: "#d1d5db", // Match neutral-300 from web UI
		borderTopWidth: 1,
		borderStyle: "dashed",
		paddingTop: 20,
		paddingBottom: 20,
	},
	resourceTitle: {
		fontSize: 18, // Match web UI desktop size and solution title consistency
		fontWeight: 400, // Match web UI font-normal
		color: "#000000",
		marginBottom: 8,
		lineHeight: 1.4,
	},
	resourceDescription: {
		fontSize: 14,
		color: "#71717a",
		lineHeight: 1.6,
		marginBottom: 12,
	},
	resourceSolutions: {
		fontSize: 12,
		color: "#6b7280",
		fontStyle: "italic",
		lineHeight: 1.4,
	},
	// Resource solution badge styles - match web UI coral colors
	resourceSolutionTag: {
		backgroundColor: "#fef2f2", // coral-light equivalent
		borderColor: "#f87171", // coral-default equivalent
		borderWidth: 1,
		color: "#dc2626", // coral-dark equivalent
		fontSize: 10,
		paddingHorizontal: 8,
		paddingVertical: 4,
		borderRadius: 4,
		lineHeight: 1.2,
	},
	// Notes styles
	notesContainer: {
		marginTop: 20,
		paddingTop: 15,
		borderTopColor: "#e5e7eb",
		borderTopWidth: 1,
	},
	notesTitle: {
		fontSize: 14,
		fontWeight: 600,
		color: "#374151",
		marginBottom: 8,
		lineHeight: 1.3,
	},
	notesText: {
		fontSize: 12,
		color: "#6b7280",
		lineHeight: 1.5,
	},
});

// Cover Page Component
type PDFCoverPageProps = {
	documentData: CarrierBagDocumentData;
	logoDataUri?: string;
};

const PDFCoverPage = ({ documentData, logoDataUri }: PDFCoverPageProps) => (
	<Page size="A4" style={styles.page}>
		<View style={styles.coverPage}>
			<View style={styles.coverSubtitle}>
				<Text style={styles.coverSubtitleText}>
					A collection of patterns from the
				</Text>
				<View style={styles.coverSubtitleRow}>
					{logoDataUri && (
						<Image src={logoDataUri} style={{ width: 24, height: 24 }} />
					)}
					<Text style={{ textTransform: "uppercase", fontSize: 19 }}>
						DIGITCORE
					</Text>
				</View>
				<Text style={styles.coverSubtitleText}>Toolkit</Text>
			</View>
		</View>
		<View style={styles.watermark} fixed>
			<View style={styles.watermarkRow}>
				<Image src="/oedp-icon.png" style={styles.watermarkIcon} />
				<Text style={{ marginRight: 8 }}>Open Environmental Data Project</Text>
				<Text style={{ marginRight: 8 }}>•</Text>
				<Text>{documentData.date}</Text>
			</View>
		</View>
	</Page>
);

// Table of Contents Component
type PDFTableOfContentsProps = {
	documentData: CarrierBagDocumentData;
};

const PDFTableOfContents = ({ documentData }: PDFTableOfContentsProps) => (
	<Page size="A4" style={styles.page}>
		<Text style={styles.tocTitle}>Contents</Text>
		{documentData.patterns.map((pattern, index) => (
			<View key={pattern.header.title} style={styles.tocItem}>
				<Text style={styles.tocItemTitle}>
					{applyTextTransform(pattern.header.title, "capitalize")}
				</Text>
				<Text style={styles.tocItemPage}>{index + 3}</Text>
			</View>
		))}
		<View style={styles.watermark} fixed>
			<View style={styles.watermarkRow}>
				<Image src="/oedp-icon.png" style={styles.watermarkIcon} />
				<Text style={{ marginRight: 8 }}>Open Environmental Data Project</Text>
				<Text style={{ marginRight: 8 }}>•</Text>
				<Text style={{ lineHeight: 1 }}>{new Date().toLocaleDateString()}</Text>
			</View>
		</View>
	</Page>
);

// Pattern Connections Component
type PDFPatternConnectionsProps = {
	connections: PatternConnectionData[];
};

const PDFPatternConnections = ({ connections }: PDFPatternConnectionsProps) => {
	if (connections.length === 0) return null;

	// Helper function to get appropriate badge style based on connection type
	const getBadgeStyle = (connectionType: string) => {
		switch (connectionType.toLowerCase()) {
			case "theme":
				return styles.themeTag;
			case "audience":
			case "audiences":
				return styles.audienceTag;
			case "tag":
			case "tags":
				return styles.tagBadge;
			default:
				return styles.tagBadge; // fallback to tag style
		}
	};

	return (
		<View style={styles.connectionContainer}>
			{connections.map((connection) => (
				<View key={connection.type} style={styles.connectionSection}>
					<Text style={styles.connectionTitle}>
						{connection.title.toUpperCase()}
					</Text>
					<View style={styles.tagContainer}>
						{connection.items.map((item) => (
							<Text key={item.id} style={getBadgeStyle(connection.type)}>
								{item.title}
							</Text>
						))}
					</View>
				</View>
			))}
		</View>
	);
};

// Solutions Component
type PDFSolutionsProps = {
	solutions: SolutionData[];
};

const PDFSolutions = ({ solutions }: PDFSolutionsProps) => {
	if (solutions.length === 0) return null;

	return (
		<View>
			<Text style={styles.sectionTitle}>Solutions</Text>
			{solutions.map((solution, _index) => (
				<View key={solution.id} style={styles.solutionContainer}>
					<View style={styles.solutionHeader}>
						<Text style={styles.solutionNumber}>{solution.number}</Text>
						<View style={styles.solutionContent}>
							<Text style={styles.solutionTitle}>{solution.title}</Text>
							{solution.description && (
								<Text style={styles.solutionDescription}>
									{solution.description}
								</Text>
							)}
							{solution.audiences.length > 0 && (
								<View style={styles.audienceContainer}>
									{solution.audiences.map((audience) => (
										<Text key={audience.id} style={styles.solutionAudienceTag}>
											{audience.title}
										</Text>
									))}
								</View>
							)}
						</View>
					</View>
				</View>
			))}
		</View>
	);
};

// Resources Component
type PDFResourcesProps = {
	resources: ResourceData[];
};

const PDFResources = ({ resources }: PDFResourcesProps) => {
	if (resources.length === 0) return null;

	return (
		<View>
			<Text style={styles.sectionTitle}>Resources</Text>
			{resources.map((resource, index) => (
				<View
					key={resource.id}
					style={[
						styles.resourceContainer,
						...(index === resources.length - 1
							? [
									{
										borderBottomColor: "#d1d5db", // Match neutral-300 from web UI
										borderBottomWidth: 1,
										borderStyle: "dashed" as const,
									},
								]
							: []),
					]}
				>
					<Text style={styles.resourceTitle}>{resource.title}</Text>
					{resource.description && (
						<Text style={styles.resourceDescription}>
							{resource.description}
						</Text>
					)}
					{resource.relatedSolutions.length > 0 && (
						<View>
							<Text style={[styles.resourceSolutions, { marginBottom: 6 }]}>
								Related solutions:
							</Text>
							<View style={styles.tagContainer}>
								{resource.relatedSolutions.map((solution) => (
									<Text key={solution} style={styles.resourceSolutionTag}>
										{solution}
									</Text>
								))}
							</View>
						</View>
					)}
				</View>
			))}
		</View>
	);
};

// Pattern Notes Component
type PDFPatternNotesProps = {
	notes?: string;
	dateAdded?: string;
};

const PDFPatternNotes = ({ notes, dateAdded }: PDFPatternNotesProps) => {
	if (!notes) return null;

	return (
		<View style={styles.notesContainer}>
			<Text style={styles.notesTitle}>Your Notes</Text>
			<Text style={styles.notesText}>{notes}</Text>
		</View>
	);
};

// Individual Pattern Page Component
type PDFPatternPageProps = {
	pattern: PatternContentData;
	pageIndex: number;
};

const PDFPatternPage = ({ pattern, pageIndex }: PDFPatternPageProps) => (
	<Page size="A4" style={styles.page} break>
		{/* Pattern Header */}
		<Text style={styles.patternTitle}>
			{applyTextTransform(pattern.header.title, "capitalize")}
		</Text>

		{pattern.header.description && (
			<Text style={styles.patternDescription}>
				{pattern.header.description}
			</Text>
		)}

		{/* Pattern Connections */}
		<PDFPatternConnections connections={pattern.connections} />

		{/* Solutions */}
		<PDFSolutions solutions={pattern.solutions} />

		{/* Resources */}
		<PDFResources resources={pattern.resources} />

		{/* Personal Notes */}
		<PDFPatternNotes notes={pattern.notes} dateAdded={pattern.dateAdded} />

		{/* Rotated Pattern Name in Right Margin */}
		<Text style={styles.patternMarginLabel} fixed>
			{applyTextTransform(pattern.header.title, "capitalize")}
		</Text>

		{/* Footer */}
		<View style={styles.watermark} fixed>
			<View style={styles.watermarkRow}>
				<Image src="/oedp-icon.png" style={styles.watermarkIcon} />
				<Text style={{ marginRight: 8 }}>Open Environmental Data Project</Text>
				<Text style={{ marginRight: 8 }}>•</Text>
				<Text style={{ lineHeight: 1 }}>{new Date().toLocaleDateString()}</Text>
			</View>
		</View>
	</Page>
);

// Main Document Component
type CarrierBagPDFDocumentProps = {
	documentData: CarrierBagDocumentData;
	logoDataUri?: string;
};

export const CarrierBagPDFDocument = ({
	documentData,
	logoDataUri,
}: CarrierBagPDFDocumentProps) => {
	return (
		<Document title={`${documentData.title} - ${documentData.date}`}>
			{/* Cover Page */}
			<PDFCoverPage documentData={documentData} logoDataUri={logoDataUri} />

			{/* Table of Contents (only if more than 1 pattern) */}
			{documentData.hasTableOfContents && (
				<PDFTableOfContents documentData={documentData} />
			)}

			{/* Pattern Pages - Each pattern starts on a new page */}
			{documentData.patterns.map((pattern, index) => (
				<PDFPatternPage
					key={pattern.header.title}
					pattern={pattern}
					pageIndex={index}
				/>
			))}
		</Document>
	);
};

// Export function to generate and download PDF
export const downloadCarrierBagPDF = async (
	documentData: CarrierBagDocumentData,
) => {
	if (documentData.patterns.length === 0) {
		throw new Error("No patterns to export");
	}

	try {
		// Convert SVG logo to PNG data URI for PDF compatibility
		let logoDataUri: string | undefined;
		try {
			logoDataUri = await svgToPngCached("/pattern-logo.svg", {
				width: 16,
				height: 16,
				scale: 2, // High resolution for crisp rendering
			});
		} catch (logoError) {
			console.warn("Failed to convert logo for PDF:", logoError);
			// Continue without logo rather than failing the entire PDF
		}

		const blob = await pdf(
			<CarrierBagPDFDocument
				documentData={documentData}
				logoDataUri={logoDataUri}
			/>,
		).toBlob();
		const url = URL.createObjectURL(blob);
		const link = document.createElement("a");

		const currentDate = new Date().toISOString().split("T")[0];
		link.href = url;
		link.download = `carrier-bag-${currentDate}.pdf`;

		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);

		URL.revokeObjectURL(url);
	} catch (error) {
		console.error("Error generating PDF:", error);
		throw new Error("Failed to generate PDF");
	}
};
