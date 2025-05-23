import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function RootPage() {
  const cookieStore = await cookies();
  const hasCookie = cookieStore.has("token");

  if (hasCookie) {
    redirect("/home");
  } else {
    redirect("/login");
  }

  return null;
}
