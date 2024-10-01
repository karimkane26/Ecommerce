// import React, { createContext, useState, useEffect } from "react";
// // Créer un contexte pour le panier
// const CartContext = createContext();

// export const CartProvider = ({ children }) => {
//   // Initialiser l'état avec les données locales ou valeurs par défaut
//   const initialCart = localStorage.getItem("cart")
//     ? JSON.parse(localStorage.getItem("cart"))
//     : { cartItems: [], shippingAddress: {}, paymentMethod: "PayPal" };

//   const [cartItems, setCartItems] = useState(initialCart.cartItems || []);
//   const [shippingAddress, setShippingAddress] = useState(
//     initialCart.shippingAddress || {
//       address: "",
//       city: "",
//       postalCode: "",
//       country: "",
//     }
//   );
//   const [paymentMethod, setPaymentMethod] = useState(
//     initialCart.paymentMethod || "PayPal"
//   );
//   const [itemsPrice, setItemsPrice] = useState(0);
//   const [shippingPrice, setShippingPrice] = useState(0);
//   const [taxPrice, setTaxPrice] = useState(0);
//   const [totalPrice, setTotalPrice] = useState(0);

//   // Fonction utilitaire pour calculer les prix
//   const addDecimals = (num) => {
//     return (Math.round(num * 100) / 100).toFixed(2);
//   };

//   // Fonction pour mettre à jour les prix du panier
//   const updateCartPrices = (cart) => {
//     const itemsPrice = addDecimals(
//       cart.reduce((acc, item) => acc + item.price * item.qty, 0)
//     );
//     const shippingPrice = addDecimals(itemsPrice > 100 ? 0 : 10);
//     const taxPrice = addDecimals(Number(0.15 * itemsPrice));
//     const totalPrice = (
//       Number(itemsPrice) +
//       Number(shippingPrice) +
//       Number(taxPrice)
//     ).toFixed(2);

//     setItemsPrice(itemsPrice);
//     setShippingPrice(shippingPrice);
//     setTaxPrice(taxPrice);
//     setTotalPrice(totalPrice);

//     // Sauvegarder dans le localStorage
//     localStorage.setItem(
//       "cart",
//       JSON.stringify({
//         cartItems,
//         shippingAddress,
//         paymentMethod,
//         itemsPrice,
//         shippingPrice,
//         taxPrice,
//         totalPrice,
//       })
//     );
//   };

//   // Mettre à jour les prix du panier lorsqu'il change
//   useEffect(() => {
//     updateCartPrices(cartItems);
//   }, [cartItems]);

//   // Ajouter un produit au panier
//   const addToCart = (item) => {
//     const existItem = cartItems.find((x) => x._id === item._id);
//     if (existItem) {
//       setCartItems(cartItems.map((x) => (x._id === existItem._id ? item : x)));
//     } else {
//       setCartItems([...cartItems, item]);
//     }
//   };

//   // Supprimer un produit du panier
//   const removeFromCart = (id) => {
//     setCartItems(cartItems.filter((x) => x._id !== id));
//   };

//   // Sauvegarder l'adresse de livraison
//   // Sauvegarder l'adresse de livraison
//   const saveShippingAddress = (address) => {
//     setShippingAddress(address);
//     localStorage.setItem(
//       "cart",
//       JSON.stringify({
//         cartItems,
//         shippingAddress: address, // Utiliser l'adresse mise à jour ici
//         paymentMethod,
//         itemsPrice,
//         shippingPrice,
//         taxPrice,
//         totalPrice,
//       })
//     );
//   };

//   // Sauvegarder le mode de paiement
//   const savePaymentMethod = (method) => {
//     setPaymentMethod(method);
//     updateCartPrices(cartItems);
//   };

//   // Vider le panier
//   const clearCartItems = () => {
//     setCartItems([]);
//     localStorage.removeItem("cart");
//   };

//   return (
//     <CartContext.Provider
//       value={{
//         cartItems,
//         itemsPrice,
//         shippingPrice,
//         taxPrice,
//         totalPrice,
//         addToCart,
//         removeFromCart,
//         saveShippingAddress,
//         savePaymentMethod,
//         clearCartItems,
//       }}
//     >
//       {children}
//     </CartContext.Provider>
//   );
// };

// export const useCartContext = () => React.useContext(CartContext);
// CartContext.jsx
import React, { createContext, useState, useEffect } from "react";

// Créer un contexte pour le panier
const CartContext = createContext();

