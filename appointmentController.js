import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/errorMiddleware.js";
import { User } from "../models/userSchema.js";
import { Appointment } from "../models/appointmentsSchema.js";

// Handle appointment creation
export const postAppointment = catchAsyncErrors(async (req, res, next) => {
  const {
    firstName,
    lastName,
    email,
    phone,
    nic,
    dob,
    gender,
    appointment_date,
    department,
    doctorFirstName, // Updated variable name
    doctorLastName,  // Updated variable name
    hasVisited,
    address,
  } = req.body;

  // Validate required fields
  if (
    !firstName ||
    !lastName ||
    !email ||
    !phone ||
    !nic ||
    !dob ||
    !gender ||
    !appointment_date ||
    !department ||
    !doctorFirstName ||  // Updated variable name
    !doctorLastName ||   // Updated variable name
    !address
  ) {
    return next(new ErrorHandler("Please fill out all required fields.", 400));
  }

  // Validate the appointment date to ensure it's in the future
  const appointmentDate = new Date(appointment_date);
  if (appointmentDate < new Date()) {
    return next(new ErrorHandler("Appointment date must be in the future.", 400));
  }

  // Fetch matching doctors based on first name, last name, and department
  const isConflict = await User.find({
    firstName: doctorFirstName, // Updated variable name
    lastName: doctorLastName,   // Updated variable name
    department,
    role: "Doctor", // Assuming 'role' field identifies doctors
  });

  // Handle doctor not found
  // if (!isConflict || isConflict.length === 0) {
  //   return next(new ErrorHandler("Doctor not found. Please check details.", 404));
  // }

  // Handle multiple doctor conflicts
  if (isConflict.length > 1) {
    return next(
      new ErrorHandler(
        "Doctor conflict detected! Please contact support for resolution.",
        400
      )
    );
  }

  // const doctorId = isConflict[0]._id; // Extract the single doctor's ID
  const patientId = req.user._id; // Assuming `req.user` contains authenticated user details

  // Create the appointment
  const appointment = await Appointment.create({
    firstName,
    lastName,
    email,
    phone,
    nic,
    dob,
    gender,
    appointment_date,
    department,
    doctor: {
      firstName: doctorFirstName, // Updated variable name
      lastName: doctorLastName,   // Updated variable name
    },
    hasVisited,
    address,
    doctorId :"66d555074c0efa6c2305b6bf",
    patientId,
  });

  res.status(200).json({
    success: true,
    appointment,
    message: "Appointment successfully created!",
  });
});


// Get all appointments
export const getAllAppointments = catchAsyncErrors(async (req, res, next) => {
  const appointments = await Appointment.find();
  res.status(200).json({
    success: true,
    appointments,
  });
});

// Update appointment status
export const updateAppointmentStatus = catchAsyncErrors(
  async (req, res, next) => {
    const { id } = req.params;
    let appointment = await Appointment.findById(id);
    if (!appointment) {
      return next(new ErrorHandler("Appointment not found!", 404));
    }

    appointment = await Appointment.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    });

    res.status(200).json({
      success: true,
      message: "Appointment Status Updated!",
      appointment,
    });
  }
);

// Delete appointment
export const deleteAppointment = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  const appointment = await Appointment.findById(id);
  if (!appointment) {
    return next(new ErrorHandler("Appointment Not Found!", 404));
  }

  await appointment.deleteOne();
  res.status(200).json({
    success: true,
    message: "Appointment Deleted!",
  });
});
