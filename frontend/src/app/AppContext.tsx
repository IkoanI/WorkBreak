// GLOBAL VARIABLES FOR THE APP
import React, {createContext, useContext, useState} from 'react';

// CHANGE IN PRODUCTION
export const backendURL = "http://127.0.0.1:8000"

export const default_image_url = backendURL + "/media/workbreak.png"

export type User = {
    username : string;
    image: string;
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
        user: {username:"", image:""},
        setUser: () => {},
        isAuthenticated:false,
        setIsAuthenticated: () => {}
    }
)

export const useAppContext = () => useContext(AppContext);

export const ContextProvider = ({ children }: ContextProviderProps) => {
  const [user, setUser] = useState({username:"", image:"",});
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
      <AppContext.Provider value={{user, setUser, isAuthenticated, setIsAuthenticated}}>
          {children}
      </AppContext.Provider>
  );
};