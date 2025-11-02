"use client";
import { useState } from "react";
import { Button } from "../shadcn-ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../shadcn-ui/card";
import { Input } from "../shadcn-ui/input";
import z from "zod";
import { addEmail } from "@/actions/newsletter";

function EmailSignups() {
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const schema = z.object({
    email: z
      .string()
      .nonempty({ message: "Input is Empty." })
      .email({ message: "Invalid Email. Please try Again" }),
  });

  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email");

    const result = schema.safeParse({ email });
    if (!result.success) {
      const message =
        result.error.issues?.[0]?.message || "Invalid Email. Please try again.";
      setError(message);
      setLoading(false);
      return;
    }

    const res = await addEmail(result.data.email);
    if (res.success) {
      setSuccess("Thanks for subscribing!");
      setLoading(false);
      e.currentTarget.reset();
    } else {
      setError(res.message || "Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="flex justify-center px-4 py-16">
      <Card className="border-border/40 w-full max-w-md rounded-2xl border-0 bg-transparent shadow-none">
        <CardHeader className="space-y-2 text-center">
          <CardTitle className="text-2xl font-semibold">
            Sign Up for Our Newsletter
          </CardTitle>
          <CardDescription className="text-muted-foreground text-sm leading-relaxed">
            Subscribe to get updates about open-source projects — no spam.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={handleSignup}
            className="flex flex-col items-center gap-3 sm:flex-row"
            noValidate
          >
            <Input
              name="email"
              placeholder="Enter your email"
              type="email"
              className="flex-1"
              required
              onClick={() => setError("")}
            />
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Subscribing..." : "Subscribe"}
            </Button>
          </form>
          {error && (
            <p className="text-destructive pt-3 text-center text-sm">{error}</p>
          )}
          {success && (
            <p className="pt-3 text-center text-sm text-green-500">{success}</p>
          )}
        </CardContent>
      </Card>
    </section>
  );
}

export default EmailSignups;
