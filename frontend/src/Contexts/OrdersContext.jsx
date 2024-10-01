// OrdersContext.js
import React, { createContext, useContext, useState } from "react";
import axios from "axios";
import { useAuth } from "../Contexts/AuthContext";

const OrdersContext = createContext();

export const OrdersProvider = ({ children }) => {
  const [orderDetails, setOrderDetails] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { token, userInfo, authLoading } = useAuth();

  const createOrder = async (order) => {
    console.log("userInfo dans OrdersContext :", userInfo);
    if (authLoading) {
      const message = "Authentification en cours. Veuillez patienter.";
      setError(message);
      console.error(message);
      throw new Error(message);
    }

    if (!userInfo) {
      const message = "Informations utilisateur manquantes.";
      setError(message);
      console.error(message);
      throw new Error(message);
    }

    if (!userInfo._id) {
      const message = "Identifiant utilisateur manquant.";
      setError(message);
      console.error(message);
      throw new Error(message);
    }

    if (!token) {
      const message = "Token manquant pour l'authentification.";
      setError(message);
      console.error(message);
      throw new Error(message);
    }

    setLoading(true);
    try {
      const { data } = await axios.post(
        "http://localhost:5000/api/orders",
        { ...order, userId: userInfo._id },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Commande créée :", data);
      setLoading(false);
      return data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Erreur lors de la création de la commande";
      setError(errorMessage);
      console.error("Erreur lors de la requête API :", errorMessage);
      setLoading(false);
      throw new Error(errorMessage);
    }
  };

  const getOrderDetails = async (orderId) => {
    if (!token) {
      setError("Token manquant pour l'authentification.");
      return;
    }

    setLoading(true);
    try {
      const { data } = await axios.get(
        `http://localhost:5000/api/orders/${orderId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setOrderDetails(data);
      setLoading(false);
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Erreur lors de la récupération des détails de la commande";
      setError(errorMessage);
      console.error("Erreur lors de la requête API :", errorMessage);
      setLoading(false);
    }
  };

  return (
    <OrdersContext.Provider
      value={{
        orderDetails,
        loading,
        error,
        createOrder,
        getOrderDetails,
      }}
    >
      {children}
    </OrdersContext.Provider>
  );
};

export const useOrders = () => {
  return useContext(OrdersContext);
};
