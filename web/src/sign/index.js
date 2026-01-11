import { useState, useMemo } from "react";
import Card from "./components/Card";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import "./style.css";

/**
 * * @param {object} props
 * @param {"signin"|"signup"} [props.mode]
 * @returns {JSX.Element}
 */
function Sign({ mode = "signin" }) {
  const [activeMode, setActiveMode] = useState(mode);
  const [collapsed, setCollapsed] = useState(false);

  const handleModeChange = (newMode) => {
    setCollapsed(true);

    setTimeout(() => {
      window.history.pushState({}, "", `/${newMode}`);
      setActiveMode(newMode);
      setCollapsed(false);
    }, 300);
  };

  const [get, set] = useState({});

  const autofill = useMemo(() => ({ get, set }), [get]);

  return (
    <div className="sign-layout">
      <Card collapsed={collapsed}>
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
