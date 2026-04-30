import express from 'express';
import multer from 'multer';
import { uploadReport, getReports, deleteReport } from '../controllers/report.controller';
import { authenticateJWT } from '../middleware/auth.middleware';

const router = express.Router();

const upload = multer({ dest: 'uploads/' });

router.post('/', authenticateJWT, upload.single('file'), uploadReport);
router.get('/', authenticateJWT, getReports);
router.delete('/:id', authenticateJWT, deleteReport);

export default router;