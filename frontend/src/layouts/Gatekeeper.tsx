"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";

export default function Gatekeeper({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const user = useAuthStore((state) => state.user);

    useEffect(() => {
        if (user) {
            router.push("/profile");
        }
    }, [user, router]);

    return <>{!user && children}</>;
}
