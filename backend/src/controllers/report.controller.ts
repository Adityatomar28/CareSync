import { Response } from 'express';
import prisma from '../prisma';
import { AuthRequest } from "../middleware/auth.middleware";
import fs from 'fs';

export const uploadReport = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const file = req.file;
        const { notes } = req.body;
        console.log('--- UPLOAD DEBUG ---');
        console.log('req.body:', req.body);
        console.log('req.file present:', !!file);

        if (!file) {
            return res.status(400).json({ message: "No file uploaded" });
        }

        const report = await prisma.report.create({
            data: {
                userId,
                fileName: file.originalname,
                fileUrl: file.path,
                fileType: file.mimetype,
                notes: notes || null,
            },
        });

        return res.status(201).json({
            message: "Report uploaded successfully",
            report,
        });

    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const getReports = async (req: AuthRequest, res: Response) => {
    const userId = req.user?.id;

    if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    const reports = await prisma.report.findMany({
        where: { userId },
        orderBy: { uploadedAt: 'desc' },
    });

    return res.json(reports);
};

export const deleteReport = async (req: AuthRequest, res: Response) => {
    const id = req.params.id as string;
    const userId = req.user?.id;

    const report = await prisma.report.findUnique({
        where: { id },
    });

    if (!report || report.userId !== userId) {
        return res.status(403).json({ message: "Unauthorized" });
    }

    // Delete the file from the filesystem
    if (report.fileUrl) {
        fs.unlink(report.fileUrl, (err) => {
            if (err) console.error("Failed to delete file from filesystem:", err);
        });
    }

    await prisma.report.delete({
        where: { id },
    });

    return res.json({ message: "Deleted successfully" });
};