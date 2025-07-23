import type { Metadata } from "next";
import { Input } from "~/components/ui/input";
import { Card, CardContent } from "~/components/ui/card";

export const metadata: Metadata = {
  title: "Glossary | DIGITCORE Toolkit",
  description:
    "Searchable reference for key terms and concepts used in the toolkit.",
};

export default function GlossaryPage() {
  return (
    <section className="space-y-10">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold">Glossary</h1>
        <p className="text-muted-foreground">
          Definitions of technical terms, community engagement concepts, and
          environmental justice vocabulary.
        </p>
        {/* Search input */}
        <div className="max-w-md">
          <Input type="search" placeholder="Search terms…" />
        </div>
      </header>

      {/* Alphabetical term list placeholder */}
      <Card aria-live="polite">
        <CardContent>
          <p className="text-muted-foreground">
            No terms available. Glossary content coming soon.
          </p>
        </CardContent>
      </Card>
    </section>
  );
}
