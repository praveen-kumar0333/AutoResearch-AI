import { Link } from "wouter";
import { AlertCircle, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background">
      <div className="text-center">
        <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
        <h1 className="text-3xl font-bold mb-2">404</h1>
        <p className="text-muted-foreground mb-6">This page doesn't exist.</p>
        <Link href="/dashboard">
          <Button className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Button>
        </Link>
      </div>
    </div>
  );
}
