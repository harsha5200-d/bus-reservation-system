const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const Bus = require('../models/Bus');
const { protect } = require('../middleware/auth');

// @POST /api/bookings  (create a booking)
router.post('/', protect, async (req, res) => {
    try {
        const { busId, seats, passengerDetails } = req.body;

        if (!busId || !seats || seats.length === 0)
            return res.status(400).json({ message: 'Bus ID and seats are required' });

        const bus = await Bus.findById(busId);
        if (!bus) return res.status(404).json({ message: 'Bus not found' });

        // Check for already-booked seats
        const conflict = seats.filter((s) => bus.bookedSeats.includes(s));
        if (conflict.length > 0)
            return res.status(400).json({ message: `Seats ${conflict.join(', ')} already booked` });

        // Mark seats as booked
        bus.bookedSeats.push(...seats);
        await bus.save();

        const totalPrice = seats.length * bus.pricePerSeat;

        const booking = await Booking.create({
            user: req.user.id,
            bus: busId,
            seats,
            totalPrice,
            passengerDetails,
        });

        const populated = await booking.populate('bus');
        res.status(201).json(populated);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// @GET /api/bookings/me  (user's bookings)
router.get('/me', protect, async (req, res) => {
    try {
        const bookings = await Booking.find({ user: req.user.id })
            .populate('bus')
            .sort({ createdAt: -1 });
        res.json(bookings);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// @GET /api/bookings/:id  (single booking detail)
router.get('/:id', protect, async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id).populate('bus');
        if (!booking) return res.status(404).json({ message: 'Booking not found' });
        if (booking.user.toString() !== req.user.id)
            return res.status(403).json({ message: 'Not authorized' });
        res.json(booking);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// @DELETE /api/bookings/:id  (cancel booking)
router.delete('/:id', protect, async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id);
        if (!booking) return res.status(404).json({ message: 'Booking not found' });
        if (booking.user.toString() !== req.user.id)
            return res.status(403).json({ message: 'Not authorized' });

        // Release seats
        const bus = await Bus.findById(booking.bus);
        if (bus) {
            bus.bookedSeats = bus.bookedSeats.filter((s) => !booking.seats.includes(s));
            await bus.save();
        }

        booking.status = 'cancelled';
        await booking.save();

        res.json({ message: 'Booking cancelled successfully', booking });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
