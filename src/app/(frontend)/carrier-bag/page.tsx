import type { Metadata } from "next";
import Link from "next/link";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "~/components/ui/card";
import { Button } from "~/components/ui/button";

export const metadata: Metadata = {
  title: "Carrier Bag | DIGITCORE Toolkit",
  description:
    "Personal space to collect and organize patterns inspired by the carrier bag theory.",
};

export default function CarrierBag() {
  return (
    <section className="space-y-10">
      {/* Page header */}
      <header className="space-y-4">
        <h1 className="text-3xl font-bold">Your Carrier Bag</h1>
        <p className="max-w-2xl">
          Inspired by Ursula K. Le Guin’s “carrier bag theory,” this space lets
          you gather, annotate, and export patterns relevant to your projects.
        </p>
      </header>

      {/* Empty-state placeholder */}
      <Card role="status" aria-live="polite" className="text-center">
        <CardHeader>
          <CardTitle>No patterns saved yet</CardTitle>
          <CardDescription>
            Browse patterns and select “Save to carrier bag” to build your
            collection.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="link" asChild>
            <Link href="/tags">Browse patterns</Link>
          </Button>
        </CardContent>
      </Card>
    </section>
  );
}
