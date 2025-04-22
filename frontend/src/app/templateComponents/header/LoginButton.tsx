import { useAppContext} from "@/app/AppContext";
import Link from "next/link";

export default function LoginButton() {
    const {user, isAuthenticated} = useAppContext()



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