import { Router } from 'express';
import { createSymptom, getSymptoms } from '../controllers/symptom.controller';
import { authenticateJWT as authenticate } from '../middleware/auth.middleware';

const router = Router();

// Retrieve all symptoms for the authenticated user
router.get('/', authenticate as any, getSymptoms as any);

// Create a new symptom log for the authenticated user
router.post('/', authenticate as any, createSymptom as any);

export default router;
