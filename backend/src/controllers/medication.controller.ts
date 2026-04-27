import { Response } from 'express';
import prisma from '../prisma';
import { AuthRequest } from '../middleware/auth.middleware';

export const createMedication = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const { name, dosage, frequency, startDate, endDate, notes } = req.body;

    if (!name || !dosage || !frequency || !startDate) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const medication = await prisma.medication.create({
      data: {
        userId,
        name,
        dosage,
        frequency,
        startDate: new Date(startDate),
        endDate: endDate ? new Date(endDate) : null,
        notes,
      },
    });

    res.status(201).json({ message: 'Medication added successfully', medication });
  } catch (error) {
    console.error('Error creating medication:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getMedications = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const medications = await prisma.medication.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    res.status(200).json({ data: medications });
  } catch (error) {
    console.error('Error fetching medications:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const deleteMedication = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const id = req.params.id as string;

    // Check ownership
    const medication = await prisma.medication.findUnique({ where: { id } });
    if (!medication || medication.userId !== userId) {
      return res.status(404).json({ message: 'Medication not found or unauthorized' });
    }

    await prisma.medication.delete({ where: { id } });
    res.status(200).json({ message: 'Medication deleted successfully' });
  } catch (error) {
    console.error('Error deleting medication:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
