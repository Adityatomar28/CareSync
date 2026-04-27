import { Response } from 'express';
import prisma from '../prisma';
import { AuthRequest } from '../middleware/auth.middleware';

export const createAppointment = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const { doctorName, specialty, date, location, notes } = req.body;

    if (!doctorName || !date) {
      return res.status(400).json({ message: 'Doctor name and date are required.' });
    }

    const appointment = await prisma.appointment.create({
      data: {
        userId,
        doctorName,
        specialty,
        date: new Date(date),
        location,
        notes,
      },
    });

    res.status(201).json({ message: 'Appointment created successfully', appointment });
  } catch (error) {
    console.error('Error creating appointment:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getAppointments = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const appointments = await prisma.appointment.findMany({
      where: { userId },
      orderBy: { date: 'asc' },
    });

    res.status(200).json({ data: appointments });
  } catch (error) {
    console.error('Error fetching appointments:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const updateAppointmentStatus = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const id = req.params.id as string;
    const { status } = req.body; // e.g. "SCHEDULED", "COMPLETED", "CANCELLED"

    const appointment = await prisma.appointment.findUnique({ where: { id } });
    if (!appointment || appointment.userId !== userId) {
      return res.status(404).json({ message: 'Appointment not found or unauthorized' });
    }

    const updated = await prisma.appointment.update({
      where: { id },
      data: { status },
    });

    res.status(200).json({ message: 'Appointment updated successfully', appointment: updated });
  } catch (error) {
    console.error('Error updating appointment:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const deleteAppointment = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const id = req.params.id as string;

    const appointment = await prisma.appointment.findUnique({ where: { id } });
    if (!appointment || appointment.userId !== userId) {
      return res.status(404).json({ message: 'Appointment not found or unauthorized' });
    }

    await prisma.appointment.delete({ where: { id } });
    res.status(200).json({ message: 'Appointment deleted successfully' });
  } catch (error) {
    console.error('Error deleting appointment:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
