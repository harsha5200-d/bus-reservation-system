const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        bus: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Bus',
            required: true,
        },
        seats: {
            type: [Number],
            required: true,
        },
        totalPrice: {
            type: Number,
            required: true,
        },
        passengerDetails: {
            name: String,
            email: String,
            phone: String,
        },
        status: {
            type: String,
            enum: ['confirmed', 'cancelled', 'pending'],
            default: 'confirmed',
        },
        bookingId: {
            type: String,
            unique: true,
        },
    },
    { timestamps: true }
);

// Generate a readable booking ID before saving
bookingSchema.pre('save', function (next) {
    if (!this.bookingId) {
        this.bookingId = 'BUS' + Date.now().toString(36).toUpperCase() + Math.random().toString(36).substr(2, 4).toUpperCase();
    }
    next();
});

module.exports = mongoose.model('Booking', bookingSchema);
