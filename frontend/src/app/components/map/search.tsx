import React, { useEffect } from "react";
import Latlon, { Dms } from 'geodesy/latlon-ellipsoidal-vincenty'
import PriceLevel = google.maps.places.PriceLevel;
import { mapsLibrary, markerLibrary, placesLibrary } from "@/app/AppContext";

type Props = {
    position: {lat: number, lng: number},
    formData: {cuisine : string, distance: string, budget: PriceLevel},
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

            const request = {
                textQuery: cuisine,
                fields: ['displayName', 'id', 'location', 'formattedAddress',
                'priceLevel', 'rating'],
                locationBias: data.position,
                priceLevels: [data.formData.budget],
                useStrictTypeFiltering: false,
            }

            const mapOptions = {
                center: data.position,
                zoom: 15,
                mapId: 'Search_Map'
            }
            const map =  (new (mapsLibrary.Map)(mapRef.current as unknown as HTMLDivElement, mapOptions));

            const { places } = await placesLibrary.Place.searchByText(request);
            const infoWindow = new (mapsLibrary.InfoWindow);
            const distance = Number(data.formData.distance) * 1609.344;

            if (places.length) {

                const bounds = new google.maps.LatLngBounds();

                // loops through all the places and gets all the results //
                places.forEach(place => {
                    const p1 = new Latlon (data.position.lat, data.position.lng);
                    const p2 = new Latlon (place.location?.lat() as number, place.location?.lng() as number);
                    const dist = p1.distanceTo(p2);
                    console.log(distance);
                    console.log(dist);
                    console.log(place.priceLevel);
                    if (distance >= dist) {
                        const marker = (new (markerLibrary.AdvancedMarkerElement)({
                            map,
                            position: place.location,
                            title: place.displayName,
                        }))
                        let infoWindowNode = document.createElement("div");
                        let text = document.createElement("div");
                        text.innerText = place.displayName + '\n' + place.formattedAddress + '\n' +
                            place.priceLevel + '\n' + place.rating + '\n' + place.id;
                        infoWindowNode.appendChild(text);

                        // @ts-ignore
                        marker.addListener('click', ({domEvent, latLng}) => {
                            const {target} = domEvent;
                            infoWindow.close();
                            infoWindow.setContent(infoWindowNode);
                            infoWindow.open(marker.map, marker);
                        });

                        bounds.extend(place.location as google.maps.LatLng);
                    }
                })
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

