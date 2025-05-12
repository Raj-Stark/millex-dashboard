import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function RootPage() {
  const cookieStore = await cookies();
  const hasCookie = cookieStore.has("token");

  console.log(hasCookie);

  if (hasCookie) {
    redirect("/home");
  } else {
    redirect("/login");
  }

  return null;
}
