import { createClient } from "next-sanity";

import { apiVersion, dataset, projectId, studioUrl } from "~/sanity/env";
import { token } from "./token";

export const client = createClient({
	projectId,
	dataset,
	apiVersion,
	useCdn: true, // Set to false if statically generating pages, using ISR or tag-based revalidation
	perspective: "published",
	token, // Required if you have a private dataset
	stega: {
		studioUrl,
		// Set logger to 'console' for more verbose logging
		// logger: console,
		filter: (props) => {
			if (props.sourcePath.at(-1) === "title") {
				return true;
			}

			return props.filterDefault(props);
		},
	},
});
