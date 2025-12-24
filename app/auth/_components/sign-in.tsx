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
import SocialAuthButtons from "./social-auth-buttons";
import Image from "next/image";
import { APP_NAME } from "@/lib/constants";

const signInSchema = z.object({
  email: z.email().min(3, "Email must be at least 3 characters long"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // Handle sign in
  const handleSignIn = async () => {
    setLoading(true);
    // Validate data
    if (!signInSchema.safeParse({ email, password }).success) {
      toast.error("Invalid email or password");
      return;
    }
    // Sign in
    await authClient.signIn.email({
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
    setLoading(false);
  };

  return (
    <Card className="z-50 rounded-md rounded-t-none max-w-md">
      <CardHeader className="space-y-4">
        <div className="flex items-center justify-center">
          <Link href="/">
            <Image
              priority={true}
              src="/images/logo.png"
              width={150}
              height={150}
              alt={`${APP_NAME} logo`}
            />
          </Link>
        </div>
        <CardTitle className="text-center">Giriş Yap</CardTitle>
        <CardDescription className="text-center">
          Giriş yapmak için bir yöntem seçin
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form action="">
          <div className="flex flex-col gap-4">
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
              <Label htmlFor="password">Parola</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Parola"
              />
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={loading}
              onClick={handleSignIn}
            >
              {loading ? (
                <Loader2Icon size={16} className="animate-spin" />
              ) : (
                "Giriş Yap"
              )}
            </Button>
          </div>
        </form>

        {/* Sign in with google */}
        <SocialAuthButtons />

        <div className="flex items-center gap-2 mt-4 text-sm">
          <p>Üyelik yok?</p>
          <Link
            href="/auth/sign-up"
            className="text-orange-400 hover:underline hover:underline-offset-2"
          >
            Kayıt Ol
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
