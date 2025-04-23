// GLOBAL VARIABLES FOR THE APP
import React, {createContext, useContext, useEffect, useState} from 'react';
import {Loader} from "@googlemaps/js-api-loader";

export const BACKEND_ENDPOINT = process.env.NEXT_PUBLIC_BACKEND_API_ENDPOINT
export const default_image_url = BACKEND_ENDPOINT + "/media/workbreak.png"

// GOOGLE MAPS API STUFF
const loader = new Loader({
    apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
    version: 'weekly'
});

type GoogleMapsLibrary = {
    placesLibrary : google.maps.PlacesLibrary,
    markerLibrary : google.maps.MarkerLibrary,
    mapsLibrary : google.maps.MapsLibrary,
    priceLevel : typeof google.maps.places.PriceLevel,
}

export type User = {
    username : string;
    image: string;
    cuisines: string[];
}

export const defaultUser = {
    username : "",
    image : "",
    cuisines : new Array<string>()
}

type AppContextType = {
    user : User;
    setUser:(user: User) => void;
    isAuthenticated: boolean;
    setIsAuthenticated:(isAuthenticated: boolean) => void;
    googleMapsLibrary: GoogleMapsLibrary | null;
};

type ContextProviderProps = {
  children: React.ReactNode;
};

export const AppContext = createContext<AppContextType>(
    {
        user: defaultUser,
        setUser: () => {},
        isAuthenticated:false,
        setIsAuthenticated: () => {},
        googleMapsLibrary:null
    }
)

export const useAppContext = () => useContext(AppContext);

export const ContextProvider = ({ children }: ContextProviderProps) => {
  const [user, setUser] = useState(defaultUser);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [googleMapsLibrary, setGoogleMapsLibrary] = useState<GoogleMapsLibrary | null>(null);

  useEffect(() => {
      async function check_auth() {
          const response = await fetch(BACKEND_ENDPOINT + "/accounts/api/check_auth");
          const data = await response.json();
          if (response.ok) {
            setUser({username : data['username'], image: BACKEND_ENDPOINT + data['image'], cuisines : data['cuisines']});
            if (!isAuthenticated) {
                setIsAuthenticated(true);
            }
          } else {
            setUser(defaultUser);
            if (isAuthenticated) {
                setIsAuthenticated(false);
            }
          }
      }

      check_auth();
    }, [isAuthenticated, setIsAuthenticated, setUser])

  useEffect(() => {
      async function on_mount() {
            if (!googleMapsLibrary) {
                const placesLibrary = await loader.importLibrary('places');
                const markerLibrary = await loader.importLibrary('marker');
                const mapsLibrary = await loader.importLibrary('maps');
                const priceLevel = google.maps.places.PriceLevel;
                setGoogleMapsLibrary({placesLibrary, markerLibrary, mapsLibrary, priceLevel});
            }
        }

        on_mount();
    }, [googleMapsLibrary]);
  
  return (
      <AppContext.Provider value={{user, setUser, isAuthenticated, setIsAuthenticated, googleMapsLibrary}}>
          {children}
      </AppContext.Provider>
  );
};