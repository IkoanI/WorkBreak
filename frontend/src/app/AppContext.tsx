// GLOBAL VARIABLES FOR THE APP
import React, {createContext, useContext, useState} from 'react';

type User = {
    username : string;
    isAuthenticated: boolean;
}

type AppContextType = {
    user : User;
    setUser:(user: User) => void;
};

type ContextProviderProps = {
  children: React.ReactNode;
};

export const AppContext = createContext<AppContextType>(
    {
        user: {username:"default", isAuthenticated:false},
        setUser: () => {},
    }
)

export const useAppContext = () => useContext(AppContext);

export const ContextProvider = ({ children }: ContextProviderProps) => {
  const [user, setUser] = useState({username:"default", isAuthenticated:false});

  return (
      <AppContext.Provider value={{user, setUser}}>
          {children}
      </AppContext.Provider>
  );
};