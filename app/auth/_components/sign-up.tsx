"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { Loader2Icon } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import z from "zod";
import Link from "next/link";

const signUpSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.email().min(1, "Email is required"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

export default function SignUp() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSignUp = async () => {
    // Validate password confirmation
    if (password !== passwordConfirmation) {
      toast.error("Passwords do not match");
      return;
    }

    // Validate schema
    if (!signUpSchema.safeParse({ name, email, password }).success) {
      toast.error("Invalid data");
      return;
    }

    // Sign up
    await authClient.signUp.email({
      name,
      email,
      password,
      callbackURL: "/dashboard",
      fetchOptions: {
        onResponse: () => {
          setLoading(false);
        },
        onRequest: () => {
          setLoading(true);
        },
        onError: (ctx) => {
          toast.error(ctx.error.message);
        },
        onSuccess: async () => {
          router.push("/dashboard");
        },
      },
    });
  };

  return (
    <Card className="z-50 rounded-md rounded-t-none max-w-md">
      <CardHeader>
        <CardTitle className="text-lg md:text-xl">Sign Up</CardTitle>
        <CardDescription className="text-xs md:text-sm">
          Enter your information to create an account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form action="">
          <div className="flex flex-col gap-4 w-full min-w-[400px]">
            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                placeholder="Max"
                required
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                }}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                required
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Confirm Password</Label>
              <Input
                id="password_confirmation"
                type="password"
                value={passwordConfirmation}
                onChange={(e) => setPasswordConfirmation(e.target.value)}
                placeholder="Confirm Password"
              />
            </div>

            <div className="grid gap-2 col-span-2">
              <Button
                type="submit"
                className="w-full cursor-pointer"
                disabled={loading}
                onClick={handleSignUp}
              >
                {loading ? (
                  <Loader2Icon size={16} className="animate-spin" />
                ) : (
                  "Create an account"
                )}
              </Button>
            </div>
          </div>
        </form>

        <div className="flex items-center gap-2 mt-4 text-sm">
          <p>Already have an account?</p>
          <Link
            href="/auth/sign-in"
            className="text-orange-400 hover:underline hover:underline-offset-2"
          >
            Sign In
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
