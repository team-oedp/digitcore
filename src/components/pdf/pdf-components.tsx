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
		bottom: 20,
		left: 40,
		right: 40,
		color: "#9ca3af",
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
	},
	watermarkCenter: {
		fontSize: 9,
		color: "#6b7280",
	},
	// Add watermarkIcon style
	watermarkIcon: {
		width: 10,
		height: 10,
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
		fontSize: 14,
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
		fontSize: 16,
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
	// Pattern styles with improved spacing
	patternTitle: {
		fontSize: 28, // Reduced from 32 for better PDF fit
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
		fontSize: 26, // Reduced from 32
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
	tag: {
		backgroundColor: "#f3f4f6",
		color: "#374151",
		fontSize: 10,
		paddingHorizontal: 8,
		paddingVertical: 4,
		borderRadius: 4,
		lineHeight: 1.2,
	},
	// Solution styles with better spacing
	solutionContainer: {
		marginBottom: 25,
	},
	solutionHeader: {
		flexDirection: "row",
		alignItems: "flex-start",
		gap: 20, // Reduced gap for better layout
		marginBottom: 10,
	},
	solutionNumber: {
		fontSize: 18,
		fontWeight: 400,
		color: "#000000",
		width: 30, // Reduced width for better proportions
		lineHeight: 1.2,
	},
	solutionContent: {
		flex: 1,
	},
	solutionTitle: {
		fontSize: 18,
		fontWeight: 400,
		color: "#000000",
		marginBottom: 10,
		lineHeight: 1.4,
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
		gap: 8,
	},
	audienceTag: {
		backgroundColor: "#dbeafe",
		borderColor: "#bfdbfe",
		borderWidth: 1,
		color: "#1e40af",
		fontSize: 12, // Reduced from 14
		paddingHorizontal: 8,
		paddingVertical: 4,
		borderRadius: 6,
		lineHeight: 1.3,
	},
	// Resource styles
	resourceContainer: {
		borderTopColor: "#d4d4d8",
		borderTopWidth: 1,
		borderStyle: "dashed",
		paddingTop: 20,
		paddingBottom: 20,
	},
	resourceTitle: {
		fontSize: 16,
		fontWeight: 600,
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
						<Image src={logoDataUri} style={{ width: 20, height: 20 }} />
					)}
					<Text style={{ textTransform: "uppercase", fontSize: 16 }}>
						DIGITCORE
					</Text>
				</View>
				<Text style={styles.coverSubtitleText}>Toolkit</Text>
			</View>
		</View>
		<View style={styles.watermark} fixed>
			<View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
				<Image src="/oedp-icon.png" style={styles.watermarkIcon} />
				<Text>Open Environmental Data Project</Text>
			</View>
			<Text
				style={styles.watermarkCenter}
				render={({ pageNumber, totalPages }) => `${pageNumber}/${totalPages}`}
			>
				{" "}
			</Text>
			<Text>{documentData.date}</Text>
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
			<View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
				<Image src="/oedp-icon.png" style={styles.watermarkIcon} />
				<Text>Open Environmental Data Project</Text>
			</View>
			<Text
				style={styles.watermarkCenter}
				render={({ pageNumber, totalPages }) => `${pageNumber}/${totalPages}`}
			>
				{" "}
			</Text>
			<Text>{new Date().toLocaleDateString()}</Text>
		</View>
	</Page>
);

// Pattern Connections Component
type PDFPatternConnectionsProps = {
	connections: PatternConnectionData[];
};

const PDFPatternConnections = ({ connections }: PDFPatternConnectionsProps) => {
	if (connections.length === 0) return null;

	return (
		<View style={styles.connectionContainer}>
			{connections.map((connection) => (
				<View key={connection.type} style={styles.connectionSection}>
					<Text style={styles.connectionTitle}>
						{connection.title.toUpperCase()}
					</Text>
					<View style={styles.tagContainer}>
						{connection.items.map((item) => (
							<Text key={item.id} style={styles.tag}>
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
			{solutions.map((solution) => (
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
										<Text key={audience.id} style={styles.audienceTag}>
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
										borderBottomColor: "#d4d4d8",
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
						<Text style={styles.resourceSolutions}>
							Related solutions: {resource.relatedSolutions.join(", ")}
						</Text>
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
};

const PDFPatternPage = ({ pattern }: PDFPatternPageProps) => (
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

		{/* Footer */}
		<View style={styles.watermark} fixed>
			<View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
				<Image src="/oedp-icon.png" style={styles.watermarkIcon} />
				<Text>Open Environmental Data Project</Text>
			</View>
			<Text
				style={styles.watermarkCenter}
				render={({ pageNumber, totalPages }) => `${pageNumber}/${totalPages}`}
			>
				{" "}
			</Text>
			<Text>{new Date().toLocaleDateString()}</Text>
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
			{documentData.patterns.map((pattern) => (
				<PDFPatternPage key={pattern.header.title} pattern={pattern} />
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
