import { useCallback } from "react";
import { useUsersActions } from "../api/users/useUsersActions";
import Regex from "@/src/utils/common/regex"; 

export function useSignUp() {
  const { create, loading, error } = useUsersActions();

  const validatePassword = useCallback( (password) => {
    if (!password) {
      return {valid: false, errorMessage: "Password can not be empty!"};
    }
    if (!Regex.password.test(password)) {
      return {valid: false, errorMessage: "Passwords need to be 8-64 characters long"};
    }
    return {valid: true};
  }, []);

  const validateUsername = useCallback( (username) => {
    if (!username) {
      return {valid: false, errorMessage: "Username can not be empty!"};
    }
    if (!Regex.username.test(username)) {
      return {valid: false, errorMessage: "Invalid username!"};
    }
    return {valid: true};
  }, []);
  const validateImage = useCallback( (image) => {
    if (image && !Regex.image.test(image)) {
      return {valid: false, errorMessage: "Invalid image format!"};
    }
    return {valid: true};
  }, []);
  const validateDescription = useCallback( (description) => {
    if (!Regex.description.test(description)) {
      return {valid: false, errorMessage: "Description too long!"}
    }
    return {valid: true};
  }, []);
  
  const errorMessages = useCallback( (username, password, image, description, setErrors) => {
    const messages = {username: null, password: null, image: null, description: null, general: null};
    const usernameValidation = validateUsername(username);
    if (!usernameValidation.valid) {
      messages.username = usernameValidation.errorMessage;
    }
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.valid) {
      messages.password = passwordValidation.errorMessage;
    }
    const imageValidation = validateImage(image);
    if (!imageValidation.valid) {
      messages.image = imageValidation.errorMessage;
    }
    const descriptionValidation = validateDescription(description);
    if (!descriptionValidation.valid) {
      messages.description = descriptionValidation.errorMessage;
    }
    if (!Object.values(messages).some((msg) => msg !== null)) {
      return false;
    }

    messages.general = "Please fix the errors above.";
    setErrors(messages);
    return true;
  }, [validateUsername, validatePassword, validateImage, validateDescription]);

  const handleSignUp = useCallback(
    async (username, password, image, description, setErrors) => {
      const hasErrors = errorMessages(username, password, image, description, setErrors);
      if (hasErrors) {
        return false;
      }
      return await create(username, password, { image, description })
        .then(() => {
          return true;
        })
        .catch(() => {
          return false;
        });
    },
    [create, errorMessages],
  );

  return { handleSignUp, loading, error };
}
