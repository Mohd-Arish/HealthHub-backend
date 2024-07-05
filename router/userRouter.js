import express from 'express'
import { login, patientRegister, addnewAdmin, getAllDoctors, getUserdetails, Adminlogout, Patientlogout, addnewDoctor } from '../controller/userController.js'
import {isAdminAuthenticated, isPatientAuthenticated} from "../middlewares/auth.js"

const router= express.Router()

router.post("/patient/register", patientRegister)
router.post("/login", login)
router.post("/admin/addnew", isAdminAuthenticated, addnewAdmin)
router.get("/doctors", getAllDoctors)
router.get("/admin/me", isAdminAuthenticated, getUserdetails)
router.get("/patient/me", isPatientAuthenticated, getUserdetails)
router.get("/admin/logout", isAdminAuthenticated, Adminlogout)
router.get("/patient/logout", isPatientAuthenticated, Patientlogout)
router.post("/doctor/addnew", isAdminAuthenticated, addnewDoctor)

export default router


