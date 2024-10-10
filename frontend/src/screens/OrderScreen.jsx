// import React, { useEffect, useState } from "react";
// import { Link, useParams } from "react-router-dom";
// import { Row, Col, ListGroup, Image, Card, Button } from "react-bootstrap";
// import Message from "../components/Message";
// import Loader from "../components/Loader";
// import { useOrders } from "../Contexts/OrdersContext";
// import { PayPalButtons, usePayPalScriptReducer } from "@paypal/react-paypal-js"; // Importation de PayPal
// import api from "../components/axios";

// const OrderScreen = () => {
//   const { id: orderId } = useParams();
//   const { getOrderDetails, orderDetails, isLoading, error } = useOrders();
//   const [{ isPending }, paypalDispatch] = usePayPalScriptReducer();
//   const [sdkReady, setSdkReady] = useState(false);

//   useEffect(() => {
//     const loadPayPalScript = async () => {
//       try {
//         const { data } = await api.get("/config/paypal"); // Appel à l'API pour obtenir le clientId
//         console.log("PayPal API response:", data); // Pour voir ce qui est retourné dans la console

//         // Extraire le clientId correctement depuis l'objet retourné
//         const clientId = data.clientId;
//         console.log("Client ID:", clientId); // Pour vérifier s'il est défini

//         if (clientId && typeof clientId === "string") {
//           // Charger le SDK PayPal avec un clientId valide
//           paypalDispatch({
//             type: "resetOptions",
//             value: {
//               "client-id": clientId, // Assure-toi de bien passer le clientId ici
//               currency: "USD",
//             },
//           });
//           setSdkReady(true);
//         } else {
//           throw new Error("Invalid PayPal Client ID format");
//         }
//       } catch (err) {
//         console.error("Erreur lors du chargement de PayPal SDK:", err);
//         // Optionnel : Gérer l'erreur ici
//       }
//     };

//     // Appel de la fonction de récupération des détails de la commande si nécessaire
//     if (!orderDetails || orderDetails._id !== orderId) {
//       getOrderDetails(orderId);
//     } else if (!orderDetails.isPaid) {
//       if (!window.paypal) {
//         loadPayPalScript(); // Charger le script PayPal si nécessaire
//       } else {
//         setSdkReady(true);
//       }
//     }
//   }, [orderDetails, orderId, getOrderDetails, paypalDispatch]);

//   // Fonction de mise à jour de la commande après un paiement réussi
//   const updateOrderToPaid = async (paymentResult) => {
//     try {
//       const { data } = await api.put(`/orders/${orderId}/pay`, paymentResult);
//       console.log("Order successfully updated:", data);
//       getOrderDetails(orderId); // Recharger les détails de la commande
//     } catch (error) {
//       console.error("Error updating order to paid:", error);
//     }
//   };
//   const handlePaymentSuccess = (paymentResult) => {
//     console.log("Payment Successful:", paymentResult);
//     // Appeler la fonction pour marquer la commande comme payée dans le backend
//     updateOrderToPaid(paymentResult);
//   };

//   console.log("Rendering OrderScreen with orderDetails:", orderDetails);

//   if (isLoading) {
//     return <Loader />;
//   }

//   if (error) {
//     return <Message variant="danger">{error}</Message>;
//   }

//   if (!orderDetails) {
//     return <Message variant="danger">Order details not found</Message>;
//   }

//   return (
//     <Row>
//       <Col md={8}>
//         <ListGroup variant="flush">
//           {/* Informations de livraison et méthodes de paiement */}
//           <ListGroup.Item>
//             <h2>Shipping</h2>
//             <p>
//               {orderDetails.shippingAddress ? (
//                 <>
//                   {orderDetails.shippingAddress.address},{" "}
//                   {orderDetails.shippingAddress.city},{" "}
//                   {orderDetails.shippingAddress.postalCode},{" "}
//                   {orderDetails.shippingAddress.country}
//                 </>
//               ) : (
//                 <Message variant="danger">
//                   Shipping address not available
//                 </Message>
//               )}
//             </p>
//             {orderDetails.isDelivered ? (
//               <Message variant="success">Delivered</Message>
//             ) : (
//               <Message variant="danger">Not Delivered</Message>
//             )}
//           </ListGroup.Item>

