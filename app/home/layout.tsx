import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "./components/app-sidebar";
import ProtectedRoute from "../components/protected-route";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
<<<<<<< HEAD
    <SidebarProvider>
      <AppSidebar />
      <main className="w-full">
        <SidebarTrigger className="fixed" />
        {children}
      </main>
    </SidebarProvider>
=======
    <ProtectedRoute>
      <SidebarProvider>
        <AppSidebar />
        <main>
          <SidebarTrigger className="fixed" />
          {children}
        </main>
      </SidebarProvider>
    </ProtectedRoute>
>>>>>>> 30e94422e9107fa34a972da5739f71242dd45314
  );
}
