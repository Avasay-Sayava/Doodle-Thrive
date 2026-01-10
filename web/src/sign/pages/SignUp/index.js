import { useNavigate } from "react-router-dom";
import { useState } from "react";
import Regex from "../../../lib/regex";

import Sign from "../../index";
import Card from "../../components/Card"

function SignUp() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        username: "",
        password: "",
        description: "",
        profile: null
    });

    const [errors, setErrors] = useState({
        username: false,
        password: false,
        description: false,
        general: false
    });

    const [isLoading, setIsLoading] = useState(false);

    // convert file to base64 string
    const base64 = (file) => {
        return new Promise((resolve, reject) => {
            const fileReader = new FileReader();
            fileReader.readAsDataURL(file);
            fileReader.onload = () => resolve(fileReader.result);
            fileReader.onerror = (error) => reject(error);
        });
    };

    const handleChange = (e) => {
        const { name, value, type, files } = e.target;
        const finalValue = type === "file" ? files[0] : value;

        setFormData(prev => ({
            ...prev,
            [name]: finalValue
        }));

        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: false }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const usernameValid = Regex.username.test(formData.username);
        const passwordValid = Regex.password.test(formData.password);
        const imageValid = (Regex.image
            .test(formData.profile ? await base64(formData.profile) : "") ||
            formData.profile === null) && (formData.profile?.size ?? 0) <= 10 * 1024 * 1024;

        const descriptionValid = formData.description.length <= 512;

        setErrors({
            username: !usernameValid,
            password: !passwordValid,
            image: !imageValid,
            description: !descriptionValid,
            general: false
        });

        if (!usernameValid || !passwordValid || !descriptionValid || !imageValid) {
            return;
        }

        setIsLoading(true);

        try {
            let imageBase64 = null;
            if (formData.profile) {
                imageBase64 = await base64(formData.profile);
            }

            const payload = {
                username: formData.username,
                password: formData.password,
                info: {
                    image: imageBase64,
                    description: formData.description
                }
            };

            const response = await fetch("http://localhost:3300/api/users", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                throw new Error("Sign up failed");
            }

            navigate("/signin", {
                replace: true,
                state: {
                    username: formData.username,
                    password: formData.password
                }
            });

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
                    <h2>Sign Up</h2>
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
                            <p className="error-message" id="error-message-username">
                                <b>Invalid username.</b> Must be 2-32 characters long using only letters, numbers
                                spaces, underscores, hyphens, or periods, with no consecutive periods.
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
                            <p className="error-message" id="error-message-password">
                                <b>Invalid password.</b> Must be 8-64 characters long.
                            </p>
                        )}
                    </label>
                    <br />

                    <label>
                        <input
                            type="file"
                            name="profile"
                            accept="image/*"
                            onChange={handleChange}
                        />
                        {errors.image && (
                            <p className="error-message" id="error-message-image">
                                <b>Invalid image.</b> Must be a valid image file (png, jpeg, jpg, webp) under 10MB.
                            </p>
                        )}
                    </label>
                    <br />

                    <label>
                        <textarea
                            name="description"
                            placeholder="short description about yourself"
                            maxLength={512}
                            value={formData.description}
                            onChange={handleChange}
                            style={{ borderColor: errors.description ? "red" : undefined }}
                        />
                        {errors.description && (
                            <p className="error-message" id="error-message-description">
                                <b>Invalid description.</b> Must be up to 512 characters long.
                            </p>
                        )}
                    </label>
                    <br />

                    <input
                        type="submit"
                        value={isLoading ? "Signing Up..." : "Sign Up"}
                        disabled={isLoading}
                    />

                    {errors.general && (
                        <div className="error-message" id="error-message-general">
                            <p>
                                <b>Sign up failed.</b> Please check your username and password and try again.
                            </p>
                        </div>
                    )}

                    <br />
                    <label>
                        {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                        <a href="#" onClick={() => navigate("/signin")}>Already have an account? Sign In</a>
                    </label>
                </form>
            </Card>
        </Sign>
    );
}

export default SignUp;
