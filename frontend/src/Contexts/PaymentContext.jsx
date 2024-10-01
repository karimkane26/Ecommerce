import React, { createContext, useContext, useState } from "react";

const PaymentContext = createContext();

export const usePaymentContext = () => useContext(PaymentContext);

export const PaymentProvider = ({ children }) => {
  const [shippingAddress, setShippingAddress] = useState(
    JSON.parse(localStorage.getItem("shippingAddress")) || null
  );
  const [paymentMethod, setPaymentMethod] = useState(
    localStorage.getItem("paymentMethod") || ""
  );

  const saveShippingAddress = (address) => {
    setShippingAddress(address);
    localStorage.setItem("shippingAddress", JSON.stringify(address));
  };

  const savePaymentMethod = (method) => {
    setPaymentMethod(method);
    localStorage.setItem("paymentMethod", method);
  };

  return (
    <PaymentContext.Provider
      value={{
        shippingAddress,
        paymentMethod,
        saveShippingAddress,
        savePaymentMethod,
      }}
    >
      {children}
    </PaymentContext.Provider>
  );
};
