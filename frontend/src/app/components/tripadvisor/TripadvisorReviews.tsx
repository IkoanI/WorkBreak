import {useEffect} from "react";

import { BACKEND_ENDPOINT } from "@/app/AppContext";

type Props = {
    restaurant_name: string,
    coords: {lat: number, lng: number}
}

export default function TripadvisorReviews(props: Props) {
    useEffect(() => {
        async function findRestaurant() {
            const response = await fetch(`${BACKEND_ENDPOINT}/restaurants/api/tripadvisor_search/${props.restaurant_name}/${props.coords.lat}/${props.coords.lng}`, {
                credentials: 'include',
            });

            const data = await response.json();
            if (data.data[0]) {
                const location_id = data.data[0].location_id;
                console.log(location_id);
            }
        }

        findRestaurant();
    }, [])

    return (
        <div>
            Tripadvisor Reviews
        </div>
    );
}