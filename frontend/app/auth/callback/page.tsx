"use client";
import { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";

export default () => {
    const searchParams = useSearchParams();
    const router = useRouter();

    useEffect(() => {
        if (!router) return

        const token = searchParams.get("token") ?? "";
        console.log(token)
        if (token) {
            sessionStorage.setItem("access_token", token);
            router.push("/welcome")
        }
    }, [router, searchParams])

    return "loading..."
}