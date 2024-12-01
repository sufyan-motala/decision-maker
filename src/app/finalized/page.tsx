"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { getDecisions } from "@/lib/storage";
import type { Decision } from "@/lib/storage";

export default function FinalizedDecisions() {
  const [decisions, setDecisions] = useState<Decision[]>([]);

  useEffect(() => {
    const allDecisions = getDecisions();
    setDecisions(allDecisions.filter((d) => d.status === "finalized"));
  }, []);

  return (
    <div className="container mx-auto p-4 max-w-md">
      <Link href="/" className="block mb-4">
        <Button variant="outline">&larr; Back to Main Page</Button>
      </Link>
      <h1 className="text-2xl font-bold mb-4 text-center">
        Finalized Decisions
      </h1>
      <div className="space-y-4">
        {decisions.map((decision) => (
          <Card key={decision.id}>
            <CardHeader>
              <CardTitle>{decision.topic}</CardTitle>
              <CardDescription>Decided on: {decision.dueDate}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center mb-4">
                <Badge variant="secondary">
                  {decision.participants.length} participants
                </Badge>
                <span className="font-semibold">
                  Final: {decision.options[0]}
                </span>
              </div>
              <div>
                <h4 className="text-sm font-semibold mb-2">Vote Breakdown</h4>
                {decision.options.map((option) => {
                  const voteCount = decision.participants.filter(
                    (p) => p.vote === option
                  ).length;
                  const percentage =
                    (voteCount / decision.participants.length) * 100;

                  return (
                    <div key={option} className="mb-2">
                      <div className="flex justify-between text-sm mb-1">
                        <span>{option}</span>
                        <span>
                          {voteCount} votes ({percentage.toFixed(1)}%)
                        </span>
                      </div>
                      <Progress value={percentage} className="h-2" />
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
