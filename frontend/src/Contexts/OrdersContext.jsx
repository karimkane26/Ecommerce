import React, { createContext, useState, useContext } from "react";
import api from "../components/axios";
import { toast } from "react-toastify";

// Créer le contexte
const OrdersContext = createContext();

// Créer un hook pour utiliser ce contexte facilement
export const useOrders = () => useContext(OrdersContext);

export const OrdersProvider = ({ children }) => {
  const [orderDetails, setOrderDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Créer une nouvelle commande
  const createOrder = async (order) => {
    try {
      setIsLoading(true);
      const { data } = await api.post("/orders", order);
      setIsLoading(false);
      return data;
    } catch (error) {
      setIsLoading(false);
      setError(
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
      );
      toast.error(error.message);
      throw error;
    }
  };

  // Récupérer les détails d'une commande par son ID
  const getOrderDetails = async (orderId) => {
    try {
      setIsLoading(true);
      const { data } = await api.get(`/orders/${orderId}`);
      setOrderDetails(data);
      setIsLoading(false);
      
    } catch (error) {
      setIsLoading(false);
      setError(
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
      );
      toast.error(error.message);
    }
  };

  return (
    <OrdersContext.Provider
      value={{ createOrder, getOrderDetails, orderDetails, isLoading, error }}
    >
      {children}
    </OrdersContext.Provider>
  );
};
