import React, { useState, useEffect } from "react";
import { Form, Button, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import FormContainer from "../components/FormContainer";
import CheckoutSteps from "../components/CheckoutSteps";
import { usePaymentContext } from "../Contexts/PaymentContext"; // Importer le contexte de paiement
import { useShippingContext } from "../Contexts/ShippingContext";
const PaymentScreen = () => {
  const navigate = useNavigate();
  const { paymentMethod, savePaymentMethod } = usePaymentContext(); // Utiliser le PaymentContext
  const { shippingAddress } = useShippingContext();
  useEffect(() => {
    console.log("Shipping Address:", shippingAddress);
    if (!shippingAddress?.address) {
      navigate("/shipping");
    }
  }, [navigate, shippingAddress]);

  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(
    paymentMethod || "PayPal"
  );

  const submitHandler = (e) => {
    e.preventDefault();
    savePaymentMethod(selectedPaymentMethod); // Sauvegarder le mode de paiement dans le contexte
    console.log("Selected Payment Method:", selectedPaymentMethod);
    navigate("/placeorder");
  };

  return (
    <FormContainer>
      <CheckoutSteps step1 step2 step3 />
      <h1>Payment Method</h1>
      <Form onSubmit={submitHandler}>
        <Form.Group>
          <Form.Label as="legend">Select Method</Form.Label>
          <Col>
            <Form.Check
              className="my-2"
              type="radio"
              label="PayPal or Credit Card"
              id="PayPal"
              name="paymentMethod"
              value="PayPal"
              checked={selectedPaymentMethod === "PayPal"}
              onChange={(e) => setSelectedPaymentMethod(e.target.value)}
            ></Form.Check>
          </Col>
        </Form.Group>

        <Button type="submit" variant="primary">
          Continue
        </Button>
      </Form>
    </FormContainer>
  );
};

export default PaymentScreen;
