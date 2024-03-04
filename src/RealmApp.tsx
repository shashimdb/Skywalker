import React, { useState, useCallback, useMemo, createContext, useContext, useEffect } from "react";
import * as Realm from "realm-web";
import atlasConfig from "./atlasConfig.json";

// Define types
interface User {
  profile: any;
  // Define user properties if needed
}


interface AppContextType {
  currentUser: User | null;
  logIn: (credentials: Realm.Credentials) => Promise<void>;
  logOut: () => Promise<void>;
}

// Create context
const AppContext = createContext<AppContextType | null>(null);

// Create Realm app
function createApp(id: string): Realm.App {
  return new Realm.App({ id, baseUrl: atlasConfig.baseUrl });
}

// App provider component
export function AppProvider({ appId, children }: { appId: string; children: React.ReactNode }) {
  const [app, setApp] = useState(() => createApp(appId));
  const [currentUser, setCurrentUser] = useState(() => app.currentUser);

  useEffect(() => {
    setApp(createApp(appId));
  }, [appId]);

  const logIn = useCallback(async (credentials: Realm.Credentials) => {
    await app.logIn(credentials);
    setCurrentUser(app.currentUser);
  }, [app]);

  const logOut = useCallback(async () => {
    try {
      const user = app.currentUser;
      if (user) {
        await user.logOut();
        await app.removeUser(user);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setCurrentUser(null);
    }
  }, [app]);

  const appContextValue = useMemo(() => ({
    ...app,
    currentUser,
    logIn,
    logOut
  }), [app, currentUser, logIn, logOut]);

  return <AppContext.Provider value={appContextValue}>{children}</AppContext.Provider>;
}

// Custom hook to use app context
export function useApp(): AppContextType {
  const appContext = useContext(AppContext);
  if (!appContext) {
    throw new Error("No App Services App found. Make sure to call useApp() inside of a <AppProvider />.");
  }
  return appContext;
}
