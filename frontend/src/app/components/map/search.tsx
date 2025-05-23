import React, { useEffect } from "react";
import Latlon from 'geodesy/latlon-ellipsoidal-vincenty'
import PriceLevel = google.maps.places.PriceLevel;
import { useAppContext } from "@/app/AppContext";

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
    const { googleMapsLibrary } = useAppContext();
    
    useEffect(() => {
        const search = async () => {
            if (!googleMapsLibrary) return;
            
            let cuisine;
            if (data.formData.cuisine == null) {
                cuisine = 'food';
            } else {
                cuisine = data.formData.cuisine + ' food';
            }

            const request = {
                textQuery: cuisine,
                fields: ['displayName', 'id', 'location', 'formattedAddress',
                'priceLevel', 'rating', 'editorialSummary'],
                locationBias: data.position,
                priceLevels: [data.formData.budget],
                useStrictTypeFiltering: false,
            }

            const mapOptions = {
                center: data.position,
                zoom: 15,
                mapId: 'Search_Map'
            }
            const map =  (new (googleMapsLibrary.mapsLibrary.Map)(mapRef.current as unknown as HTMLDivElement, mapOptions));

            const { places } = await googleMapsLibrary.placesLibrary.Place.searchByText(request);
            const infoWindow = new (googleMapsLibrary.mapsLibrary.InfoWindow);
            const distance = Number(data.formData.distance) * 1609.344;

            if (places.length) {

                const bounds = new google.maps.LatLngBounds();

                // loops through all the places and gets all the results //
                places.forEach(place => {
                    const p1 = new Latlon (data.position.lat, data.position.lng);
                    const p2 = new Latlon (place.location?.lat() as number, place.location?.lng() as number);
                    const dist = p1.distanceTo(p2);
                    if (distance >= dist) {
                        const marker = (new (googleMapsLibrary.markerLibrary.AdvancedMarkerElement)({
                            map,
                            position: place.location,
                            title: place.displayName,
                        }))
                        const infoWindowNode = document.createElement("div");
                        const text = document.createElement("div");
                        text.innerText = place.displayName + '\n' + place.formattedAddress + '\n' +
                            place.priceLevel + '\n' + place.rating + '\n' + place.id;
                        infoWindowNode.appendChild(text);
                        
                        marker.addListener('click', () => {
                            infoWindow.close();
                            infoWindow.setContent(infoWindowNode);
                            infoWindow.open(marker.map, marker);
                        });

                        bounds.extend(place.location as google.maps.LatLng);
                    }
                })
                map.fitBounds(bounds);
            } else {
            }
        }
        search();
    }, [data, googleMapsLibrary]);

    return (
        <div style={containerStyle} ref={mapRef} />
    )
}

