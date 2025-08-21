import express from 'express';
import { getAllFrauds, getFraudByUserId } from '../controllers/fraud.js';



const router = express.Router();

router.get('/', getAllFrauds)
router.get('/:userId', getFraudByUserId)

export default router