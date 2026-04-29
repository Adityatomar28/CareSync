import { Response } from 'express';
import prisma  from '../prisma';
import { AuthRequest } from '../middleware/auth.middleware';

export const createSymptom = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id; // Assumes your auth middleware attaches the user object to req

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const {
      symptomName,
      severity,
      notes,
      duration,
      temperature,
      medicationTaken,
    } = req.body;

    if (!symptomName || severity === undefined) {
      return res.status(400).json({ message: 'Symptom name and severity are required.' });
    }

    if (severity < 1 || severity > 10) {
      return res.status(400).json({ message: 'Severity must be between 1 and 10.' });
    }

    const symptomLog = await prisma.symptomLog.create({
      data: {
        userId,
        symptomName,
        severity,
        notes,
        duration,
        temperature,
        medicationTaken,
      },
    });

    const io = req.app.get('io');
    if (io) {
      io.to(`room_${userId}`).emit('symptom_created', symptomLog);
    }

    res.status(201).json({
      message: 'Symptom log created successfully',
      symptomLog,
    });
  } catch (error) {
    console.error('Error creating symptom log:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getSymptoms = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    // Pagination parameters from query string
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    // Fetch both paginated results and the total count in parallel
    const [symptoms, total] = await Promise.all([
      prisma.symptomLog.findMany({
        where: { userId },
        orderBy: { timestamp: 'desc' },
        skip,
        take: limit,
      }),
      prisma.symptomLog.count({ where: { userId } }),
    ]);

    // Return structured response with metadata
    res.status(200).json({
      data: symptoms,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching symptoms:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
