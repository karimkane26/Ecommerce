import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import {PRODUCT_URL} from "../constants.js";
// Créer le contexte
const ProductContext = createContext();

// Créer un fournisseur de contexte
export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [productDetails, setProductDetails] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fonction pour récupérer tous les produits
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get('http://localhost:5000/api/products');
      setProducts(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Fonction pour récupérer les détails d'un produit
  const fetchProductDetails = async (productId) => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${PRODUCT_URL}/${productId}`);
      setProductDetails((prevDetails) => ({
        ...prevDetails,
        [productId]: data,
      }));
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProductContext.Provider
      value={{
        products,
        productDetails,
        loading,
        error,
        fetchProducts,
        fetchProductDetails,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};

// Hook personnalisé pour utiliser le contexte
export const useProductContext = () => {
  return useContext(ProductContext);
};
