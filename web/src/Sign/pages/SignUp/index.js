import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Regex from "../../../utils/regex";

import Input from "../../components/Input";
import TextArea from "../../components/TextArea";

const API_BASE = process.env.API_BASE_URL || "http://localhost:3300";

function SignUp({ changeMode, autofill = {} }) {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/drive", { replace: true });
    }
  }, [navigate]);

  const [errors, setErrors] = useState({
    username: false,
    password: false,
    image: false,
    description: false,
    general: false,
  });

  const [formData, setFormData] = useState({
    username: autofill?.get?.username || "",
    password: autofill?.get?.password || "",
    description: autofill?.get?.description || "",
    profile: autofill?.get?.profile || null,
  });

  useEffect(() => {
    const current = autofill?.get || {};
    if (
      current.username !== formData.username ||
      current.password !== formData.password ||
      current.description !== formData.description ||
      current.profile !== formData.profile
    ) {
      autofill?.set({ ...current, ...formData });
    }
  }, [formData, autofill]);

  const [isLoading, setIsLoading] = useState(false);

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

    setFormData((prev) => ({ ...prev, [name]: finalValue }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: false }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const usernameValid = Regex.username.test(formData.username);
    const passwordValid = Regex.password.test(formData.password);
    const imageValid =
      (Regex.image.test(
        formData.profile ? await base64(formData.profile) : "",
      ) ||
        formData.profile === null) &&
      (formData.profile?.size ?? 0) <= 10 * 1024 * 1024;
    const descriptionValid = formData.description.length <= 512;

    setErrors({
      username: !usernameValid,
      password: !passwordValid,
      image: !imageValid,
      description: !descriptionValid,
      general: false,
    });

    if (!usernameValid || !passwordValid || !descriptionValid || !imageValid)
      return;

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
          description: formData.description,
        },
      };

      const response = await fetch(`${API_BASE}/api/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error("Sign up failed");

      changeMode();
    } catch (error) {
      console.error("API Error:", error);
      setErrors((prev) => ({ ...prev, general: true }));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Sign Up</h2>

      <Input
        name="username"
        placeholder="username"
        value={formData.username}
        onChange={handleChange}
        error={errors.username}
        errorMessage={
          <>
            <b>Invalid username.</b> Must be 2-32 characters long using only
            letters, numbers, spaces, underscores, hyphens, or periods, with no
            consecutive periods.
          </>
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
          <>
            <b>Invalid password.</b> Must be 8-64 characters long.
          </>
        }
      />

      <Input
        type="file"
        name="profile"
        accept="image/*"
        onChange={handleChange}
        error={errors.image}
        errorMessage={
          <>
            <b>Invalid image.</b> Must be a valid image file (png, jpeg, jpg,
            webp) under 10MB.
          </>
        }
      />

      <TextArea
        name="description"
        placeholder="short description about yourself"
        maxLength={512}
        value={formData.description}
        onChange={handleChange}
        error={errors.description}
        errorMessage={
          <>
            <b>Invalid description.</b> Must be up to 512 characters long.
          </>
        }
      />

      <input
        type="submit"
        value={isLoading ? "Signing Up..." : "Sign Up"}
        disabled={isLoading}
      />

      {errors.general && (
        <div className="error-message" id="error-message-general">
          <p>
            <b>Sign up failed.</b> Please check your username and password and
            try again.
          </p>
        </div>
      )}

      <a href="#" onClick={() => changeMode()}>
        Already have an account? Sign In
      </a>
    </form>
  );
}

export default SignUp;
