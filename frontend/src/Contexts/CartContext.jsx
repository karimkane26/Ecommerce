import React, { createContext, useState, useEffect } from "react";

// Créer un contexte pour le panier
const CartContext = createContext();

export const CartProvider = ({ children }) => {
  // Initialiser l'état avec les données locales ou valeurs par défaut
  const initialCart = localStorage.getItem("cart")
    ? JSON.parse(localStorage.getItem("cart"))
    : { cartItems: [], shippingAddress: {}, paymentMethod: "PayPal" };

  const [cartItems, setCartItems] = useState(initialCart.cartItems || []);
  const [shippingAddress, setShippingAddress] = useState(
    initialCart.shippingAddress || {}
  );
  const [paymentMethod, setPaymentMethod] = useState(
    initialCart.paymentMethod || "PayPal"
  );
  const [itemsPrice, setItemsPrice] = useState(0);
  const [shippingPrice, setShippingPrice] = useState(0);
  const [taxPrice, setTaxPrice] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);

  // Fonction utilitaire pour calculer les prix
  const addDecimals = (num) => {
    return (Math.round(num * 100) / 100).toFixed(2);
  };

  // Fonction pour mettre à jour les prix du panier
  const updateCartPrices = (cart) => {
    const itemsPrice = addDecimals(
      cart.reduce((acc, item) => acc + item.price * item.qty, 0)
    );
    const shippingPrice = addDecimals(itemsPrice > 100 ? 0 : 10);
    const taxPrice = addDecimals(Number(0.15 * itemsPrice));
    const totalPrice = (
      Number(itemsPrice) +
      Number(shippingPrice) +
      Number(taxPrice)
    ).toFixed(2);

    setItemsPrice(itemsPrice);
    setShippingPrice(shippingPrice);
    setTaxPrice(taxPrice);
    setTotalPrice(totalPrice);

    // Sauvegarder dans le localStorage
    localStorage.setItem(
      "cart",
      JSON.stringify({
        cartItems,
        shippingAddress,
        paymentMethod,
        itemsPrice,
        shippingPrice,
        taxPrice,
        totalPrice,
      })
    );
  };

  // Mettre à jour les prix du panier lorsqu'il change
  useEffect(() => {
    updateCartPrices(cartItems);
  }, [cartItems]);

  // Ajouter un produit au panier
  const addToCart = (item) => {
    const existItem = cartItems.find((x) => x._id === item._id);
    if (existItem) {
      setCartItems(cartItems.map((x) => (x._id === existItem._id ? item : x)));
    } else {
      setCartItems([...cartItems, item]);
    }
  };

  // Supprimer un produit du panier
  const removeFromCart = (id) => {
    setCartItems(cartItems.filter((x) => x._id !== id));
  };

  // Sauvegarder l'adresse de livraison
  const saveShippingAddress = (address) => {
    setShippingAddress(address);
    updateCartPrices(cartItems);
  };

  // Sauvegarder le mode de paiement
  const savePaymentMethod = (method) => {
    setPaymentMethod(method);
    updateCartPrices(cartItems);
  };

  // Vider le panier
  const clearCartItems = () => {
    setCartItems([]);
    localStorage.removeItem("cart");
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        itemsPrice,
        shippingPrice,
        taxPrice,
        totalPrice,
        addToCart,
        removeFromCart,
        saveShippingAddress,
        savePaymentMethod,
        clearCartItems,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCartContext = () => React.useContext(CartContext);
