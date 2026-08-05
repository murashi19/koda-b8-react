import { useState } from "react";

export default function useLocalStorage(key) {
  const [data, setData] = useState(() => {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : [];
  });

  const refresh = () => {
    const stored = JSON.parse(localStorage.getItem(key) || "[]");
    setData(stored);
    return stored;
  };

  const saveData = (newData) => {
    const current = refresh();
    const updated = [...current, newData];

    localStorage.setItem(key, JSON.stringify(updated));
    setData(updated);
  };

  const updateData = (newData) => {
    localStorage.setItem(key, JSON.stringify(newData));
    setData(newData);
  };

  const updateUserById = (updatedUser) => {
    const users = JSON.parse(localStorage.getItem(key) || "[]");

    const updated = users.map((user) =>
      user.id === updatedUser.id ? updatedUser : user,
    );

    localStorage.setItem(key, JSON.stringify(updated));
    setData(updated);

    return updatedUser;
  };

  return {
    data,
    saveData,
    updateData,
    updateUserById,
    refresh,
  };
}
