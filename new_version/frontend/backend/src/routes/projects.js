const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Get all projects
router.get('/', async (req, res) => {
    try {
        const projects = await prisma.project.findMany({ 
            include: { domain: true, lead: true, mentor: true } 
        });
        res.json(projects);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// Create new project
router.post('/', async (req, res) => {
    try {
        const project = await prisma.project.create({ data: req.body });
        res.status(201).json(project);
    } catch (e) {
        res.status(400).json({ error: e.message });
    }
});

// Get single project with details
router.get('/:id', async (req, res) => {
    try {
        const project = await prisma.project.findUnique({ 
            where: { id: req.params.id }, 
            include: { members: true, progressLogs: true, patents: true } 
        });
        if (!project) return res.status(404).json({ error: "Not found" });
        res.json(project);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

module.exports = router;
