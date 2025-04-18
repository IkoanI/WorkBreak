import {useEffect} from "react";
import {backendURL, useAppContext} from "@/app/AppContext";
import Link from "next/link";

export default function LoginButton() {
    const {user, setUser, isAuthenticated, setIsAuthenticated} = useAppContext()

    useEffect(() => {
      async function check_auth() {
          const response = await fetch('/accounts/api/check_auth');
          const data = await response.json();
          if (response.ok) {
            setUser({username : data['username'], image: backendURL + data['image']});
            if (!isAuthenticated) {
                setIsAuthenticated(true);
            }
          } else {
            setUser({username: "", image: ""});
            if (isAuthenticated) {
                setIsAuthenticated(false);
            }
          }
      }

      check_auth();
    }, [isAuthenticated, setIsAuthenticated, setUser])

    if (isAuthenticated) {
       return (
           <Link href = "/user/profile" className = "login-button"><span> {user.username} </span></Link>
       );
    } else {
        return (
           <Link href = "/accounts/login" className = "login-button"><span> Login </span></Link>
       );
    }
}