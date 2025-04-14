import React, { useEffect } from "react";
import {Loader} from "@googlemaps/js-api-loader";
import Latlon, { Dms } from 'geodesy/latlon-ellipsoidal-vincenty'


type Props = {
    position: {lat: number, lng: number},
    formData: {cuisine : string, distance: string, budget: string},
};

const containerStyle = {
  width: '100%',
  height: '401px',
};

export default function Search (data : Props) {
    const mapRef = React.useRef(null);
    useEffect(() => {
        const search = async () => {
            let cuisine;
            if (data.formData.cuisine == null) {
                cuisine = 'food';
            } else {
                cuisine = data.formData.cuisine + ' food';
            }
            const loader = new Loader({
                apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
                version: 'weekly'
            });

            const { Place } = await loader.importLibrary('places');
            const { AdvancedMarkerElement } = await loader.importLibrary('marker')
            const { Map } = await loader.importLibrary('maps');



            const request = {
                textQuery: cuisine + ' around ' + data.formData.cuisine + ' dollar',
                fields: ['displayName', 'id', 'location'],
                locationBias: data.position,
                maxResultCount: 50,
                useStrictTypeFiltering: false,
            }

            const mapOptions = {
                center: data.position,
                zoom: 15,
                mapId: 'Search_Map'
            }
            const map = new Map(mapRef.current as unknown as HTMLDivElement, mapOptions);

            const { places } = await Place.searchByText(request);
            const distance = Number(data.formData.cuisine);

            if (places.length) {

                const {LatLngBounds} = await loader.importLibrary('core');
                const bounds = new google.maps.LatLngBounds();

                // loops through all the places and gets all the results //
                places.forEach(place => {
                    const p1 = new Latlon (data.position.lat, data.position.lng);
                    const p2 = new Latlon (place.location?.lat() as number, place.location?.lng() as number);
                    const dist = p1.distanceTo(p2);
                    console.log(dist);
                    //if (dist <= distance) {
                        const marker = new AdvancedMarkerElement({
                            map,
                            position: place.location,
                            title: place.displayName,
                        })


                        bounds.extend(place.location as google.maps.LatLng);
                        console.log(place);
                    //}
                });

                map.fitBounds(bounds);
            } else {
                console.log("no results");
            }
        }
        search();
    }, []);

    return (
        <div style={containerStyle} ref={mapRef} />
    )
}

