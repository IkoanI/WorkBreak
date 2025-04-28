import {useEffect, useState} from "react";
import {BACKEND_ENDPOINT} from "@/app/AppContext";
import Link from "next/link";


type VisitHistory = {
    place_id:string,
    slug:string,
    restaurant_name:string,
}

export default function UserHistory() {
    const [history, setHistory] = useState([]);

    useEffect(() => {
        async function getHistory() {
            const response = await fetch(`${BACKEND_ENDPOINT}/user/api/get_history`, {credentials: "include"})
            const data = await response.json()

            if (!response.ok) {
                return
            }

            const userHistory = data.history.map((item: VisitHistory) => {
                    return (
                        <div key={item.place_id}>
                            <Link href={`/restaurants/${item.slug}?id=${item.place_id}`}> {item.restaurant_name}</Link>
                        </div>
                    )
                })
            setHistory(userHistory)
        }

        getHistory()
    },[])

    return (
        <div>
            <h1>History</h1>
            {history}
        </div>
    );
}