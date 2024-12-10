import express from "express";
import { addNewAdmin,getAllDoctors,getUserDetails,login,patientRegister,logoutAdmin ,addDoctor} from "../controller/userController.js";
import { isAdminAuthenticated,isPatientAuthenticated } from "../middlewares/auth.js";

const router = express.Router();

// Route to handle patient registration
router.post("/patient/register", patientRegister);
router.post("/login", login);
router.post("/admin/addnew",addNewAdmin);
router.post("/doctor/addnew",addDoctor)
router.get("/doctors",getAllDoctors);
router.get("/admin/me",isAdminAuthenticated,getUserDetails);
router.get("/patient/me",isPatientAuthenticated,getUserDetails);
router.get("/patient/me",isPatientAuthenticated,getUserDetails);
router.get("/admin/logout",isAdminAuthenticated,logoutAdmin);



export default router;
