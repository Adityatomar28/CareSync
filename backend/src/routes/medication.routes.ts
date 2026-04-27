import { Router } from 'express';
import { createMedication, getMedications, deleteMedication } from '../controllers/medication.controller';
import { authenticateJWT } from '../middleware/auth.middleware';

const router = Router();

router.use(authenticateJWT);

router.post('/', createMedication);
router.get('/', getMedications);
router.delete('/:id', deleteMedication);

export default router;
