import { useState, useMemo } from "react";
import Card from "../components/Card";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import "./style.css";

function Sign({ mode = "signin" }) {
  const [activeMode, setActiveMode] = useState(mode);
  const [isOpen, setIsOpen] = useState(true);

  const handleModeChange = (newMode) => {
    setIsOpen(false);

    setTimeout(() => {
      window.history.pushState({}, "", `/${newMode}`);
      setActiveMode(newMode);
      setIsOpen(true);
    }, 300);
  };

  const [get, set] = useState({});

  const autofill = useMemo(() => ({ get, set }), [get]);

  return (
    <div className="sign-layout">
      <Card isOpen={isOpen}>
        {activeMode === "signin" ? (
          <SignIn changeMode={() => handleModeChange("signup")} autofill={autofill} />
        ) : (
          <SignUp changeMode={() => handleModeChange("signin")} autofill={autofill} />
        )}
      </Card>
    </div>
  );
}

export default Sign;
