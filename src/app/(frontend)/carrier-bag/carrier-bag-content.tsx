"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { useCarrierBagStore } from "~/stores/carrier-bag";
import { useHydration } from "~/hooks/use-hydration";
import type { CarrierBagItem } from "~/types/pattern";

interface PatternCardProps {
  item: CarrierBagItem;
  onRemove: (patternId: string) => void;
}

function PatternCard({ item, onRemove }: PatternCardProps) {
  const { pattern, dateAdded } = item;
  
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="capitalize">
              <Link 
                href={`/pattern/${pattern.slug.current}`}
                className="hover:underline"
              >
                {pattern.title}
              </Link>
            </CardTitle>
            <CardDescription>
              Added {new Date(dateAdded).toLocaleDateString()}
            </CardDescription>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onRemove(pattern._id)}
          >
            Remove
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {pattern.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {pattern.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag._id}
                  className="rounded bg-gray-200 px-2 py-1 text-xs"
                >
                  {tag.title}
                </span>
              ))}
              {pattern.tags.length > 3 && (
                <span className="text-xs text-muted-foreground">
                  +{pattern.tags.length - 3} more
                </span>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export function CarrierBagContent() {
  const hydrated = useHydration();
  const { items, removePattern } = useCarrierBagStore();

  if (!hydrated) {
    return (
      <Card role="status" aria-live="polite" className="text-center">
        <CardHeader>
          <CardTitle>Loading your carrier bag...</CardTitle>
          <CardDescription>
            Your saved patterns will appear here once loaded.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (items.length === 0) {
    return (
      <Card role="status" aria-live="polite" className="text-center">
        <CardHeader>
          <CardTitle>No patterns saved yet</CardTitle>
          <CardDescription>
            Browse patterns and select "Save to carrier bag" to build your
            collection.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="link" asChild>
            <Link href="/tags">Browse patterns</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <p className="text-muted-foreground">
          {items.length} pattern{items.length !== 1 ? 's' : ''} in your bag
        </p>
        <Button variant="outline" size="sm" asChild>
          <Link href="/tags">Browse more patterns</Link>
        </Button>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {items.map((item: CarrierBagItem) => (
          <PatternCard
            key={item.pattern._id}
            item={item}
            onRemove={removePattern}
          />
        ))}
      </div>
    </div>
  );
}