export const CartProvider = ({ children }) => {
  // Initialiser l'état avec les données locales ou valeurs par défaut
  const initialCart = localStorage.getItem("cart")
    ? JSON.parse(localStorage.getItem("cart"))
    : { cartItems: [], shippingAddress: {}, paymentMethod: "PayPal" };

  // Conversion des prix en nombres si nécessaire
  const parsedCart = initialCart.cartItems.map((item) => ({
    ...item,
    price: Number(item.price) || 0, // Assurer que price est un nombre
    qty: Number(item.qty) || 0, // Assurer que qty est un nombre
  }));

  const [cartItems, setCartItems] = useState(parsedCart || []);
  const [shippingAddress, setShippingAddress] = useState(
    initialCart.shippingAddress || {
      address: "",
      city: "",
      postalCode: "",
      country: "",
    }
  );
  const [paymentMethod, setPaymentMethod] = useState(
    initialCart.paymentMethod || "PayPal"
  );
  const [itemsPrice, setItemsPrice] = useState(
    Number(initialCart.itemsPrice) || 0
  );
  const [shippingPrice, setShippingPrice] = useState(
    Number(initialCart.shippingPrice) || 0
  );
  const [taxPrice, setTaxPrice] = useState(Number(initialCart.taxPrice) || 0);
  const [totalPrice, setTotalPrice] = useState(
    Number(initialCart.totalPrice) || 0
  );

  // Fonction utilitaire pour arrondir à deux décimales sans convertir en chaîne
  const roundToTwo = (num) => {
    return Math.round(num * 100) / 100;
  };

  // Fonction pour mettre à jour les prix du panier
  const updateCartPrices = (cart) => {
    const calculatedItemsPrice = roundToTwo(
      cart.reduce((acc, item) => acc + item.price * item.qty, 0)
    );
    const calculatedShippingPrice = roundToTwo(
      calculatedItemsPrice > 100 ? 0 : 10
    );
    const calculatedTaxPrice = roundToTwo(0.15 * calculatedItemsPrice);
    const calculatedTotalPrice = roundToTwo(
      calculatedItemsPrice + calculatedShippingPrice + calculatedTaxPrice
    );

    setItemsPrice(calculatedItemsPrice);
    setShippingPrice(calculatedShippingPrice);
    setTaxPrice(calculatedTaxPrice);
    setTotalPrice(calculatedTotalPrice);

    // Sauvegarder dans le localStorage avec des valeurs numériques
    localStorage.setItem(
      "cart",
      JSON.stringify({
        cartItems: cart.map((item) => ({
          ...item,
          price: item.price, // Assurez-vous que price est un nombre
          qty: item.qty, // Assurez-vous que qty est un nombre
        })),
        shippingAddress,
        paymentMethod,
        itemsPrice: calculatedItemsPrice,
        shippingPrice: calculatedShippingPrice,
        taxPrice: calculatedTaxPrice,
        totalPrice: calculatedTotalPrice,
      })
    );
  };

  // Mettre à jour les prix du panier lorsqu'il change
  useEffect(() => {
    updateCartPrices(cartItems);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cartItems]);

  // Ajouter un produit au panier
  const addToCart = (item) => {
    const existItem = cartItems.find((x) => x._id === item._id);
    if (existItem) {
      setCartItems(
        cartItems.map((x) =>
          x._id === existItem._id
            ? { ...x, qty: Number(item.qty) || x.qty } // Assurer que qty est un nombre
            : x
        )
      );
    } else {
      setCartItems([
        ...cartItems,
        { ...item, qty: Number(item.qty) || 1, price: Number(item.price) || 0 },
      ]);
    }
  };

  // Supprimer un produit du panier
  const removeFromCart = (id) => {
    setCartItems(cartItems.filter((x) => x._id !== id));
  };

  // Sauvegarder l'adresse de livraison
  const saveShippingAddress = (address) => {
    setShippingAddress(address);
    localStorage.setItem(
      "cart",
      JSON.stringify({
        cartItems,
        shippingAddress: address, // Utiliser l'adresse mise à jour ici
        paymentMethod,
        itemsPrice,
        shippingPrice,
        taxPrice,
        totalPrice,
      })
    );
  };

  // Sauvegarder le mode de paiement
  const savePaymentMethod = (method) => {
    setPaymentMethod(method);
    updateCartPrices(cartItems);
  };

  // Vider le panier
  const clearCartItems = () => {
    setCartItems([]);
    setItemsPrice(0);
    setShippingPrice(0);
    setTaxPrice(0);
    setTotalPrice(0);
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
