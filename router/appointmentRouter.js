import express from "express"
import { deleteAppointment, getAllAppointments, postAppointment, updateAppointmentstatus } from "../controller/appointmentController.js"
import { isAdminAuthenticated, isPatientAuthenticated } from "../middlewares/auth.js"

const router= express.Router()

router.post("/post", isPatientAuthenticated, postAppointment)
router.get("/getall", isAdminAuthenticated, getAllAppointments) //all appointments are looked/recieved by admin
router.put("/update/:id", isAdminAuthenticated, updateAppointmentstatus)
router.delete("/delete/:id", isAdminAuthenticated, deleteAppointment)

export default router 


// {
//     "firstName": "Lando",
//     "lastName": "Norris",
//     "email": "ln@gmail.com",
//     "phone": "9887654321",
//     "dob": "22/06/2001",
//     "gender": "Male",
//     "password": "76543222",
//     "role": "Patient"
//   }