"use client";

import { useState } from "react";
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
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "~/components/ui/select";

type SuggestSolutionModalProps = {
	patternName: string;
	trigger: React.ReactNode;
};

const PATTERN_OPTIONS = [
	"Enhance frontline communities' agency",
	"Respect frontline communities' time and effort",
	"Build inclusive collaboration",
	"Practice transparent communication",
	"Ensure data sovereignty",
	"Foster community ownership",
	"Create accessible tools",
	"Support local knowledge",
	"Enable community control",
	"Promote environmental justice",
	"Build trust through accountability",
	"Respect cultural protocols",
	"Ensure equitable participation",
	"Support capacity building",
	"Create sustainable partnerships",
	"Honor indigenous knowledge",
	"Enable community-led research",
	"Support grassroots organizing",
	"Build solidarity networks",
	"Create transformative outcomes",
	"Enable collective action",
	"Support community resilience",
];

export function SuggestSolutionModal({
	patternName,
	trigger,
}: SuggestSolutionModalProps) {
	const [isOpen, setIsOpen] = useState(false);
	const [formData, setFormData] = useState({
		pattern: patternName,
		newSolutions: "",
		newResources: "",
		additionalFeedback: "",
		nameAndAffiliation: "",
		email: "",
	});

	const handleInputChange = (field: string, value: string) => {
		setFormData((prev) => ({
			...prev,
			[field]: value,
		}));
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		console.log("Form submitted:", formData);
		// Here you would typically send the data to your backend or Google Forms
		setIsOpen(false);
		// Reset form
		setFormData({
			pattern: patternName,
			newSolutions: "",
			newResources: "",
			additionalFeedback: "",
			nameAndAffiliation: "",
			email: "",
		});
	};

	return (
		<Dialog open={isOpen} onOpenChange={setIsOpen}>
			<DialogTrigger asChild>{trigger}</DialogTrigger>
			<DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
				<DialogHeader>
					<DialogTitle>Suggest Solution</DialogTitle>
					<DialogDescription>
						Help us improve the Digital Toolkit for Collaborative Environmental
						Research by suggesting new solutions and resources.
					</DialogDescription>
				</DialogHeader>

				<form onSubmit={handleSubmit} className="space-y-6">
					<div className="space-y-2">
						<Label htmlFor="pattern">
							Pattern <span className="text-red-500">*</span>
						</Label>
						<Select
							value={formData.pattern}
							onValueChange={(value) => handleInputChange("pattern", value)}
						>
							<SelectTrigger>
								<SelectValue placeholder="Please select the pattern that you'd like to contribute to" />
							</SelectTrigger>
							<SelectContent>
								{PATTERN_OPTIONS.map((option) => (
									<SelectItem key={option} value={option}>
										{option}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>

					<div className="space-y-2">
						<Label htmlFor="newSolutions">New Solution(s)</Label>
						<textarea
							id="newSolutions"
							className="flex min-h-[120px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
							placeholder="What new solution(s) would you like to add for this pattern?"
							value={formData.newSolutions}
							onChange={(e) =>
								handleInputChange("newSolutions", e.target.value)
							}
						/>
					</div>

					<div className="space-y-2">
						<Label htmlFor="newResources">New Resource(s)</Label>
						<textarea
							id="newResources"
							className="flex min-h-[120px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
							placeholder="What new resource(s) would you like to add for this pattern? Please reference a solution and provide a URL if applicable."
							value={formData.newResources}
							onChange={(e) =>
								handleInputChange("newResources", e.target.value)
							}
						/>
					</div>

					<div className="space-y-2">
						<Label htmlFor="additionalFeedback">Additional Feedback</Label>
						<textarea
							id="additionalFeedback"
							className="flex min-h-[120px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
							placeholder="Do you have any additional feedback on the Pattern or Toolkit?"
							value={formData.additionalFeedback}
							onChange={(e) =>
								handleInputChange("additionalFeedback", e.target.value)
							}
						/>
					</div>

					<div className="space-y-2">
						<Label htmlFor="nameAndAffiliation">Name and Affiliation</Label>
						<Input
							id="nameAndAffiliation"
							placeholder="If you would like to be credited on the website, how would you like your name and affiliation to be listed? (Full name and max 2 affiliations)"
							value={formData.nameAndAffiliation}
							onChange={(e) =>
								handleInputChange("nameAndAffiliation", e.target.value)
							}
						/>
					</div>

					<div className="space-y-2">
						<Label htmlFor="email">
							Email <span className="text-red-500">*</span>
						</Label>
						<Input
							id="email"
							type="email"
							placeholder="What email can we use to reach out to you if we have further questions? (Enter 'N/A' for anonymous submission)"
							value={formData.email}
							onChange={(e) => handleInputChange("email", e.target.value)}
							required
						/>
					</div>

					<DialogFooter>
						<Button
							type="button"
							variant="outline"
							onClick={() => setIsOpen(false)}
						>
							Cancel
						</Button>
						<Button type="submit">Submit Suggestion</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
