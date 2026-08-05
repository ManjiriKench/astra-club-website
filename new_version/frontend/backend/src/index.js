const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');
require('dotenv').config();

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors()); // Allow frontend to make requests
app.use(express.json()); // Parse JSON bodies

// Basic Health Check Route
app.get('/api/health', (req, res) => {
    res.status(200).json({ status: 'OK', message: 'A.S.T.R.A CRM Backend is running.' });
});

// Example API Route - Get all domains
app.get('/api/domains', async (req, res) => {
    try {
        const domains = await prisma.domain.findMany();
        res.json(domains);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch domains' });
    }
});

// Example API Route - Get all members
app.get('/api/members', async (req, res) => {
    try {
        const members = await prisma.member.findMany({
            include: {
                role: true,
                primaryDomain: true,
            }
        });
        res.json(members);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch members' });
    }
});

// API Route - Get all events
app.get('/api/events', async (req, res) => {
    try {
        const events = await prisma.event.findMany({
            orderBy: { eventDate: 'desc' }
        });
        res.json(events);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch events' });
    }
});

// Mount CRM Routers
app.use('/api/projects', require('./routes/projects'));
app.use('/api/proposals', require('./routes/proposals'));
app.use('/api/patents', require('./routes/patents'));

// Start Server
app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});

// Graceful shutdown for Prisma
process.on('beforeExit', async () => {
  await prisma.$disconnect()
})
