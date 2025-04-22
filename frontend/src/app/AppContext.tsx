// GLOBAL VARIABLES FOR THE APP
import React, {createContext, useContext, useEffect, useState} from 'react';
import {Loader} from "@googlemaps/js-api-loader";

// CHANGE IN PRODUCTION
export const BACKEND_ENDPOINT = process.env.NEXT_PUBLIC_BACKEND_API_ENDPOINT

export const default_image_url = BACKEND_ENDPOINT + "/media/workbreak.png"

const loader = new Loader({
    apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
    version: 'weekly'
});


export const  placesLibrary = await loader.importLibrary('places');

export const  markerLibrary = await loader.importLibrary('marker');

export const  mapsLibrary = await loader.importLibrary('maps');

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
};

type ContextProviderProps = {
  children: React.ReactNode;
};

export const AppContext = createContext<AppContextType>(
    {
        user: defaultUser,
        setUser: () => {},
        isAuthenticated:false,
        setIsAuthenticated: () => {}
    }
)

export const useAppContext = () => useContext(AppContext);

export const ContextProvider = ({ children }: ContextProviderProps) => {
  const [user, setUser] = useState(defaultUser);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

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

  return (
      <AppContext.Provider value={{user, setUser, isAuthenticated, setIsAuthenticated}}>
          {children}
      </AppContext.Provider>
  );
};