import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

export default function NotificationsPage() {
  // Mock data, cant get notifications from backend yet
  const notifications = [
    {
      id: 1,
      title: "New Vote Added",
      description: "Alice has voted on 'Weekend Trip Destination'",
      time: "5 minutes ago",
      type: "vote",
      link: "/decision/1",
    },
    {
      id: 2,
      title: "Decision Deadline Approaching",
      description: "Project Team Name decision closes in 2 hours",
      time: "1 hour ago",
      type: "deadline",
      link: "/decision/2",
    },
    {
      id: 3,
      title: "New Comment",
      description: "Bob commented on 'Weekend Trip Destination'",
      time: "2 hours ago",
      type: "comment",
      link: "/decision/1",
    },
  ];

  return (
    <div className="container mx-auto p-4 max-w-md">
      <h1 className="text-2xl font-bold mb-4">Notifications</h1>
      <div className="space-y-4">
        {notifications.map((notification) => (
          <Link key={notification.id} href={notification.link}>
            <Card className="hover:bg-muted/50 transition-colors">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-base">
                    {notification.title}
                  </CardTitle>
                  <Badge variant="secondary" className="text-xs">
                    {notification.time}
                  </Badge>
                </div>
                <CardDescription>{notification.description}</CardDescription>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
