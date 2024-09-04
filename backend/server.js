import express from "express";
import products from "./data/products.js";
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();

const PORT = process.env.PORT || 5000;
const app = express();

// Configuration de CORS pour autoriser les requêtes provenant de 'http://localhost:3000'
app.use(cors({
  origin: 'http://localhost:3000', // Autorise uniquement le frontend
  credentials: true // Autorise l'envoi de cookies
}));

app.get('/', (req, res) => {
  res.send('API is running ...');
});

app.get('/api/products', (req, res) => {
  res.json(products);
});

app.get('/api/products/:id', (req, res) => {
  const product = products.find((p) => p._id === req.params.id);
  res.json(product);
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
