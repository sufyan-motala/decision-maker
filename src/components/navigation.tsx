"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  HomeIcon,
  PlusCircle,
  Clock,
  CheckCircle,
  BellDot,
} from "lucide-react";
import { cn } from "@/lib/utils";

export function Navigation() {
  const pathname = usePathname();

  const routes = [
    {
      href: "/",
      label: "Home",
      icon: HomeIcon,
    },
    {
      href: "/create",
      label: "Create",
      icon: PlusCircle,
    },
    {
      href: "/active",
      label: "Active",
      icon: Clock,
    },
    {
      href: "/finalized",
      label: "Finalized",
      icon: CheckCircle,
    },
    {
      href: "/notifications",
      label: "Notifications",
      icon: BellDot,
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 border-t bg-background p-2 md:relative md:border-t-0">
      <div className="container flex justify-between items-center max-w-md mx-auto md:flex-col md:items-start md:space-y-2">
        {routes.map((route) => (
          <Link key={route.href} href={route.href}>
            <Button
              variant={pathname === route.href ? "default" : "ghost"}
              className={cn(
                "flex flex-col items-center md:flex-row md:w-full md:justify-start",
                pathname === route.href && "bg-primary text-primary-foreground"
              )}
            >
              <route.icon className="h-5 w-5 md:mr-2" />
              <span className="text-xs md:text-sm">{route.label}</span>
            </Button>
          </Link>
        ))}
      </div>
    </nav>
  );
}
