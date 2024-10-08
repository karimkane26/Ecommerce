// src/screens/ProfileScreen.js
import React, { useEffect, useState } from "react";
import { Table, Form, Button, Row, Col } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { FaTimes } from "react-icons/fa";
import { toast } from "react-toastify";
import Message from "../components/Message";
import { useAuth } from "../Contexts/AuthContext"; // Utilisation du contexte Auth
import { useOrders } from "../Contexts/OrdersContext"; // Utilisation du contexte Orders
import api from "../components/axios"; // Assurez-vous que l'instance axios est correctement configurée

const ProfileScreen = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loadingUpdateProfile, setLoadingUpdateProfile] = useState(false);

  const { userInfo, setCredentials } = useAuth(); // Accès aux infos utilisateur et fonction de mise à jour
  const { orders, getMyOrders } = useOrders();

  useEffect(() => {
    if (userInfo) {
      setName(userInfo.name);
      setEmail(userInfo.email);
      getMyOrders(); // Récupérer les commandes de l'utilisateur
    }
  }, [userInfo, getMyOrders]);

  const submitHandler = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Les mots de passe ne correspondent pas");
      return;
    } else {
      try {
        setLoadingUpdateProfile(true);
        // Requête PUT pour mettre à jour le profil
        const { data } = await api.put(
          "/api/users/profile",
          { name, email, password },
          {
            headers: {
              Authorization: `Bearer ${userInfo.token}`, // Inclure le token d'authentification
            },
          }
        );

        setCredentials(data); // Mettre à jour le contexte Auth avec les nouvelles infos
        toast.success("Profil mis à jour avec succès");
      } finally {
        setLoadingUpdateProfile(false); // Arrête le chargement
      }
    }
  };

  return (
    <Row>
      <Col md={3}>
        <h2>Profil Utilisateur</h2>
        <Form onSubmit={submitHandler}>
          <Form.Group className="my-2" controlId="name">
            <Form.Label>Nom</Form.Label>
            <Form.Control
              type="text"
              placeholder="Entrez votre nom"
              value={name}
              onChange={(e) => setName(e.target.value)}
            ></Form.Control>
          </Form.Group>

          <Form.Group className="my-2" controlId="email">
            <Form.Label>Adresse email</Form.Label>
            <Form.Control
              type="email"
              placeholder="Entrez votre adresse email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            ></Form.Control>
          </Form.Group>

          <Form.Group className="my-2" controlId="password">
            <Form.Label>Mot de passe</Form.Label>
            <Form.Control
              type="password"
              placeholder="Entrez votre mot de passe"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            ></Form.Control>
          </Form.Group>

          <Form.Group className="my-2" controlId="confirmPassword">
            <Form.Label>Confirmez le mot de passe</Form.Label>
            <Form.Control
              type="password"
              placeholder="Confirmez votre mot de passe"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            ></Form.Control>
          </Form.Group>

          <Button
            type="submit"
            variant="primary"
            disabled={loadingUpdateProfile}
          >
            Mettre à jour
          </Button>
        </Form>
      </Col>
      <Col md={9}>
        <h2>Mes Commandes</h2>
        <Message variant="info">Chargement des commandes...</Message>
        <Table striped bordered hover responsive className="table-sm">
          <thead>
            <tr>
              <th>ID</th>
              <th>DATE</th>
              <th>TOTAL</th>
              <th>PAYÉ</th>
              <th>LIVRÉ</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {orders.length > 0 ? (
              orders.map((order) => (
                <tr key={order._id}>
                  <td>{order._id}</td>
                  <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                  <td>${order.totalPrice.toFixed(2)}</td>
                  <td>
                    {order.isPaid ? (
                      new Date(order.paidAt).toLocaleDateString()
                    ) : (
                      <FaTimes style={{ color: "red" }} />
                    )}
                  </td>
                  <td>
                    {order.isDelivered ? (
                      new Date(order.deliveredAt).toLocaleDateString()
                    ) : (
                      <FaTimes style={{ color: "red" }} />
                    )}
                  </td>
                  <td>
                    <LinkContainer to={`/order/${order._id}`}>
                      <Button className="btn-sm" variant="light">
                        Détails
                      </Button>
                    </LinkContainer>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center">
                  Aucune commande trouvée
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </Col>
    </Row>
  );
};

export default ProfileScreen;
