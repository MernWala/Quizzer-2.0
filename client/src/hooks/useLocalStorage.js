import { useState, useEffect } from "react";

const useLocalStorage = (key, initialValue) => {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const localItem = localStorage.getItem(key);
      if (localItem !== null) return JSON.parse(localItem);

      // Save initial value only if nothing is in localStorage
      localStorage.setItem(key, JSON.stringify(initialValue));
      return initialValue;
    } catch (err) {
      console.error("useLocalStorage init error:", err);
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(storedValue));
    } catch (err) {
      console.error("useLocalStorage write error:", err);
    }
  }, [key, storedValue]);

  return [storedValue, setStoredValue];
};

export default useLocalStorage;
