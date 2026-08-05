const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Get all patents
router.get('/', async (req, res) => {
    try {
        const patents = await prisma.patent.findMany({ include: { project: true } });
        res.json(patents);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// File a new patent associated with a project
router.post('/', async (req, res) => {
    try {
        const p = await prisma.patent.create({ data: req.body });
        res.status(201).json(p);
    } catch (e) {
        res.status(400).json({ error: e.message });
    }
});

module.exports = router;
