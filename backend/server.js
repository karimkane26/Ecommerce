import express from "express";
import products from "./data/products.js";
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from "./config/db.js";
import productRoutes from './routes/productRoutes.js';
import userRoutes from './routes/userRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import {notFound,errorHandler} from "./middleware/errorMiddleware.js";
import MongoStore from "connect-mongo";
import session from "express-session";
import cookieParser from "cookie-parser";
dotenv.config();
connectDB();
// Connect to MongoDB
const PORT = process.env.PORT || 5000;
const app = express();
app.use(cookieParser())
app.use(express.json()); 
app.use(express.urlencoded({extended: true}))
app.use(
  session({
    secret: '123456', // Remplacez par une valeur sécurisée
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: 'mongodb+srv://lucidev97:passer123@jayma.vctqz.mongodb.net/?retryWrites=true&w=majority&appName=Jayma',
      ttl: 14 * 24 * 60 * 60, // Délai d'expiration des sessions (14 jours)
    }),
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 jours
      secure: false, // Si vous utilisez HTTPS, mettez ceci à true
    },
  })
);
app.use(cors({
  origin: 'http://localhost:3000', // Allow requests from this origin
  credentials: true ,// Allow credentials (e.g., cookies) to be sent
   allowedHeaders: ['Authorization', 'Content-Type']
}));

app.get('/', (req, res) => {
  res.send('API is running ...');
});
app.use('/api/products',productRoutes);
app.use('/api/users',userRoutes);
app.use('/api/orders',orderRoutes)

app.use(notFound);
app.use(errorHandler);
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
