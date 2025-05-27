import jwt from "jsonwebtoken";
import User from "../models/userModels.js";
import { asyncHandler } from "./asyncHandler.js";

export const authenticate = asyncHandler(async (req, res, next) => {
  let token;
  token = req.cookies.jwt;  
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.userId).select("-password");
      next();
    } catch (error) {
      res.status(401);
      throw new Error("Not authorised,token failed");
    }
  } else {
    res.status(401);
    throw new Error("Not authorised, no token");
  }
});

export const authorizeAdmin = (req, res, next) => {
  if ((req.user && req.user.isAdmin)) {
    next();
  } else {
    res.status(401).send("Not authorised as an admin");
  }
};  
