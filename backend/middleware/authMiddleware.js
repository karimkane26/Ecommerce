import jwt from 'jsonwebtoken';
import asyncHandler from './asyncHandler.js';
import User from '../models/usersModel.js';
import cookieParser from 'cookie-parser';
// User must be authenticated
// const protect = asyncHandler(async(req, res, next) => {
//   let token = req.cookies.jwt;
//   if (token) {
//     try {
//       const decoded = jwt.verify(token, process.env.JWT_SECRET);
//       req.user = await User.findById(decoded.userId).select('-password');
//       next();
//     } catch (error) {
//       res.status(401);
//       return res.json({ message: 'Not authorized, token failed' });  // Ajoute un return ici
//     }
//   } else {
//     res.status(401);
//     return res.json({ message: 'Not authorized, no token' });  // Ajoute un return ici
//   }
// });
const protect = async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.userId).select("-password");
      next();
    } catch (error) {
      res.status(401);
      throw new Error("Not authorized, token failed");
    }
  }

  if (!token) {
    res.status(401);
    throw new Error("Not authorized, no token");
  }
};



// User must be an admin
const admin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(401);
    throw new Error('Not authorized as an admin');
  }
};
export { protect, admin };
