const express = require('express');
const router = express.Router();
const Bus = require('../models/Bus');

// @GET /api/buses?from=X&to=Y&date=Z
router.get('/', async (req, res) => {
    try {
        const { from, to, date } = req.query;

        const filter = {};
        if (from) filter.from = { $regex: new RegExp(from, 'i') };
        if (to) filter.to = { $regex: new RegExp(to, 'i') };
        if (date) filter.date = date;

        const buses = await Bus.find(filter).sort({ departureTime: 1 });
        res.json(buses);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// @GET /api/buses/:id
router.get('/:id', async (req, res) => {
    try {
        const bus = await Bus.findById(req.params.id);
        if (!bus) return res.status(404).json({ message: 'Bus not found' });
        res.json(bus);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
