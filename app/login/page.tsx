"use client";

import { GalleryVerticalEnd } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useGoogleLogin } from "@react-oauth/google";
import { toast } from "react-toastify";

export default function LoginPage() {
  const router = useRouter();

  const googleLogin = useGoogleLogin({
    flow: "auth-code",
    onSuccess: async (codeResponse) => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_LOCAL_URL}auth/admin/google-login`,

          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify({ code: codeResponse.code }),
            // body: JSON.stringify({ code: "" }),
          }
        );

        if (!res.ok) {
          const error = await res.json();
          toast.error(error?.msg || "Google login failed");
          return;
        }

        toast.success("Logged in successfully!");
        router.push("/");
      } catch (err) {
        console.error("Google login failed", err);
        toast.error("Google login failed");
      }
    },
    onError: () => {
      toast.error("Google login failed");
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
            Dashboard Admin
          </a>
        </div>
        <div className="flex flex-1 flex-col items-center justify-center gap-6">
          <button
            onClick={() => googleLogin()}
            className="mt-2 w-full max-w-xs rounded border border-black px-4 py-2 text-sm font-medium"
          >
            Continue with Google
          </button>
        </div>
      </div>

      <div className="bg-muted relative hidden lg:block">
        <Image
          src="/farmgear.png"
          alt="Image"
          fill
          className="object-cover dark:brightness-[0.2] dark:grayscale"
          priority
        />
      </div>
    </div>
  );
}
