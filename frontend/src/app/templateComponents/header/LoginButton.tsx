import {useEffect} from "react";
import {useAppContext} from "@/app/AppContext";
import Link from "next/link";

export default function LoginButton() {
    const {user, setUser} = useAppContext()

    useEffect(() => {
      async function check_auth() {
          const response = await fetch('/accounts/api/check_auth');
          const data = await response.json();
          if (response.ok) {
            setUser({username : data.username, isAuthenticated: true})
          } else {
            setUser({username: "default", isAuthenticated: false})
          }
      }

      check_auth();
    }, [setUser])

    if (user.isAuthenticated) {
       return (
           // Not using <Link> tag to redirect here is right as logout is a Django function
           <a href="/accounts/logout/" className="login-button"><span> {user.username} (Logout) </span></a>
       );
    } else {
        return (
           <Link href = "/accounts/login" className = "login-button"><span> Login </span></Link>
       );
    }
}