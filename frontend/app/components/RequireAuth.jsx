"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function RequireAuth({ children, role }) {
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const storedRole = localStorage.getItem("role");

    if (!storedRole) {
      router.replace("/login");
      return;
    }

    if (role && storedRole !== role) {
      router.replace("/login");
      return;
    }

    setReady(true);
  }, [router, role]);

  if (!ready) return null; // ⛔ prevent redirect flash

  return <>{children}</>;
}
