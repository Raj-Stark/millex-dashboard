import { cookies } from "next/headers";
import { redirect } from "next/navigation";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default async function ProtectedRoute({
  children,
}: ProtectedRouteProps) {
  const cookieStore = await cookies();
  const token = cookieStore.get("token");
  if (!token?.value) {
    redirect("/login");
  }

  return <>{children}</>;
}
