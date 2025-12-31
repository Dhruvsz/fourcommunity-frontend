
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

const WaitlistForm = () => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      toast.success("You've joined the waitlist!", {
        description: "We'll notify you when you can start discovering groups."
      });
      setEmail("");
    }, 1000);
  };

  return (
    <section className="py-16 bg-primary/5" id="waitlist">
      <div className="container">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="mb-4">Join the Waitlist</h2>
          <p className="text-muted-foreground text-lg mb-8">
            Be the first to discover and join high-quality WhatsApp communities. 
            We'll notify you when we launch with groups in your areas of interest.
          </p>
          
          <Card>
            <CardHeader>
              <CardTitle>Get Early Access</CardTitle>
              <CardDescription>
                Enter your email to be notified when we launch.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <Label htmlFor="waitlist-email" className="sr-only">Email Address</Label>
                  <Input
                    id="waitlist-email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Joining..." : "Join Waitlist"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default WaitlistForm;
