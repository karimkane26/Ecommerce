// import { LinkContainer } from "react-router-bootstrap";
// import { Table, Button } from "react-bootstrap";
// import { FaTimes } from "react-icons/fa";
// import Message from "../../components/Message";
// import { useOrders } from "../../Contexts/OrdersContext"; // Importer le contexte
// import React, { useEffect } from "react";

// const OrderListScreen = () => {
//   const { getAllOrders, orders, error } = useOrders();

//   // Appeler la fonction pour récupérer les commandes au chargement du composant
//   useEffect(() => {
//     getAllOrders(); // Récupérer toutes les commandes
//   }, [getAllOrders]); // L'effet se déclenche uniquement au premier rendu

//   return (
//     <>
//       <h1>Orders</h1>
//       {error && (
//         <Message variant="danger">{error || "Une erreur est survenue"}</Message>
//       )}
//       <Table striped bordered hover responsive className="table-sm">
//         <thead>
//           <tr>
//             <th>ID</th>
//             <th>USER</th>
//             <th>DATE</th>
//             <th>TOTAL</th>
//             <th>PAID</th>
//             <th>DELIVERED</th>
//             <th></th>
//           </tr>
//         </thead>
//         <tbody>
//           {orders.length === 0 ? (
//             <tr>
//               <td colSpan="7">Aucune commande trouvée.</td>
//             </tr>
//           ) : (
//             orders.map((order) => (
//               <tr key={order._id}>
//                 <td>{order._id}</td>
//                 <td>{order.user && order.user.name}</td>
//                 <td>{order.createdAt.substring(0, 10)}</td>
//                 <td>${order.totalPrice}</td>
//                 <td>
//                   {order.isPaid ? (
//                     order.paidAt.substring(0, 10)
//                   ) : (
//                     <FaTimes style={{ color: "red" }} />
//                   )}
//                 </td>
//                 <td>
//                   {order.isDelivered ? (
//                     order.deliveredAt.substring(0, 10)
//                   ) : (
//                     <FaTimes style={{ color: "red" }} />
//                   )}
//                 </td>
//                 <td>
//                   <LinkContainer to={`/order/${order._id}`}>
//                     <Button variant="light" className="btn-sm">
//                       Details
//                     </Button>
//                   </LinkContainer>
//                 </td>
//               </tr>
//             ))
//           )}
//         </tbody>
//       </Table>
//     </>
//   );
// };

// export default OrderListScreen;
import { LinkContainer } from "react-router-bootstrap";
import { Table, Button } from "react-bootstrap";
import { FaTimes } from "react-icons/fa";
import Message from "../../components/Message";
import { useOrders } from "../../Contexts/OrdersContext"; // Importer le contexte
import React, { useEffect } from "react";

const OrderListScreen = () => {
  const { getAllOrders, orders, error } = useOrders();

  // Appeler la fonction pour récupérer les commandes au chargement du composant
  useEffect(() => {
    getAllOrders(); // Récupérer toutes les commandes
  }, [getAllOrders]); // L'effet se déclenche uniquement au premier rendu

  return (
    <>
      <h1>Orders</h1>
      {error && (
        <Message variant="danger">{error || "Une erreur est survenue"}</Message>
      )}
      <Table striped bordered hover responsive className="table-sm">
        <thead>
          <tr>
            <th>ID</th>
            <th>USER</th>
            <th>DATE</th>
            <th>TOTAL</th>
            <th>PAID</th>
            <th>DELIVERED</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {orders.length === 0 ? (
            <tr>
              <td colSpan="7">Aucune commande trouvée.</td>
            </tr>
          ) : (
            orders.map((order) => (
              <tr key={order._id}>
                <td>{order._id}</td>
                <td>
                  {order.user && order.user.name
                    ? order.user.name
                    : "Utilisateur inconnu"}
                </td>
                <td>
                  {order.createdAt
                    ? order.createdAt.substring(0, 10)
                    : "Date inconnue"}
                </td>
                <td>${order.totalPrice}</td>
                <td>
                  {order.isPaid ? (
                    order.paidAt ? (
                      order.paidAt.substring(0, 10)
                    ) : (
                      "Paiement date inconnue"
                    )
                  ) : (
                    <FaTimes style={{ color: "red" }} />
                  )}
                </td>
                <td>
                  {order.isDelivered ? (
                    order.deliveredAt ? (
                      order.deliveredAt.substring(0, 10)
                    ) : (
                      "Date de livraison inconnue"
                    )
                  ) : (
                    <FaTimes style={{ color: "red" }} />
                  )}
                </td>
                <td>
                  <LinkContainer to={`/order/${order._id}`}>
                    <Button variant="light" className="btn-sm">
                      Details
                    </Button>
                  </LinkContainer>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </Table>
    </>
  );
};

export default OrderListScreen;
