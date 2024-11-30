"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getDecisions, type Decision } from "@/lib/storage";

export default function ActiveDecisions() {
  const [decisions, setDecisions] = useState<Decision[]>([]);

  useEffect(() => {
    const allDecisions = getDecisions();
    setDecisions(allDecisions.filter((d) => d.status === "active"));
  }, []);

  return (
    <div className="container mx-auto p-4 max-w-md">
      <Link href="/" className="block mb-4">
        <Button variant="outline">&larr; Back to Main Page</Button>
      </Link>
      <h1 className="text-2xl font-bold mb-4 text-center">Active Decisions</h1>
      <div className="space-y-4">
        {decisions.map((decision) => (
          <Card key={decision.id}>
            <CardHeader>
              <CardTitle>{decision.topic}</CardTitle>
              <CardDescription>Due: {decision.dueDate}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                <Badge variant="secondary">
                  {decision.participants.length} participants
                </Badge>
                <Button asChild>
                  <Link href={`/decision/${decision.id}`}>View & Vote</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
