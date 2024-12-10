import { catchAsyncErrors } from '../middlewares/catchAsyncErrors.js'
import { Message } from "../models/messageSchema.js";
import ErrorHandler from "../middlewares/errorMiddleware.js";


export const sendMessage = catchAsyncErrors(async (req, res, next) => {
  
    const { firstName, lastName, email, phone, message } = req.body;

    // Validate that all fields are provided
    if (!firstName || !lastName || !email || !phone || !message) {
      return next(new ErrorHandler("Please Fill Full Form!",400));}
    // Create a new message in the database
    await Message.create({ firstName, lastName, email, phone, message });

    // Send a success response
    res.status(200).json({
      success: true,
      message: "Message Send Successfully",
    });
});

