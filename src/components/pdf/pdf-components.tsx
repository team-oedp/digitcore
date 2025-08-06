/**
 * PDF-specific components with page control and print optimization
 */

"use client";

import {
	Document,
	Font,
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
	pageNumber: {
		position: "absolute",
		fontSize: 10,
		bottom: 20,
		right: 40,
		color: "#9ca3af",
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
interface PDFCoverPageProps {
	documentData: CarrierBagDocumentData;
}

const PDFCoverPage = ({ documentData }: PDFCoverPageProps) => (
	<Page size="A4" style={styles.page}>
		<View style={styles.coverPage}>
			<Text style={styles.coverTitle}>
				{applyTextTransform(documentData.title, "capitalize")}
			</Text>
			<Text style={styles.coverSubtitle}>{documentData.subtitle}</Text>
			<Text style={styles.coverMeta}>Generated on {documentData.date}</Text>
			<Text style={styles.coverMeta}>
				{documentData.patternCount} pattern
				{documentData.patternCount !== 1 ? "s" : ""} collected
			</Text>
		</View>
	</Page>
);

// Table of Contents Component
interface PDFTableOfContentsProps {
	documentData: CarrierBagDocumentData;
}

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
	</Page>
);

// Pattern Connections Component
interface PDFPatternConnectionsProps {
	connections: PatternConnectionData[];
}

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
interface PDFSolutionsProps {
	solutions: SolutionData[];
}

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
interface PDFResourcesProps {
	resources: ResourceData[];
}

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
interface PDFPatternNotesProps {
	notes?: string;
	dateAdded?: string;
}

const PDFPatternNotes = ({ notes, dateAdded }: PDFPatternNotesProps) => {
	if (!notes && !dateAdded) return null;

	return (
		<View style={styles.notesContainer}>
			{dateAdded && (
				<>
					<Text style={styles.notesTitle}>Added to Carrier Bag</Text>
					<Text style={styles.notesText}>
						{new Date(dateAdded).toLocaleDateString()}
					</Text>
				</>
			)}
			{notes && (
				<>
					<Text style={styles.notesTitle}>Your Notes</Text>
					<Text style={styles.notesText}>{notes}</Text>
				</>
			)}
		</View>
	);
};

// Individual Pattern Page Component
interface PDFPatternPageProps {
	pattern: PatternContentData;
	pageNumber?: number;
}

const PDFPatternPage = ({ pattern }: PDFPatternPageProps) => (
	<Page size="A4" style={styles.page} break>
		<Text
			style={styles.pageNumber}
			render={({ pageNumber }) => `${pageNumber}`}
			fixed
		/>

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
	</Page>
);

// Main Document Component
interface CarrierBagPDFDocumentProps {
	documentData: CarrierBagDocumentData;
}

export const CarrierBagPDFDocument = ({
	documentData,
}: CarrierBagPDFDocumentProps) => (
	<Document title={`${documentData.title} - ${documentData.date}`}>
		{/* Cover Page */}
		<PDFCoverPage documentData={documentData} />

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

// Export function to generate and download PDF
export const downloadCarrierBagPDF = async (
	documentData: CarrierBagDocumentData,
) => {
	if (documentData.patterns.length === 0) {
		throw new Error("No patterns to export");
	}

	try {
		const blob = await pdf(
			<CarrierBagPDFDocument documentData={documentData} />,
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
