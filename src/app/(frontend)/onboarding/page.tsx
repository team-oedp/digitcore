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
  title: "Onboarding | DIGITCORE Toolkit",
  description:
    "Guided introduction for first-time visitors to understand the toolkit’s purpose and navigation.",
};

export default function OnboardingPage() {
  return (
    <section className="space-y-10">
      <header className="space-y-4">
        <h1 className="text-3xl font-bold">Welcome to the DIGITCORE Toolkit</h1>
        <p>
          This brief guide will help you understand what the toolkit offers and
          where to begin based on your role.
        </p>
      </header>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Researcher card */}
        <Card>
          <CardHeader>
            <CardTitle>Researcher</CardTitle>
            <CardDescription>
              Discover patterns for equitable data collection and analysis.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="link" asChild>
              <Link href="/tags?tag=Research">Recommended patterns</Link>
            </Button>
          </CardContent>
        </Card>
        {/* Developer card */}
        <Card>
          <CardHeader>
            <CardTitle>Developer</CardTitle>
            <CardDescription>
              Find implementation guides and open-source resources.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="link" asChild>
              <Link href="/tags?tag=Development">Recommended patterns</Link>
            </Button>
          </CardContent>
        </Card>
        {/* Community organization card */}
        <Card>
          <CardHeader>
            <CardTitle>Community Organization</CardTitle>
            <CardDescription>
              Learn strategies for community agency and data sovereignty.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="link" asChild>
              <Link href="/tags?tag=Relationship%20Building">
                Recommended patterns
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
