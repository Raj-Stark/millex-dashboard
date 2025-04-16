"use client";

import { GalleryVerticalEnd } from "lucide-react";
import { LoginForm } from "@/app/login/components/login-form";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const loginMutation = useMutation({
    mutationFn: async (data: { email: string; password: string }) => {
      const res = await fetch("/api/proxy-login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(data),
      });

      return res.json();
    },

    onSuccess: (data) => {
      router.push("/");
      console.log(data);
    },
  });

  const handleLoginForm = (data) => {
    loginMutation.mutate(data);
  };

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
              onLogin={handleLoginForm}
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
