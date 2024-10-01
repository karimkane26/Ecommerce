// PlaceOrderScreen.js
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Button,
  Row,
  Col,
  ListGroup,
  Image,
  Card,
  Spinner,
} from "react-bootstrap";
import CheckoutSteps from "../components/CheckoutSteps";
import Message from "../components/Message";
import { useCartContext } from "../Contexts/CartContext";
import { useShippingContext } from "../Contexts/ShippingContext";
import { usePaymentContext } from "../Contexts/PaymentContext";
import { useOrders } from "../Contexts/OrdersContext";
import { useAuth } from "../Contexts/AuthContext";

const PlaceOrderScreen = () => {
  const navigate = useNavigate();
  const {
    cartItems,
    itemsPrice,
    shippingPrice,
    taxPrice,
    totalPrice,
    clearCartItems,
  } = useCartContext();
  const { shippingAddress } = useShippingContext();
  const { paymentMethod } = usePaymentContext();
  const { userInfo, authLoading } = useAuth();
  const { createOrder, loading, error } = useOrders();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    console.log("userInfo dans PlaceOrderScreen :", userInfo);
    if (!shippingAddress?.address) {
      navigate("/shipping");
    } else if (!paymentMethod) {
      navigate("/payment");
    }
  }, [shippingAddress, paymentMethod, navigate, userInfo]);

  const PlaceOrderHandler = async () => {
    if (cartItems.length === 0) {
      alert("Votre panier est vide.");
      return;
    }

    if (!shippingAddress) {
      alert("Veuillez fournir une adresse de livraison.");
      return;
    }

    if (!paymentMethod) {
      alert("Veuillez choisir un mode de paiement.");
      return;
    }

    const orderData = {
      orderItems: cartItems,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      shippingPrice,
      taxPrice,
      totalPrice,
    };
    console.log("Données de la commande :", orderData);

    setIsLoading(true);
    try {
      const createdOrder = await createOrder(orderData);
      if (createdOrder) {
        clearCartItems();
        navigate(`/order/${createdOrder._id}`);
      }
    } catch (error) {
      console.error("Erreur lors de la création de la commande:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Une erreur est survenue lors de la création de la commande.";
      alert(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      {(isLoading || loading || authLoading) && <Spinner animation="border" />}
      {error && <Message variant="danger">{error}</Message>}
      <CheckoutSteps step1 step2 step3 step4 />
      <Row>
        <Col md={8}>
          <ListGroup variant="flush">
            <ListGroup.Item>
              <h2>Shipping</h2>
              {shippingAddress ? (
                <p>
                  <strong>Address :</strong> {shippingAddress.address},{" "}
                  {shippingAddress.city}, {shippingAddress.postalCode},{" "}
                  {shippingAddress.country}
                </p>
              ) : (
                <Message>No shipping address found.</Message>
              )}
            </ListGroup.Item>

            <ListGroup.Item>
              <h2>Payment Method</h2>
              <strong>Method: </strong> {paymentMethod}
            </ListGroup.Item>

            <ListGroup.Item>
              <h2>Order Items</h2>
              {cartItems.length === 0 ? (
                <Message>Your cart is empty</Message>
              ) : (
                <ListGroup variant="flush">
                  {cartItems.map((item, index) => (
                    <ListGroup.Item key={index}>
                      <Row>
                        <Col md={1}>
                          <Image
                            src={item.image}
                            alt={item.name}
                            fluid
                            rounded
                          />
                        </Col>
                        <Col>
                          <Link to={`/product/${item._id}`}>{item.name}</Link>
                        </Col>
                        <Col md={4}>
                          {item.qty} x ${item.price} = ${item.qty * item.price}
                        </Col>
                      </Row>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              )}
            </ListGroup.Item>
          </ListGroup>
        </Col>
        <Col md={4}>
          <Card>
            <ListGroup variant="flush">
              <ListGroup.Item>
                <h2>Order Summary</h2>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Items</Col>
                  <Col>${itemsPrice.toFixed(2)}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Shipping</Col>
                  <Col>${shippingPrice.toFixed(2)}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Tax</Col>
                  <Col>${taxPrice.toFixed(2)}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Total</Col>
                  <Col>${totalPrice.toFixed(2)}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Button
                  type="button"
                  className="btn-block"
                  disabled={
                    cartItems.length === 0 ||
                    loading ||
                    isLoading ||
                    authLoading
                  }
                  onClick={PlaceOrderHandler}
                >
                  Place Order
                </Button>
              </ListGroup.Item>
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default PlaceOrderScreen;
