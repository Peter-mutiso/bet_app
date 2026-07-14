"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";

const PUBLIC_ROUTES = [
    "/login",
    "/register",
    "/forgot-password",
];

export default function ProtectedLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();
    const pathname = usePathname();

    const {
        isAuthenticated,
        isLoading,
    } = useAuthStore();

    useEffect(() => {
        if (isLoading) return;

        if (
            !isAuthenticated &&
            PUBLIC_ROUTES.includes(pathname ?? "")
        ) {
            router.replace("/login");
        }
    }, [
        isAuthenticated,
        isLoading,
        pathname,
        router,
    ]);

    if (
        isLoading ||
        (
            !isAuthenticated &&
            PUBLIC_ROUTES.includes(pathname ?? "")
        )
    ) {
        return null;
    }

    return <>{children}</>;
}