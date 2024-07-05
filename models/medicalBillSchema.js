import mongoose from 'mongoose';

const medicalBillSchema = new mongoose.Schema({
    appointmentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Appointment',
        required: true
    },
    patientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    doctorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    consultationFee: {
        type: Number,
        required: true
    },
    medicationCost: {
        type: Number,
        required: true
    },
    labTestsCost: {
        type: Number,
        required: true
    },
    additionalCharges: {
        type: Number,
        required: true
    },
    totalCost: {
        type: Number,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
});

export const MedicalBill = mongoose.model('MedicalBill', medicalBillSchema);
