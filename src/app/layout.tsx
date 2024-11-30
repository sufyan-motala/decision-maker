import { Navigation } from "@/components/navigation";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <div className="flex min-h-screen flex-col md:flex-row">
          <div className="hidden md:block md:w-64 p-4 border-r h-screen">
            <Navigation />
          </div>
          <main className="flex-1 pb-16 md:pb-0">{children}</main>
          <div className="md:hidden">
            <Navigation />
          </div>
        </div>
        <Toaster />
      </body>
    </html>
  );
}
