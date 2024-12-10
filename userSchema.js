import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// Define the user schema
const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, "First Name is required!"],
    minLength: [3, "First Name must contain at least 3 characters!"],
  },
  lastName: {
    type: String,
    required: [true, "Last Name is required!"],
    minLength: [3, "Last Name must contain at least 3 characters!"],
  },
  email: {
    type: String,
    required: [true, "Email is required!"],
    validate: [validator.isEmail, "Provide a valid email!"],
    unique: true,
  },
  phone: {
    type: String,
    required: [true, "Phone Number is required!"],
    minLength: [11, "Phone Number must contain exactly 11 digits!"],
    maxLength: [11, "Phone Number must contain exactly 11 digits!"],
  },
  nic: {
    type: String,
    required: [true, "NIC is required!"],
    minLength: [5, "NIC Number must contain exactly 5 digits!"],
    maxLength: [5, "NIC Number must contain exactly 5 digits!"],
  },
  dob: {
    type: Date,
    required: [true, "Date of Birth is required!"],
  },
  gender: {
    type: String,
    required: [true, "Gender is required!"],
    enum: ["Male", "Female"], // Gender options
  },
  password: {
    type: String,
    required: [true, "Password is required!"],
    minLength: [8, "Password must contain at least 8 characters!"],
    select: false, // Do not return the password in queries
  },
  role: {
    type: String,
    required: [true, "Role is required!"],
    enum: ["Admin", "Patient", "Doctor"], // Capitalized role options
    default: "Patient", // Default role
  },
  doctorDepartment: {
    type: String, // Optional for doctors
  },
  docAvatar: {
    public_id: String,
    url: String, // Avatar details (optional)
  },
});

// Pre-save hook to hash the password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Method to compare entered password with hashed password
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Method to generate a JSON Web Token (JWT)
userSchema.methods.generateJsonWebToken = function () {
  return jwt.sign(
    { id: this._id }, // Payload
    process.env.JWT_SECRET_KEY, // Secret key
    { expiresIn: process.env.JWT_EXPIRES } // Expiry time
  );
};

// Export the User model
export const User = mongoose.model("User", userSchema);