//           <ListGroup.Item>
//             <h2>Payment Method</h2>
//             <strong>Method: </strong> {orderDetails.paymentMethod}
//             {orderDetails.isPaid ? (
//               <Message variant="success">Paid on {orderDetails.paidAt}</Message>
//             ) : (
//               <Message variant="danger">Not Paid</Message>
//             )}
//           </ListGroup.Item>

//           {/* Affichage des articles de la commande */}
//           <ListGroup.Item>
//             <h2>Order Items</h2>
//             {orderDetails.orderItems.length === 0 ? (
//               <Message>Your order is empty</Message>
//             ) : (
//               <ListGroup variant="flush">
//                 {orderDetails.orderItems.map((item, index) => (
//                   <ListGroup.Item key={index}>
//                     <Row>
//                       <Col md={1}>
//                         <Image src={item.image} alt={item.name} fluid rounded />
//                       </Col>
//                       <Col>
//                         <Link to={`/product/${item.product}`}>{item.name}</Link>
//                       </Col>
//                       <Col md={4}>
//                         {item.qty} x ${item.price} = ${item.qty * item.price}
//                       </Col>
//                     </Row>
//                   </ListGroup.Item>
//                 ))}
//               </ListGroup>
//             )}
//           </ListGroup.Item>
//         </ListGroup>
//       </Col>

//       {/* Résumé de la commande avec bouton PayPal */}
//       <Col md={4}>
//         <Card>
//           <ListGroup variant="flush">
//             <ListGroup.Item>
//               <h2>Order Summary</h2>
//             </ListGroup.Item>
//             <ListGroup.Item>
//               <Row>
//                 <Col>Items:</Col>
//                 <Col>${orderDetails.itemsPrice.toFixed(2)}</Col>
//               </Row>
//             </ListGroup.Item>
//             <ListGroup.Item>
//               <Row>
//                 <Col>Shipping:</Col>
//                 <Col>${orderDetails.shippingPrice.toFixed(2)}</Col>
//               </Row>
//             </ListGroup.Item>
//             <ListGroup.Item>
//               <Row>
//                 <Col>Tax:</Col>
//                 <Col>${orderDetails.taxPrice.toFixed(2)}</Col>
//               </Row>
//             </ListGroup.Item>
//             <ListGroup.Item>
//               <Row>
//                 <Col>Total:</Col>
//                 <Col>${orderDetails.totalPrice.toFixed(2)}</Col>
//               </Row>
//             </ListGroup.Item>
//             {/* Bouton PayPal */}
//             {!orderDetails.isPaid && (
//               <ListGroup.Item>
//                 {isPending ? (
//                   <Loader />
//                 ) : (
//                   sdkReady && (
//                     <PayPalButtons
//                       createOrder={(data, actions) => {
//                         return actions.order.create({
//                           purchase_units: [
//                             {
//                               amount: {
//                                 value: orderDetails.totalPrice.toString(),
//                               },
//                             },
//                           ],
//                         });
//                       }}
//                       onApprove={(data, actions) => {
//                         return actions.order
//                           .capture()
//                           .then(handlePaymentSuccess);
//                       }}
//                       onError={(err) => {
//                         console.error("PayPal Buttons Error:", err);
//                         // Vous pouvez également afficher un Message d'erreur ici
//                       }}
//                     />
//                   )
//                 )}
//               </ListGroup.Item>
//             )}
//           </ListGroup>
//         </Card>
//       </Col>
//     </Row>
//   );
// };

// export default OrderScreen;

// src/screens/OrderScreen.js
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Row, Col, ListGroup, Image, Card, Button } from "react-bootstrap";
import Message from "../components/Message";
import Loader from "../components/Loader";
import { useOrders } from "../Contexts/OrdersContext"; // Assurez-vous que le chemin est correct
import { useAuth } from "../Contexts/AuthContext"; // Importer le hook AuthContext
import { PayPalButtons, usePayPalScriptReducer } from "@paypal/react-paypal-js"; // Importation de PayPal
import api from "../components/axios";
import { toast } from "react-toastify";

