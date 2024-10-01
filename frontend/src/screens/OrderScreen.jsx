import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { Row, Col, ListGroup, Card, Button } from "react-bootstrap";
import { toast } from "react-toastify";
import Message from "../components/Message";
import Loader from "../components/Loader";
import { useOrders } from "../Contexts/OrdersContext";

const OrderScreen = () => {
  const { id: orderId } = useParams(); // Récupérer l'ID de la commande via l'URL
  const { orderDetails, loading, error, getOrderDetails } = useOrders(); // Utiliser le contexte des commandes

  useEffect(() => {
    const token = localStorage.getItem("token"); // Vérifier le token
    if (!token) {
      toast.error("You need to log in to view this page.");
      return;
    }
    getOrderDetails(orderId, token); // Récupérer les détails de la commande
  }, [orderId, getOrderDetails]);

  const deliverHandler = () => {
    toast.success("Order marked as delivered");
  };

  // if (loading) return <Loader />;
  if (error) return <Message variant="danger">{error}</Message>;

  return (
    <>
      <h1>Order {orderDetails?._id}</h1>
      <Row>
        <Col md={8}>
          <ListGroup variant="flush">
            <ListGroup.Item>
              <h2>Shipping</h2>
              <p>
                <strong>Name:</strong> {orderDetails.user?.name}
              </p>
              <p>
                <strong>Email:</strong>{" "}
                <a href={`mailto:${orderDetails.user?.email}`}>
                  {orderDetails.user?.email}
                </a>
              </p>
              <p>
                <strong>Address:</strong>{" "}
                {orderDetails.shippingAddress?.address},
                {orderDetails.shippingAddress?.city}{" "}
                {orderDetails.shippingAddress?.postalCode},{" "}
                {orderDetails.shippingAddress?.country}
              </p>
              {orderDetails.isDelivered ? (
                <Message variant="success">
                  Delivered on {orderDetails.deliveredAt}
                </Message>
              ) : (
                <Message variant="danger">Not Delivered</Message>
              )}
            </ListGroup.Item>
          </ListGroup>
        </Col>

        <Col md={4}>
          <Card>
            <ListGroup variant="flush">
              {/* Détails sommaire de la commande */}
              <ListGroup.Item>
                <h2>Order Summary</h2>
                {/* Ajoutez ici le récapitulatif de la commande */}
              </ListGroup.Item>
              <ListGroup.Item>
                <Button
                  type="button"
                  className="btn btn-block"
                  onClick={deliverHandler}
                >
                  Mark as Delivered
                </Button>
              </ListGroup.Item>
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default OrderScreen;
