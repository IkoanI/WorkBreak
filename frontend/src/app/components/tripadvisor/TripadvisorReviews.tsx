import {useEffect, useState} from "react";

import { BACKEND_ENDPOINT } from "@/app/AppContext";

type Props = {
    restaurant_name: string,
    coords: {lat: number, lng: number}
}

type User = {
    username: string,
}

type Review = {
    rating: number,
    id:number,
    title: string,
    text: string,
    user: User,
    published_date: string
}

export default function TripadvisorReviews(props: Props) {
    const [reviews, setReviews] = useState([]);

    useEffect(() => {
        async function findRestaurant() {
            const response = await fetch(`${BACKEND_ENDPOINT}/restaurants/api/tripadvisor_search/${props.restaurant_name}/${props.coords.lat}/${props.coords.lng}`, {
                credentials: 'include',
            });

            const data = await response.json();
            if (data.data[0]) {
                const location_id = data.data[0].location_id;
                const reviews_response = await fetch(`${BACKEND_ENDPOINT}/restaurants/api/tripadvisor_reviews/${location_id}`, {
                    credentials: 'include',
                });
                const reviews_data = await reviews_response.json();
                if (reviews_data.data) {
                    const new_reviews = reviews_data.data.map((review: Review) => {
                        return (
                            <div key={review.id}>
                                <h1> {review.title} </h1>
                                <p> User: {review.user.username} </p>
                                <p> Rating: {review.rating} </p>
                                <p> {review.text} </p>
                                <p> Publish Date: {review.published_date} </p>
                            </div>
                        )
                    })
                    setReviews(new_reviews);
                }
            }
        }

        findRestaurant();
    }, [])

    if (reviews.length == 0) {
        return (
            <div>
                No reviews found.
            </div>
        )
    }

    return (
        <div>
            <h1> TripAdvisor Reviews </h1>
            { reviews }
        </div>
    );
}