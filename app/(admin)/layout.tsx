"use client";

import { useQuery } from "react-query";
import { useEffect, useState } from "react";
import { checkToken } from "@/lib/checkAuth";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { useRouter } from "next/navigation";

export default function Layout({ children }: { children: React.ReactNode }) {
  const [enabled, setEnabled] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setEnabled(true);
  }, []);

  const { data: isLoggedIn, isLoading } = useQuery("auth", checkToken, {
    enabled,
    suspense: false,
  });

  useEffect(() => {
    if (!isLoading && isLoggedIn === false) {
      // router.push("/login");
    }
  }, [isLoggedIn, isLoading, router]);

  return (
    <SidebarProvider>
      <AppSidebar />
      <main>
        <SidebarTrigger />
        {isLoading ? <div>Loading...</div> : children}
      </main>
    </SidebarProvider>
  );
}
