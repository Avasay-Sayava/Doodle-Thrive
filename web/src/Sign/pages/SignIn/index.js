import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Regex from "../../../utils/regex";

import Input from "../../components/Input";

const API_BASE = process.env.API_BASE_URL || "http://localhost:3300";

function SignIn({ changeMode, autofill = {} }) {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/drive", { replace: true });
    }
  }, [navigate]);

  const [formData, setFormData] = useState({
    username: autofill?.get?.username || "",
    password: autofill?.get?.password || ""
  });

  useEffect(() => {
    const current = autofill?.get || {};
    if (current.username !== formData.username || current.password !== formData.password) {
      autofill?.set({ ...current, ...formData });
    }
  }, [formData, autofill]);

  const [errors, setErrors] = useState({
    username: false,
    password: false,
    general: false
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: false }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const usernameValid = Regex.username.test(formData.username);
    const passwordValid = Regex.password.test(formData.password);

    setErrors({
      username: !usernameValid,
      password: !passwordValid,
      general: false
    });

    if (!usernameValid || !passwordValid) return;

    setIsLoading(true);

    try {
      const response = await fetch(`${API_BASE}/api/tokens`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Sign in failed");

      const data = await response.json();
      localStorage.setItem("token", data.token);

      navigate("/drive");
    } catch (error) {
      console.error("API Error:", error);
      setErrors(prev => ({ ...prev, general: true }));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Sign In</h2>

      <Input
        name="username"
        placeholder="username"
        value={formData.username}
        onChange={handleChange}
        error={errors.username}
        errorMessage={
          <><b>Invalid username.</b> Must be 2-32 characters long using only letters, numbers, spaces, underscores, hyphens, or periods, with no consecutive periods.</>
        }
      />

      <Input
        type="password"
        name="password"
        placeholder="password"
        value={formData.password}
        onChange={handleChange}
        error={errors.password}
        errorMessage={
          <><b>Invalid password.</b> Must be 8-64 characters long.</>
        }
      />

      <input
        type="submit"
        value={isLoading ? "Signing In..." : "Sign In"}
        disabled={isLoading}
      />

      {errors.general && (
        <div className="error-message">
          <p><b>Sign in failed.</b> Check credentials.</p>
        </div>
      )}

      <a href="#" onClick={() => changeMode()}>Don't have an account? Sign Up</a>
    </form>
  );
}

export default SignIn;
