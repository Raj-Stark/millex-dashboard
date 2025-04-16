export const checkToken = async (): Promise<boolean> => {
  if (typeof window === "undefined") return false;

  const cookies = document.cookie;
  const token = cookies.split("; ").find((row) => row.startsWith("token="));
  return Boolean(token);
};
