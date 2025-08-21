import express from 'express'
import healthRouter from './health.js'
import fraudRouter from './fraud.js'

const router = express.Router();

router.use('/health', healthRouter)
router.use('/fraud', fraudRouter)

export default router;