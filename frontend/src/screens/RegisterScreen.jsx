import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Form, Button, Col, Row } from "react-bootstrap";
import { toast } from "react-toastify";
import api from "../components/axios";
import { useAuth } from "../Contexts/AuthContext"; // Utilisation du contexte d'authentification
import Loader from "../components/Loader";
import FormContainer from "../components/FormContainer";

const RegisterScreen = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { setCredentials } = useAuth(); // Utilisation du contexte pour stocker les informations utilisateur
  const navigate = useNavigate();
  const { search } = useLocation();
  const sp = new URLSearchParams(search);
  const redirect = sp.get("redirect") || "/";

  const submitHandler = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Les mots de passe ne correspondent pas");
      return;
    }

    try {
      setIsLoading(true); // Afficher le loader pendant l'inscription

      // Requête vers l'API d'inscription backend
      const { data } = await api.post("/users", {
        name,
        email,
        password,
      });

      // Stocker les informations utilisateur dans le contexte après une inscription réussie
      setCredentials(data);

      // Rediriger l'utilisateur après l'inscription
      navigate(redirect);
    } catch (err) {
      toast.error(err?.response?.data?.message || "L'inscription a échoué");
    } finally {
      setIsLoading(false); // Cacher le loader
    }
  };

  return (
    <FormContainer>
      <h1>S'inscrire</h1>
      <Form onSubmit={submitHandler}>
        <Form.Group controlId="name" className="my-3">
          <Form.Label>Nom</Form.Label>
          <Form.Control
            type="text"
            placeholder="Entrez votre nom"
            value={name}
            onChange={(e) => setName(e.target.value)}
          ></Form.Control>
        </Form.Group>

        <Form.Group controlId="email" className="my-3">
          <Form.Label>Adresse email</Form.Label>
          <Form.Control
            type="email"
            placeholder="Entrez votre adresse email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          ></Form.Control>
        </Form.Group>

        <Form.Group controlId="password" className="my-3">
          <Form.Label>Mot de passe</Form.Label>
          <Form.Control
            type="password"
            placeholder="Entrez votre mot de passe"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          ></Form.Control>
        </Form.Group>

        <Form.Group controlId="confirmPassword" className="my-3">
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
          className="mt-2"
          disabled={isLoading}
        >
          S'inscrire
        </Button>
        {isLoading && <Loader />}
      </Form>

      <Row className="py-3">
        <Col>
          Vous avez déjà un compte ?{" "}
          <Link to={redirect ? `/login?redirect=${redirect}` : "/login"}>
            Se connecter
          </Link>
        </Col>
      </Row>
    </FormContainer>
  );
};

export default RegisterScreen;
