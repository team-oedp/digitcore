"use client";

import { useState } from "react";
import { submitSuggestion } from "~/app/actions/submit-suggestion";
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
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";

type SuggestSolutionModalProps = {
	patternName: string;
	patternSlug: string;
	trigger: React.ReactNode;
};

export function SuggestSolutionModal({
	patternName,
	patternSlug,
	trigger,
}: SuggestSolutionModalProps) {
	const [isOpen, setIsOpen] = useState(false);
	const [formData, setFormData] = useState({
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

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		await submitSuggestion({
			patternName,
			patternSlug,
			newSolutions: formData.newSolutions,
			newResources: formData.newResources,
			additionalFeedback: formData.additionalFeedback,
			nameAndAffiliation: formData.nameAndAffiliation,
			email: formData.email,
		});

		setIsOpen(false);
		// Reset form
		setFormData({
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
					<div className="space-y-3">
						<Label className="block">Pattern</Label>
						<Badge variant="secondary">{patternName}</Badge>
					</div>

					<div>
						<Label htmlFor="newSolutions" className="pb-2">
							New Solution(s)
						</Label>
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

					<div>
						<Label htmlFor="newResources" className="pb-2">
							New Resource(s)
						</Label>
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

					<div>
						<Label htmlFor="additionalFeedback" className="pb-2">
							Additional Feedback
						</Label>
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

					<div>
						<Label htmlFor="nameAndAffiliation" className="pb-2">
							Name and Affiliation
						</Label>
						<Input
							id="nameAndAffiliation"
							placeholder="If you would like to be credited on the website, how would you like your name and affiliation to be listed? (Full name and max 2 affiliations)"
							value={formData.nameAndAffiliation}
							onChange={(e) =>
								handleInputChange("nameAndAffiliation", e.target.value)
							}
						/>
					</div>

					<div>
						<Label htmlFor="email" className="pb-2">
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

					<DialogFooter className="flex w-full gap-2">
						<Button
							className="flex-1"
							type="button"
							variant="outline"
							onClick={() => setIsOpen(false)}
						>
							Cancel
						</Button>
						<Button type="submit" className="flex-1">
							Submit Suggestion
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
