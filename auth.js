import { User } from "../models/userSchema.js";
import { catchAsyncErrors } from "./catchAsyncErrors.js";
import ErrorHandler from "./errorMiddleware.js";
import jwt from "jsonwebtoken";

// Middleware to authenticate dashboard users
export const isAdminAuthenticated = catchAsyncErrors(
  async (req, res, next) => {
    const token = await req.cookies.adminToken;
    console.log("token",token)
    console.log("mid")
    if (!token) {
      return next(
        new ErrorHandler("Admin not authenticated!", 400)
      );
    }
    const decoded = await jwt.verify(token, process.env.JWT_SECRET_KEY);
    console.log("2as")
    console.log(decoded)
    req.user = await User.findById(decoded.id);
    if (req.user.role !== "Admin") {
      return next(
        new ErrorHandler(`${req.user.role} not authorized for this resource!`, 403)
      );
    }
    next();
  }
);

export const isPatientAuthenticated = catchAsyncErrors(
    async (req, res, next) => {
      const token = await req.cookies.patientToken;
      if (!token) {
        return next(
          new ErrorHandler("Patient not authenticated!", 400)
        );
      }
      const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
      req.user = await User.findById(decoded.id);
      if (req.user.role !== "Patient") {
        return next(
          new ErrorHandler(`${req.user.role} not authorized for this resource!`, 403)
        );
      }
      next();
    }
  );
  export const isAuthorized = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorHandler(
          `${req.user.role} not allowed to access this resource!`
        )
      );
    }
    next();
  };
};