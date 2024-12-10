import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config(); // Load environment variables

export const dbConnection = () => {
  const mongoURI = process.env.MONGO_URI;

  if (!mongoURI) {
    throw new Error('MongoDB connection string is not defined');
  }

  mongoose.connect(mongoURI, {
    dbName: 'MERN_STACK_HOSPITAL_MANAGEMENT_SYSTEM',
    // No need to include useNewUrlParser and useUnifiedTopology
  })
  .then(() => {
    console.log('Connected to database!');
  })
  .catch((err) => {
    console.log('Some error occurred while connecting to database:', err);
  });
};