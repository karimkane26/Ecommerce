import React, { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { Row, Col, ListGroup, Image, Card, Button } from "react-bootstrap";
import Message from "../components/Message";
import Loader from "../components/Loader";
import { useOrders } from "../Contexts/OrdersContext"; // Utilisation du contexte Orders

const OrderScreen = () => {
  const { id: orderId } = useParams();
  const { getOrderDetails, orderDetails, isLoading, error } = useOrders();

  useEffect(() => {
    getOrderDetails(orderId); // Appel à la fonction pour récupérer les détails de la commande
  }, [orderId, getOrderDetails]);

  // Vérification si les détails de la commande existent avant de les afficher
  // if (isLoading) {
  //   return <Loader />;
  // }

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
          <ListGroup.Item>
            <h2>Shipping</h2>
            <p>
              <strong>Address: </strong>
              {orderDetails.shippingAddress.address},{" "}
              {orderDetails.shippingAddress.city},{" "}
              {orderDetails.shippingAddress.postalCode},{" "}
              {orderDetails.shippingAddress.country}
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
      <Col md={4}>
        <Card>
          <ListGroup variant="flush">
            <ListGroup.Item>
              <h2>Order Summary</h2>
            </ListGroup.Item>
            <ListGroup.Item>
              <Row>
                <Col>Items:</Col>
                <Col>${orderDetails.itemsPrice}</Col>
              </Row>
            </ListGroup.Item>
            <ListGroup.Item>
              <Row>
                <Col>Shipping:</Col>
                <Col>${orderDetails.shippingPrice}</Col>
              </Row>
            </ListGroup.Item>
            <ListGroup.Item>
              <Row>
                <Col>Tax:</Col>
                <Col>${orderDetails.taxPrice}</Col>
              </Row>
            </ListGroup.Item>
            <ListGroup.Item>
              <Row>
                <Col>Total:</Col>
                <Col>${orderDetails.totalPrice}</Col>
              </Row>
            </ListGroup.Item>
            <ListGroup.Item>
              <Button
                type="button"
                className="btn-block"
                disabled={orderDetails.orderItems.length === 0}
              >
                Place Order
              </Button>
            </ListGroup.Item>
          </ListGroup>
        </Card>
      </Col>
    </Row>
  );
};

export default OrderScreen;
