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
    const pathname = usePathname() ?? "";

    const {
        isAuthenticated,
        isLoading,
    } = useAuthStore();

    const isPublicRoute = PUBLIC_ROUTES.includes(pathname);

    useEffect(() => {
        if (isLoading) return;

        // Only redirect if NOT authenticated AND trying to access a protected page
        if (!isAuthenticated && !isPublicRoute) {
            router.replace("/login");
        }

        // Optional: redirect authenticated users away from login/register
        if (isAuthenticated && isPublicRoute) {
            router.replace("/dashboard");
        }
    }, [
        isAuthenticated,
        isLoading,
        isPublicRoute,
        router,
    ]);

    if (isLoading) {
        return null;
    }

    // Allow public pages to render
    if (isPublicRoute) {
        return <>{children}</>;
    }

    // Prevent protected pages from rendering before redirect
    if (!isAuthenticated) {
        return null;
    }

    return <>{children}</>;
}