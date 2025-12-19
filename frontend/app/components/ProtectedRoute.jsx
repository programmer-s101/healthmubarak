import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ProtectedRoute({ children, role }) {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem(`token_${role}`);
    if (!token) router.push(`/${role}/login`);
  }, []);

  return <>{children}</>;
}
