import { useAppContext} from "@/app/AppContext";
import React from "react";
import Link from "next/link";


export default function LoginButton() {
    const {user, isAuthenticated} = useAppContext()

    if (isAuthenticated) {
        return (
            <Link href="/user/profile" className="login-button">{user.username}</Link>
        );
    }

    return (
        <Link href="/accounts/login" className="login-button">Login</Link>
    )
}