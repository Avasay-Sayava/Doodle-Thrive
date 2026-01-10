import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import Regex from "../../../lib/regex";

import Sign from "../../index";
import Card from "../../components/Card"

function SignIn() {
    const navigate = useNavigate();
    const location = useLocation();

    const [formData, setFormData] = useState({
        username: location.state?.username || "",
        password: location.state?.password || ""
    });

    const [errors, setErrors] = useState({
        username: false,
        password: false,
        general: false
    });

    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: false }));
        }
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

        if (!usernameValid || !passwordValid) {
            return;
        }

        setIsLoading(true);
        try {
            const response = await fetch("http://localhost:3300/api/tokens", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (!response.ok) throw new Error("Sign in failed");

            const data = await response.json();
            localStorage.setItem("token", data.token);

            navigate("/drive/home", { replace: true });
        } catch (error) {
            console.error("API Error:", error);
            setErrors(prev => ({ ...prev, general: true }));
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Sign>
            <Card>
                <form onSubmit={handleSubmit}>
                    <h2>Sign In</h2>
                    
                    <label>
                        <input
                            type="text"
                            name="username"
                            placeholder="username"
                            value={formData.username}
                            onChange={handleChange}
                            style={{ borderColor: errors.username ? "red" : undefined }}
                        />
                        {errors.username && (
                            <p className="error-message">
                                <b>Invalid username.</b> Must be 2-32 characters...
                            </p>
                        )}
                    </label>
                    <br />

                    <label>
                        <input
                            type="password"
                            name="password"
                            placeholder="password"
                            value={formData.password}
                            onChange={handleChange}
                            style={{ borderColor: errors.password ? "red" : undefined }}
                        />
                        {errors.password && (
                            <p className="error-message">
                                <b>Invalid password.</b> Must be 8-64 characters...
                            </p>
                        )}
                    </label>
                    <br />

                    <input
                        type="submit"
                        value={isLoading ? "Signing In..." : "Sign In"}
                        disabled={isLoading}
                    />

                    {errors.general && (
                        <div className="error-message" style={{textAlign: 'center', marginTop: '1rem'}}>
                            <p><b>Sign in failed.</b> Check credentials.</p>
                        </div>
                    )}

                    <br />
                    <label>
                        {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                        <a href="#" onClick={() => navigate("/signup")}>Don't have an account? Sign Up</a>
                    </label>
                </form>
            </Card>
        </Sign>
    );
}

export default SignIn;
