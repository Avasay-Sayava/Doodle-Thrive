import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useColorScheme } from "react-native";
import { ThemeProvider as NavThemeProvider } from "@react-navigation/native";
import themes from "@/styles/themes";

const ThemeContext = createContext(null);
const storageKey = "theme";
const defaultLightTheme = "pink";
const defaultDarkTheme = "soviet";
const defaultTheme = "pink";

export default ThemeContext;

export function ThemeProvider({ children }) {
  const colorScheme = useColorScheme();
  const [themeName, setThemeName] = useState(defaultTheme);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const activeTheme = themes[themeName];

  const change = useCallback(async (name) => {
    if (themes[name]) {
      await AsyncStorage.setItem(storageKey, name);
      setThemeName(name);
    }
  }, []);

  useEffect(() => {
    const loadTheme = async () => {
      try {
        const stored = await AsyncStorage.getItem(storageKey);
        if (stored && themes[stored]) {
          setThemeName(stored);
        } else {
          await change(colorScheme === "dark" ? defaultDarkTheme : defaultLightTheme);
        }
      } catch (err) {
        console.error("Failed to load theme", err);

        setError(err);
      } finally {
        setLoading(false);
      }
    };

    loadTheme();
  }, [colorScheme]);

  const theme = {
    theme: activeTheme,
    loading,
    error,
    change,
  };

  return (
    <ThemeContext.Provider value={theme}>
      <NavThemeProvider value={activeTheme}>
        {children}
      </NavThemeProvider>
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
