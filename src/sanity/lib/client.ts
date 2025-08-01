import { createClient } from "next-sanity";

import { apiVersion, dataset, projectId, studioUrl } from "~/sanity/env";

export const client = createClient({
	projectId,
	dataset,
	apiVersion,
	useCdn: true, // Set to false if statically generating pages, using ISR or tag-based revalidation
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
