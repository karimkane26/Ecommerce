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
  const [orders, setOrders] = useState([]);
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
  const getAllOrders = async () => {
    try {
      setIsLoading(true);
      const { data } = await api.get("/orders"); // Assurez-vous que cette route est correcte
      setOrders(data); // Met à jour les commandes dans l'état
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      setError(error.response?.data?.message || error.message);
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
  const getMyOrders = async () => {
    try {
      setIsLoading(true);
      const { data } = await api.get("/orders/mine"); // Assurez-vous que cette route existe dans votre backend
      setOrders(data);
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
  const updateOrderToDelivered = async (orderId) => {
    try {
      setIsLoading(true);
      const { data } = await api.put(`/orders/${orderId}/deliver`);
      setOrderDetails(data);
      setIsLoading(false);
      toast.success("Order marked as delivered successfully!");
      return data;
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
      value={{
        createOrder,
        getOrderDetails,
        getMyOrders,
        getAllOrders,
        updateOrderToDelivered,
        orders,
        orderDetails,
        isLoading,
        error,
      }}
    >
      {children}
    </OrdersContext.Provider>
  );
};
