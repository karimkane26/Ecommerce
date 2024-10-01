// import React, { createContext, useContext, useState, useEffect } from "react";

// // Crée le contexte d'authentification
// const AuthContext = createContext();

// // Hook personnalisé pour accéder au contexte d'authentification
// export const useAuth = () => {
//   return useContext(AuthContext);
// };

// export const AuthProvider = ({ children }) => {
//   const [userInfo, setUserInfo] = useState(() => {
//     const storedUserInfo = localStorage.getItem("userInfo");
//     return storedUserInfo && storedUserInfo !== "undefined"
//       ? JSON.parse(storedUserInfo)
//       : null;
//   });

//   const [token, setToken] = useState(() => {
//     const storedToken = localStorage.getItem("token");
//     return storedToken && storedToken !== "undefined" ? storedToken : null;
//   });

//   // Fonction pour stocker les informations utilisateur
//   const setCredentials = (data) => {
//     setUserInfo(data);
//     setToken(data.token);
//     localStorage.setItem("userInfo", JSON.stringify(data));
//     localStorage.setItem("token", data.token);
//   };

//   // Fonction pour se déconnecter
//   const logout = () => {
//     setUserInfo(null);
//     setToken(null);
//     localStorage.removeItem("userInfo");
//     localStorage.removeItem("token");
//   };

//   // Fournir le contexte aux composants enfants
//   const value = { userInfo, token, setCredentials, logout };

//   return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
// };
import React, { createContext, useContext, useState, useEffect } from "react";

// Crée le contexte d'authentification
const AuthContext = createContext();

// Hook personnalisé pour accéder au contexte d'authentification
export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [userInfo, setUserInfo] = useState(() => {
    const storedUserInfo = localStorage.getItem("userInfo");
    return storedUserInfo && storedUserInfo !== "undefined"
      ? JSON.parse(storedUserInfo)
      : null;
  });

  const [token, setToken] = useState(() => {
    const storedToken = localStorage.getItem("token");
    return storedToken && storedToken !== "undefined" ? storedToken : null;
  });

  const setCredentials = (data) => {
    setUserInfo(data); // Assurez-vous que 'data' inclut le nom
    setToken(data.token);
    localStorage.setItem("userInfo", JSON.stringify(data));
    localStorage.setItem("token", data.token);
  };

  const logout = () => {
    setUserInfo(null);
    setToken(null);
    localStorage.removeItem("userInfo");
    localStorage.removeItem("token");
  };

  const value = { userInfo, token, setCredentials, logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
