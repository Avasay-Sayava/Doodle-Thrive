import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';
import themes from "@/styles/themes";
import { useColorScheme } from "react-native";

const ThemeContext = createContext(null);
const storageKey = "theme";
const defaultDarkTheme = "soviet";
const defaultLightTheme = "pink";

export default ThemeContext;

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(useDefaultTheme());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const colorScheme = useColorScheme();

  const change = useCallback(async (name) => {
    if (themes[name]) {
      await AsyncStorage.setItem(storageKey, name);
      setTheme(themes[name]);
    } else {
      throw new Error(`Theme "${name}" not found`);
    }
  }, []);

  useEffect(() => {
    const loadTheme = async () => {
      try {
        const theme = await AsyncStorage.getItem(storageKey);
        if (theme && themes[theme]) {
          setTheme(themes[theme]);
          return;
        }

        await change(colorScheme === "dark" ? defaultDarkTheme : defaultLightTheme);
      } catch (err) {
        console.error("Failed to load theme", err);

        setError(err);
      } finally {
        setLoading(false);
      }
    };

    loadTheme();
  }, [colorScheme]);

  return (
    <ThemeContext.Provider value={{ theme, change, loading, error }}>
      {children}
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

export function useDefaultTheme() {
  const colorScheme = useColorScheme();
  return themes[colorScheme === "dark" ? defaultDarkTheme : defaultLightTheme];
}
