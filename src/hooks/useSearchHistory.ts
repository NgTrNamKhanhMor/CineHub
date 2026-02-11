// src/hooks/useSearchHistory.ts
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useState, useEffect } from "react";

// Separate keys for persistence
const KEYS = {
  movie: "@search_history_movies",
  tv: "@search_history_tv",
};

export const useSearchHistory = (type: "movie" | "tv") => {
  const [history, setHistory] = useState<any[]>([]);
  const storageKey = KEYS[type];
  useEffect(() => {
    const loadHistory = async () => {
      const saved = await AsyncStorage.getItem(storageKey);

      if (saved) {
        setHistory(JSON.parse(saved));
      }else{
        setHistory([]);
      }
    };
    loadHistory();
  }, [storageKey]);

  const addToHistory = async (item: any) => {
    const filtered = history.filter((h) => h.id !== item.id);
    const newHistory = [item, ...filtered].slice(0, 10);

    setHistory(newHistory);
    await AsyncStorage.setItem(storageKey, JSON.stringify(newHistory));
  };

  const clearHistory = async () => {
    setHistory([]);
    await AsyncStorage.removeItem(storageKey);
  };

  return { history, addToHistory, clearHistory };
};
