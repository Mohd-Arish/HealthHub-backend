import {catchAsyncerrs} from "../middlewares/catchAsyncerrs.js"
import ErrorHandler from "../middlewares/errmidlw.js"
import { Appointment } from "../models/appointmentSchema.js"
import { User } from "../models/userSchema.js"

export const postAppointment= catchAsyncerrs(async (req, res, next)=>{
    const {firstName, lastName, email, phone, dob, gender, appointment_date, department, doctor_firstName, doctor_lastName, hasVisited, address} = req.body

    if(!firstName || !lastName || !email || !phone || !dob || !gender || !appointment_date || !department || !doctor_firstName || !doctor_lastName || !address){
        return next (new ErrorHandler("Please provide all details!", 400))
    }


    const isConflictdoc= await User.find({
        firstName: doctor_firstName,
        lastName:  doctor_lastName,
        role: "Doctor",  //for doctors having same name and same departments
        docDepartment: department 
    })


    if(isConflictdoc.length === 0){
        return next(new ErrorHandler("Doctor not found!", 404))
    }

    if(isConflictdoc.length > 1){
        return next(new ErrorHandler("Doctor Conflict found! Please contact through email or phone!", 404))
    }

    const doctorId= isConflictdoc[0]._id
    const patientId= req.user._id
    const appointment= await Appointment.create({
        firstName, lastName, email, phone, dob, gender, appointment_date, department, doctor:{
            firstName: doctor_firstName,
            lastName: doctor_lastName
        },  hasVisited, address, doctorId, patientId
    })

    res.status(200).json({
        success: true,
        message: "Appointment booked successfully!",
        appointment
    })
})

export const getAllAppointments= catchAsyncerrs(async (req, res, next)=>{
    const appointments= await Appointment.find()
    res.status(200).json({
        success: true,
        appointments //all appointments are looked/recieved by admin
    })
})

export const updateAppointmentstatus= catchAsyncerrs(async (req, res, next)=>{
    const { id }= req.params
    let appointment= await Appointment.findById(id)
    if(!appointment){
        return next(new ErrorHandler("Appointment Not Found!", 404))
    }

    appointment= await Appointment.findByIdAndUpdate(id, req.body, {
        new: true,
        runValidators: true,
        useFindandModify: false
    })
    res.status(200).json({
        success: true,
        message: "Appointment status updated!",
        appointment
    })
})

export const deleteAppointment= catchAsyncerrs(async (req, res, next)=>{
    const { id }= req.params
    let appointment= await Appointment.findById(id)
    if(!appointment){
        return next(new ErrorHandler("Appointment Not Found!", 404))
    }
    await appointment.deleteOne()
    res.status(200).json({
        success: true,
        message: "Appointment Deleted!"
    })
})