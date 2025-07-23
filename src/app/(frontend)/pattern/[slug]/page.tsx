import type { Metadata } from "next";
import { Button } from "~/components/ui/button";

export type PatternPageProps = {
  params: { slug: string };
};

export async function generateMetadata({
  params,
}: PatternPageProps): Promise<Metadata> {
  const readable = params.slug.replace(/-/g, " ");
  return {
    title: `${readable} | Pattern | DIGITCORE Toolkit`,
    description: `Learn how the ${readable} pattern can support community-centered projects.`,
  };
}

export default function PatternPage({ params }: PatternPageProps) {
  const readable = params.slug.replace(/-/g, " ");
  return (
    <article className="space-y-12">
      {/* Pattern title */}
      <header className="space-y-2">
        <h1 className="capitalize text-3xl font-bold">{readable}</h1>
        <p className="text-muted-foreground">
          Short description of the pattern’s problem and context.
        </p>
      </header>

      {/* Problem description */}
      <section>
        <h2 className="text-2xl font-semibold">Problem Description</h2>
        <p>Describe the problem this pattern addresses.</p>
      </section>

      {/* Audience-specific solutions */}
      <section>
        <h2 className="text-2xl font-semibold">Audience-Specific Solutions</h2>
        <p>Detail solutions tailored to different stakeholders.</p>
      </section>

      {/* Related tags */}
      <section>
        <h3 className="text-xl font-semibold">Related Tags</h3>
        <div className="flex flex-wrap gap-2">
          {/* Placeholder tag */}
          <span className="rounded bg-gray-200 px-2 py-1 text-sm">Tag</span>
        </div>
      </section>

      {/* Resources */}
      <section>
        <h3 className="text-xl font-semibold">Resources</h3>
        <p>Downloadable files and assets will appear here.</p>
      </section>

      {/* Real-world examples */}
      <section>
        <h3 className="text-xl font-semibold">Real-World Examples</h3>
        <p>Showcase implementations from the field.</p>
      </section>

      {/* Save to carrier bag action */}
      <div className="text-right">
        <Button>Save to Carrier Bag</Button>
      </div>
    </article>
  );
}
