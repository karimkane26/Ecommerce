import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [userInfo, setUserInfo] = useState(() => {
    const storedUserInfo = localStorage.getItem("userInfo");
    console.log("userInfo récupéré du localStorage :", storedUserInfo); // Log ici
    return storedUserInfo && storedUserInfo !== "undefined"
      ? JSON.parse(storedUserInfo)
      : null;
  });

  const [token, setToken] = useState(() => {
    const storedToken = localStorage.getItem("token");
    console.log("Token récupéré du localStorage :", storedToken); // Log ici
    return storedToken && storedToken !== "undefined" ? storedToken : null;
  });

  const setCredentials = (data) => {
    console.log("Données à définir dans setCredentials :", data); // Log pour vérifier les données
    if (data) {
      setUserInfo(data);
      setToken(data.token);
      localStorage.setItem("userInfo", JSON.stringify(data));
      localStorage.setItem("token", data.token);
    } else {
      console.error("Aucune donnée à définir dans setCredentials.");
    }
  };

  const logout = () => {
    setUserInfo(null);
    setToken(null);
    localStorage.removeItem("userInfo");
    localStorage.removeItem("token");
  };

  useEffect(() => {
    console.log(" authentification :", userInfo);
  }, [userInfo]);

  const value = { userInfo, token, setCredentials, logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
