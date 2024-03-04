
import { useState } from "react";
import LeafyGreenProvider from "@leafygreen-ui/leafygreen-provider";
import Stepper, { Step } from "@leafygreen-ui/stepper";
import Toggle from "@leafygreen-ui/toggle";

export default function App() {
  const [darkMode, setDarkMode] = useState(true);

  return (
    <LeafyGreenProvider darkMode={darkMode}>
      <div className={`App ${darkMode && "darkmode-bg"}`}>
        <div className="sandbox">
          <Stepper currentStep={1} maxDisplayedSteps={3}>
            <Step>Step 1</Step>
            <Step>Step 2</Step>
            <Step>Step 3</Step>
            <Step>Step 4</Step>
            <Step>Step 5</Step>
          </Stepper>
        </div>
        <div>
          <Toggle
            aria-label="Dark mode toggle"
            checked={darkMode}
            onChange={setDarkMode}
            className="toggle-style"
          />
        </div>
      </div>
    </LeafyGreenProvider>
  );
}
