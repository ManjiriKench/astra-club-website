const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Get all proposals
router.get('/', async (req, res) => {
    try {
        const proposals = await prisma.proposal.findMany({ include: { domain: true } });
        res.json(proposals);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// Submit a new proposal
router.post('/', async (req, res) => {
    try {
        const p = await prisma.proposal.create({ data: req.body });
        res.status(201).json(p);
    } catch (e) {
        res.status(400).json({ error: e.message });
    }
});

// Approve or reject proposal
router.patch('/:id/status', async (req, res) => {
    try {
        const { status } = req.body;
        const p = await prisma.proposal.update({ 
            where: { id: req.params.id }, 
            data: { status } 
        });
        res.json(p);
    } catch (e) {
        res.status(400).json({ error: e.message });
    }
});

module.exports = router;
