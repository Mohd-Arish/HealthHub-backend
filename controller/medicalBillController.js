import { catchAsyncerrs } from "../middlewares/catchAsyncerrs.js";
import ErrorHandler from "../middlewares/errmidlw.js";
import { Appointment } from "../models/appointmentSchema.js";
import { MedicalBill } from "../models/medicalBillSchema.js";

export const generateMedicalBill = catchAsyncerrs(async (req, res, next) => {
    const { appointmentId, consultationFee, medicationCost, labTestsCost, additionalCharges } = req.body;

    if (!appointmentId || !consultationFee || !medicationCost || !labTestsCost || !additionalCharges) {
        return next(new ErrorHandler("Please provide all details!", 400));
    }

    // Find the appointment
    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
        return next(new ErrorHandler("Appointment not found!", 404));
    }

    // Calculate total cost
    const totalCost = consultationFee + medicationCost + labTestsCost + additionalCharges;

    // Create a new medical bill
    const medicalBill = await MedicalBill.create({
        appointmentId: appointment._id,
        patientId: appointment.patientId,
        doctorId: appointment.doctorId,
        consultationFee,
        medicationCost,
        labTestsCost,
        additionalCharges,
        totalCost,
        date: new Date()
    });

    if (!medicalBill) {
        return next(new ErrorHandler("Medical bill could not be created!", 500));
    }

 
    res.status(200).json({
        success: true,
        message: "Medical bill generated successfully!",
        medicalBill
    });
});


//work is going on