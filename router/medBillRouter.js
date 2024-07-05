import express from 'express';
import { generateMedicalBill } from '../controllers/medicalBillController.js';

const router = express.Router();

router.post('/generatebill', generateMedicalBill);

export default router;

//work is going on


