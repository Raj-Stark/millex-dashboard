import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "./components/app-sidebar";
import ProtectedRoute from "../components/protected-route";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute>
      <SidebarProvider>
        <AppSidebar />
        <main>
          <SidebarTrigger className="fixed" />
          {children}
        </main>
      </SidebarProvider>
    </ProtectedRoute>
  );
}
