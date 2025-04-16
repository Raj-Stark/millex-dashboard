"use client";

import { GalleryVerticalEnd } from "lucide-react";
import { LoginForm } from "@/components/login-form";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useAuth } from "../providers/auth-provider";

export default function LoginPage() {
  const router = useRouter();
  const { setToken } = useAuth();

  const loginMutation = useMutation({
    mutationFn: async (data: { email: string; password: string }) => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_LOCAL_URL}/auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(data),
        }
      );

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData?.message || "Login failed");
      }

      // Log the entire headers object (again for good measure)
      console.log("Response Headers:", res.headers);

      // Try accessing the header in a different way
      const setCookieHeadersArray = res.headers.getSetCookie();
      console.log("Set-Cookie Headers Array:", setCookieHeadersArray);

      let tokenFromCookie: string | null = null;

      if (setCookieHeadersArray && setCookieHeadersArray.length > 0) {
        // Iterate through all Set-Cookie headers
        for (const cookie of setCookieHeadersArray) {
          const tokenMatch = cookie.match(/token=([^;]+)/);
          console.log("Token Match (Array):", tokenMatch);
          if (tokenMatch && tokenMatch[1]) {
            tokenFromCookie = decodeURIComponent(tokenMatch[1]);
            console.log("Extracted Token (Array):", tokenFromCookie);
            break; // Assuming only one token is set
          }
        }
      } else {
        console.warn("No Set-Cookie headers found using getSetCookie()");
      }

      return tokenFromCookie; // Return the extracted token
    },
    onSuccess: (token) => {
      // Set the token in context and localStorage
      if (token) {
        setToken(token);
        router.push("/");
      } else {
        // Handle the case where the token wasn't found in the header
        console.error("Token not found in Set-Cookie header");
        // Optionally set an error state or display a message to the user
      }
    },
  });

  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <a href="#" className="flex items-center gap-2 font-medium">
            <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
              <GalleryVerticalEnd className="size-4" />
            </div>
            Acme Inc.
          </a>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <LoginForm
              onLogin={(data) => loginMutation.mutate(data)}
              error={loginMutation.error?.message}
              isLoading={loginMutation.isPending}
            />
          </div>
        </div>
      </div>
      <div className="bg-muted relative hidden lg:block">
        <img
          src="/farmgear.png"
          alt="Image"
          className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>
    </div>
  );
}
