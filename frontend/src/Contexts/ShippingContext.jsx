// import React, { createContext, useContext, useState } from "react";
// // Création du contexte
// const ShippingContext = createContext();
// // Hook personnalisé pour utiliser le ShippingContext
// export const useShippingContext = () => useContext(ShippingContext);
// // Provider pour envelopper votre application
// export const ShippingProvider = ({ children }) => {
//   // État pour stocker l'adresse de livraison
//   const [shippingAddress, setShippingAddress] = useState({
//     address: "",
//     city: "",
//     postalCode: "",
//     country: "",
//   });

//   // Fonction pour sauvegarder l'adresse de livraison
//   const saveShippingAddress = (address) => {
//     setShippingAddress(address);
//   };

//   return (
//     <ShippingContext.Provider value={{ shippingAddress, saveShippingAddress }}>
//       {children}
//     </ShippingContext.Provider>
//   );
// };
import React, { createContext, useContext, useState } from "react";

// Création du contexte
const ShippingContext = createContext();

// Hook personnalisé pour utiliser le ShippingContext
export const useShippingContext = () => useContext(ShippingContext);

// Provider pour envelopper votre application
export const ShippingProvider = ({ children }) => {
  // Initialiser l'état de shippingAddress à partir du localStorage ou avec des valeurs par défaut
  const initialShippingAddress = localStorage.getItem("cart")
    ? JSON.parse(localStorage.getItem("cart")).shippingAddress
    : { address: "", city: "", postalCode: "", country: "" };

  const [shippingAddress, setShippingAddress] = useState(
    initialShippingAddress
  );

  // Fonction pour sauvegarder l'adresse de livraison
  const saveShippingAddress = (address) => {
    setShippingAddress(address);

    // Mettre à jour également l'adresse dans le localStorage
    const cart = localStorage.getItem("cart")
      ? JSON.parse(localStorage.getItem("cart"))
      : {};
    localStorage.setItem(
      "cart",
      JSON.stringify({
        ...cart,
        shippingAddress: address, // Utiliser l'adresse mise à jour ici
      })
    );
  };

  return (
    <ShippingContext.Provider value={{ shippingAddress, saveShippingAddress }}>
      {children}
    </ShippingContext.Provider>
  );
};
