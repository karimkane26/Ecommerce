import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Row, Col, ListGroup, Image, Card, Button } from "react-bootstrap";
import Message from "../components/Message";
import Loader from "../components/Loader";
import { useOrders } from "../Contexts/OrdersContext";
import { PayPalButtons, usePayPalScriptReducer } from "@paypal/react-paypal-js"; // Importation de PayPal
import api from "../components/axios";

const OrderScreen = () => {
  const { id: orderId } = useParams();
  const { getOrderDetails, orderDetails, isLoading, error } = useOrders();
  const [{ isPending }, paypalDispatch] = usePayPalScriptReducer();
  const [sdkReady, setSdkReady] = useState(false);

  // useEffect(() => {
  //   const loadPayPalScript = async () => {
  //     try {
  //       const { data: clientId } = await api.get("/config/paypal");
  //       console.log("PayPal Client ID:", clientId);
  //       paypalDispatch({
  //         type: "resetOptions",
  //         value: {
  //           "client-id": clientId,
  //           currency: "USD",
  //         },
  //       });
  //       setSdkReady(true);
  //     } catch (err) {
  //       console.error("Erreur lors du chargement de PayPal SDK:", err);
  //       // Optionnel: Vous pouvez définir une erreur ici si nécessaire
  //     }
  //   };

  //   if (!orderDetails || orderDetails._id !== orderId) {
  //     console.log("Fetching order details for ID:", orderId);
  //     getOrderDetails(orderId);
  //   } else if (!orderDetails.isPaid) {
  //     if (!window.paypal) {
  //       loadPayPalScript();
  //     } else {
  //       setSdkReady(true);
  //     }
  //   }
  // }, [orderDetails, orderId, getOrderDetails, paypalDispatch]);
  useEffect(() => {
    const loadPayPalScript = async () => {
      try {
        const { data } = await api.get("/config/paypal"); // Appel à l'API pour obtenir le clientId
        console.log("PayPal API response:", data); // Pour voir ce qui est retourné dans la console

        // Extraire le clientId correctement depuis l'objet retourné
        const clientId = data.clientId;
        console.log("Client ID:", clientId); // Pour vérifier s'il est défini

        if (clientId && typeof clientId === "string") {
          // Charger le SDK PayPal avec un clientId valide
          paypalDispatch({
            type: "resetOptions",
            value: {
              "client-id": clientId, // Assure-toi de bien passer le clientId ici
              currency: "USD",
            },
          });
          setSdkReady(true);
        } else {
          throw new Error("Invalid PayPal Client ID format");
        }
      } catch (err) {
        console.error("Erreur lors du chargement de PayPal SDK:", err);
        // Optionnel : Gérer l'erreur ici
      }
    };

    // Appel de la fonction de récupération des détails de la commande si nécessaire
    if (!orderDetails || orderDetails._id !== orderId) {
      getOrderDetails(orderId);
    } else if (!orderDetails.isPaid) {
      if (!window.paypal) {
        loadPayPalScript(); // Charger le script PayPal si nécessaire
      } else {
        setSdkReady(true);
      }
    }
  }, [orderDetails, orderId, getOrderDetails, paypalDispatch]);

  const handlePaymentSuccess = (paymentResult) => {
    console.log("Payment Successful:", paymentResult);
    // Appeler la fonction pour marquer la commande comme payée dans le backend
    // updateOrderToPaid(orderId, paymentResult);
  };

  console.log("Rendering OrderScreen with orderDetails:", orderDetails);

  if (isLoading) {
    return <Loader />;
  }

  if (error) {
    return <Message variant="danger">{error}</Message>;
  }

  if (!orderDetails) {
    return <Message variant="danger">Order details not found</Message>;
  }

  return (
    <Row>
      <Col md={8}>
        <ListGroup variant="flush">
          {/* Informations de livraison et méthodes de paiement */}
          <ListGroup.Item>
            <h2>Shipping</h2>
            <p>
              {orderDetails.shippingAddress ? (
                <>
                  {orderDetails.shippingAddress.address},{" "}
                  {orderDetails.shippingAddress.city},{" "}
                  {orderDetails.shippingAddress.postalCode},{" "}
                  {orderDetails.shippingAddress.country}
                </>
              ) : (
                <Message variant="danger">
                  Shipping address not available
                </Message>
              )}
            </p>
            {orderDetails.isDelivered ? (
              <Message variant="success">Delivered</Message>
            ) : (
              <Message variant="danger">Not Delivered</Message>
            )}
          </ListGroup.Item>

          <ListGroup.Item>
            <h2>Payment Method</h2>
            <strong>Method: </strong> {orderDetails.paymentMethod}
            {orderDetails.isPaid ? (
              <Message variant="success">Paid</Message>
            ) : (
              <Message variant="danger">Not Paid</Message>
            )}
          </ListGroup.Item>

          {/* Affichage des articles de la commande */}
          <ListGroup.Item>
            <h2>Order Items</h2>
            {orderDetails.orderItems.length === 0 ? (
              <Message>Your order is empty</Message>
            ) : (
              <ListGroup variant="flush">
                {orderDetails.orderItems.map((item, index) => (
                  <ListGroup.Item key={index}>
                    <Row>
                      <Col md={1}>
                        <Image src={item.image} alt={item.name} fluid rounded />
                      </Col>
                      <Col>
                        <Link to={`/product/${item.product}`}>{item.name}</Link>
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

      {/* Résumé de la commande avec bouton PayPal */}
      <Col md={4}>
        <Card>
          <ListGroup variant="flush">
            <ListGroup.Item>
              <h2>Order Summary</h2>
            </ListGroup.Item>
            <ListGroup.Item>
              <Row>
                <Col>Items:</Col>
                <Col>${orderDetails.itemsPrice.toFixed(2)}</Col>
              </Row>
            </ListGroup.Item>
            <ListGroup.Item>
              <Row>
                <Col>Shipping:</Col>
                <Col>${orderDetails.shippingPrice.toFixed(2)}</Col>
              </Row>
            </ListGroup.Item>
            <ListGroup.Item>
              <Row>
                <Col>Tax:</Col>
                <Col>${orderDetails.taxPrice.toFixed(2)}</Col>
              </Row>
            </ListGroup.Item>
            <ListGroup.Item>
              <Row>
                <Col>Total:</Col>
                <Col>${orderDetails.totalPrice.toFixed(2)}</Col>
              </Row>
            </ListGroup.Item>
            {/* Bouton PayPal */}
            {!orderDetails.isPaid && (
              <ListGroup.Item>
                {isPending ? (
                  <Loader />
                ) : (
                  sdkReady && (
                    <PayPalButtons
                      createOrder={(data, actions) => {
                        return actions.order.create({
                          purchase_units: [
                            {
                              amount: {
                                value: orderDetails.totalPrice.toString(),
                              },
                            },
                          ],
                        });
                      }}
                      onApprove={(data, actions) => {
                        return actions.order
                          .capture()
                          .then(handlePaymentSuccess);
                      }}
                      onError={(err) => {
                        console.error("PayPal Buttons Error:", err);
                        // Vous pouvez également afficher un Message d'erreur ici
                      }}
                    />
                  )
                )}
              </ListGroup.Item>
            )}
          </ListGroup>
        </Card>
      </Col>
    </Row>
  );
};

export default OrderScreen;
