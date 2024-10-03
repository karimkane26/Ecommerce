// PlaceOrderScreen.js
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button, Row, Col, ListGroup, Image, Card } from "react-bootstrap";
import CheckoutSteps from "../components/CheckoutSteps";
import { useOrders } from "../Contexts/OrdersContext";
import Loader from "../components/Loader";
import Message from "../components/Message";
import { useCartContext } from "../Contexts/CartContext";
import { useShippingContext } from "../Contexts/ShippingContext"; // Importation du ShippingContext
import { usePaymentContext } from "../Contexts/PaymentContext"; // Importation du PaymentContext

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
  const { createOrder, isLoading, error } = useOrders();
  const { shippingAddress } = useShippingContext(); // Récupération de l'adresse de livraison
  const { paymentMethod } = usePaymentContext(); // Récupération de la méthode de paiement

  // Ajouter des logs pour le débogage
  console.log("cartItems:", cartItems);
  console.log("shippingAddress:", shippingAddress);
  console.log("paymentMethod:", paymentMethod);

  const PlaceOrderHandler = async () => {
    const userInfo = localStorage.getItem("userInfo");
    const userId = userInfo ? userInfo._id : null; // Récupérer l'ID de l'utilisate
    try {
      const res = await createOrder({
        user: userId,
        orderItems: cartItems,
        shippingAddress: {
          ...shippingAddress, // Utilisation de l'adresse de livraison depuis le ShippingContext
          isDelivered: false,
        },
        paymentMethod: paymentMethod, // Utilisation de la méthode de paiement depuis le PaymentContext
        itemsPrice: itemsPrice,
        shippingPrice: shippingPrice,
        taxPrice: taxPrice,
        totalPrice: totalPrice,
      });
      clearCartItems();
      navigate(`/order/${res._id}`);
    } catch (error) {
      console.error("Failed to place order", error);
      // Optionnel : Afficher une notification ou message d'erreur à l'utilisateur
      // toast.error("Failed to place order");
    }
  };

  // Ajoutez une vérification pour vous assurer que shippingAddress est défini
  if (!shippingAddress || !shippingAddress.address) {
    return <Message variant="danger">Shipping address is missing.</Message>;
  }

  // Ajoutez une vérification pour vous assurer que cartItems est défini
  if (!cartItems) {
    return <Message variant="danger">Cart items are missing.</Message>;
  }

  return (
    <div>
      <CheckoutSteps step1 step2 step3 step4 />
      <Row>
        <Col md={8}>
          <ListGroup variant="flush">
            <ListGroup.Item>
              <h2>Shipping</h2>
              <p>
                <strong>Address :</strong>
                {shippingAddress.address}, {shippingAddress.city},{" "}
                {shippingAddress.postalCode}, {shippingAddress.country}
              </p>
            </ListGroup.Item>

            <ListGroup.Item>
              <h2>Payment Method</h2>
              <strong>Method :</strong> {paymentMethod}{" "}
              {/* Affichage de la méthode de paiement */}
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
                          <Link to={`/products/${item.product}`}>
                            {item.name}
                          </Link>
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
                  <Col>Items:</Col>
                  <Col>${itemsPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Shipping:</Col>
                  <Col>${shippingPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Tax:</Col>
                  <Col>${taxPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Total:</Col>
                  <Col>${totalPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                {error && <Message variant="danger">{error}</Message>}
              </ListGroup.Item>
              <ListGroup.Item>
                <Button
                  type="button"
                  className="btn-block"
                  disabled={cartItems.length === 0}
                  onClick={PlaceOrderHandler}
                >
                  Place Order
                </Button>
                {isLoading && <Loader />}
              </ListGroup.Item>
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default PlaceOrderScreen;
