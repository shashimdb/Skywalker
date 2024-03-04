import { AppBar, Toolbar, Button, Typography } from "@mui/material";
import { WelcomePage } from "./WelcomePage";

import { AppProvider, useApp } from "./RealmApp";
import { ThemeProvider } from "./Theme";
import Metron from "./Metron";
import VStepper from './controller/vector/VStepper';
import { userDataSetter } from './controller/context/SizingContext';




import atlasConfig from "./atlasConfig.json";
import "./css/App.css";
const { appId } = atlasConfig;

export default function ProvidedApp() {
  return (
    <ThemeProvider>
      <AppProvider appId={appId}>
        <App />
      </AppProvider>
    </ThemeProvider>
  );
}

function App() {
  const { currentUser, logOut } = useApp();





  if (userDataSetter && currentUser) {
    userDataSetter(currentUser.profile.email.toString());
   
  }



  return (
    <div className="App">
      <AppBar position="sticky">
        {/* <Toolbar>
   
          {currentUser ? (
            <Button
              variant="contained"
              color="secondary"
              onClick={async () => {
                await logOut();
              }}
            >
       Log Out
            </Button>
          ) : null}
        </Toolbar> */}
      </AppBar>
      {currentUser ? <Metron /> : <WelcomePage />}
    </div>
  );
}
