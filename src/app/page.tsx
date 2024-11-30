import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function MainPage() {
  return (
    <div className="container mx-auto p-4 max-w-md min-h-screen flex flex-col justify-center">
      <h1 className="text-2xl font-bold mb-8 text-center">
        Group Decision Maker
      </h1>
      <div className="space-y-4">
        <Button asChild className="w-full">
          <Link href="/create">Create Decision</Link>
        </Button>
        <Button asChild className="w-full">
          <Link href="/active">Active Decisions</Link>
        </Button>
        <Button asChild className="w-full">
          <Link href="/finalized">Finalized Decisions</Link>
        </Button>
      </div>
    </div>
  );
}
