// import express from "express";
// import products from "./data/products.js";
// import dotenv from 'dotenv';
// import cors from 'cors';
// import connectDB from "./config/db.js";
// import productRoutes from './routes/productRoutes.js';
// import userRoutes from './routes/userRoutes.js';
// import orderRoutes from './routes/orderRoutes.js';
// import {notFound,errorHandler} from "./middleware/errorMiddleware.js";
// import MongoStore from "connect-mongo";
// import session from "express-session";
// import cookieParser from "cookie-parser";
// dotenv.config();
// connectDB();
// // Connect to MongoDB
// const PORT = process.env.PORT || 5000;
// const app = express();
// app.use(cookieParser())
// app.use(express.json()); 
// app.use(express.urlencoded({extended: true}))
// app.use(
//   session({
//     secret: '123456', // Remplacez par une valeur sécurisée
//     resave: false,
//     saveUninitialized: false,
//     store: MongoStore.create({
//       mongoUrl: 'mongodb+srv://lucidev97:passer123@jayma.vctqz.mongodb.net/?retryWrites=true&w=majority&appName=Jayma',
//       ttl: 14 * 24 * 60 * 60, // Délai d'expiration des sessions (14 jours)
//     }),
//     cookie: {
//       maxAge: 1000 * 60 * 60 * 24 * 7, // 7 jours
//       secure: false, // Si vous utilisez HTTPS, mettez ceci à true
//     },
//   })
// );
// app.use(cors({
//   origin: 'http://localhost:3000', // Allow requests from this origin
//   credentials: true ,// Allow credentials (e.g., cookies) to be sent
//    allowedHeaders: ['Authorization', 'Content-Type']
// }));
// import { fileURLToPath } from 'url';
// import path from 'path'
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);
// app.use('/api/products',productRoutes);
// app.use('/api/users',userRoutes);
// app.use('/api/orders',orderRoutes)
// app.get('/api/config/paypal',(req, res) => res.send({
//   clientId: process.env.PAYPAL_CLIENT_ID }))

//   if(process.env.NODE_ENV ==='production'){
//     app.use(express.static(path.join(__dirname,'/frontend/build')))

//     app.get('*',(req,res) => res.sendFile(path.resolve(__dirname, '../frontend/build/index.html')))
//   }else{
//       app.get('/', (req, res) => {
//   res.send('API is running ...');
// });
//   }
// app.use(notFound);
// app.use(errorHandler);
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
// Importations des modules nécessaires
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import path from 'path';
import { fileURLToPath } from 'url';

// Importations des routes et middleware
import productRoutes from './routes/productRoutes.js';
import userRoutes from './routes/userRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';

// Configurer les variables d'environnement
dotenv.config();

// Connecter à la base de données
import connectDB from './config/db.js';
connectDB();

// Configuration de __dirname pour les modules ES
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialiser Express
const app = express();

// Middleware
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configuration des sessions
app.use(
  session({
    secret: process.env.SESSION_SECRET || '123456', // Utilisez une variable d'environnement pour la sécurité
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URI, // Utilisez une variable d'environnement pour la sécurité
      ttl: 14 * 24 * 60 * 60, // 14 jours
    }),
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 jours
      secure: process.env.NODE_ENV === 'production', // Mettez à true si vous utilisez HTTPS
    },
  })
);

// Configuration de CORS
app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:3000', // Utilisez une variable d'environnement
    credentials: true, // Autoriser l'envoi de cookies
    allowedHeaders: ['Authorization', 'Content-Type'],
  })
);

// Définir les routes API
app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);

// Route pour la configuration PayPal
app.get('/api/config/paypal', (req, res) =>
  res.send({ clientId: process.env.PAYPAL_CLIENT_ID })
);

// Servir les fichiers statiques en production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../frontend/build')));

  // Toutes les autres requêtes renvoient index.html
  app.get('*', (req, res) =>
    res.sendFile(path.join(__dirname, '../frontend/build/index.html'))
  );
} else {
  app.get('/', (req, res) => {
    res.send('API is running ...');
  });
}

// Middleware de gestion des erreurs
app.use(notFound);
app.use(errorHandler);

// Démarrer le serveur
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
