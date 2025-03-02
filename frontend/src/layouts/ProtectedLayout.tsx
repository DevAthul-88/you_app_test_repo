"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { authApi } from "@/lib/api";
import Loader from "@/components/Loader";

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const { token, user, setUser, logout } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      if (!token) {
        router.push("/");
        return;
      }
      try {
        const response = await authApi.getProfile();
        if (response) {
          setUser(response);
        } else {
          router.push("/profile/create");
        }
      } catch (error) {
        console.error("Failed to fetch user", error);
        logout();
        router.push("/");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [token, router, setUser, logout]);

  if (loading) return <Loader />;

  return <>{children}</>;
}