const OrderScreen = () => {
  const { id: orderId } = useParams();
  const {
    getOrderDetails,
    orderDetails,
    isLoading,
    error,
    updateOrderToDelivered,
  } = useOrders();
  const { userInfo, isLoadingUser } = useAuth();
  const [{ isPending }, paypalDispatch] = usePayPalScriptReducer();
  const [sdkReady, setSdkReady] = useState(false);

  useEffect(() => {
    const loadPayPalScript = async () => {
      try {
        const { data } = await api.get("/config/paypal");
        console.log("PayPal API response:", data);
        const clientId = data.clientId;
        console.log("Client ID:", clientId);

        if (clientId && typeof clientId === "string") {
          paypalDispatch({
            type: "resetOptions",
            value: {
              "client-id": clientId,
              currency: "USD",
            },
          });
          setSdkReady(true);
        } else {
          throw new Error("Invalid PayPal Client ID format");
        }
      } catch (err) {
        console.error("Erreur lors du chargement de PayPal SDK:", err);
      }
    };

    // Appel de la fonction de récupération des détails de la commande si nécessaire
    if (!orderDetails || orderDetails._id !== orderId) {
      console.log("Fetching order details for ID:", orderId);
      getOrderDetails(orderId);
    } else if (!orderDetails.isPaid) {
      if (!window.paypal) {
        loadPayPalScript(); // Charger le script PayPal si nécessaire
      } else {
        setSdkReady(true);
      }
    }
  }, [orderDetails, orderId, getOrderDetails, paypalDispatch]);

  // Fonction de mise à jour de la commande après un paiement réussi
  const updateOrderToPaid = async (paymentResult) => {
    try {
      const { data } = await api.put(`/orders/${orderId}/pay`, paymentResult);
      console.log("Order successfully updated:", data);
      getOrderDetails(orderId); // Recharger les détails de la commande
    } catch (error) {
      console.error("Error updating order to paid:", error);
      toast.error("Erreur lors de la mise à jour du paiement de la commande.");
    }
  };

  const handlePaymentSuccess = (paymentResult) => {
    console.log("Payment Successful:", paymentResult);
    // Appeler la fonction pour marquer la commande comme payée dans le backend
    updateOrderToPaid(paymentResult);
  };

  // Fonction pour gérer la livraison avec le contexte
  const deliverHandler = async () => {
    if (
      window.confirm(
        "Êtes-vous sûr de vouloir marquer cette commande comme livrée ?"
      )
    ) {
      try {
        await updateOrderToDelivered(orderId);
      } catch (err) {
        console.error("Error delivering the order:", err);
        // Optionnel: Vous pouvez afficher un message d'erreur ici si nécessaire
      }
    }
  };

  console.log("Rendering OrderScreen with orderDetails:", orderDetails);

  if (isLoading || isLoadingUser) {
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
          {/* Informations de livraison */}
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
              <Message variant="success">
                Delivered on{" "}
                {new Date(orderDetails.deliveredAt).toLocaleString()}
              </Message>
            ) : (
              <Message variant="danger">Not Delivered</Message>
            )}
          </ListGroup.Item>

          {/* Méthode de paiement */}
          <ListGroup.Item>
            <h2>Payment Method</h2>
            <strong>Method: </strong> {orderDetails.paymentMethod}
            {orderDetails.isPaid ? (
              <Message variant="success">
                Paid on {new Date(orderDetails.paidAt).toLocaleString()}
              </Message>
            ) : (
              <Message variant="danger">Not Paid</Message>
            )}
          </ListGroup.Item>

          {/* Articles de la commande */}
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
                        {item.qty} x ${item.price} = $
                        {(item.qty * item.price).toFixed(2)}
                      </Col>
                    </Row>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            )}
          </ListGroup.Item>
        </ListGroup>
      </Col>

      {/* Résumé de la commande avec bouton PayPal et livraison */}
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
                        toast.error("Erreur lors du traitement du paiement.");
                      }}
                    />
                  )
                )}
              </ListGroup.Item>
            )}

            {/* Bouton de livraison (visible uniquement pour les admins) */}
            {orderDetails.isPaid &&
              !orderDetails.isDelivered &&
              userInfo &&
              userInfo.isAdmin && (
                <ListGroup.Item>
                  <Button
                    type="button"
                    className="btn btn-block"
                    onClick={deliverHandler}
                    disabled={isLoading}
                  >
                    {isLoading
                      ? "Marking as Delivered..."
                      : "Mark as Delivered"}
                  </Button>
                </ListGroup.Item>
              )}
          </ListGroup>
        </Card>
      </Col>
    </Row>
  );
};

export default OrderScreen;
