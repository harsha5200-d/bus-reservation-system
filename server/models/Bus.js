const mongoose = require('mongoose');

const busSchema = new mongoose.Schema(
    {
        busNumber: { type: String, required: true, unique: true },
        busName: { type: String, required: true },
        busType: {
            type: String,
            enum: ['AC Sleeper', 'AC Seater', 'Non-AC Sleeper', 'Non-AC Seater', 'Volvo AC'],
            default: 'AC Seater',
        },
        from: { type: String, required: true },
        to: { type: String, required: true },
        date: { type: String, required: true }, // "YYYY-MM-DD"
        departureTime: { type: String, required: true },
        arrivalTime: { type: String, required: true },
        duration: { type: String, required: true },
        totalSeats: { type: Number, required: true, default: 40 },
        bookedSeats: { type: [Number], default: [] },
        pricePerSeat: { type: Number, required: true },
        amenities: { type: [String], default: [] },
        rating: { type: Number, default: 4.0, min: 1, max: 5 },
    },
    { timestamps: true }
);

// Virtual: available seats count
busSchema.virtual('availableSeats').get(function () {
    return this.totalSeats - this.bookedSeats.length;
});

busSchema.set('toJSON', { virtuals: true });
busSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Bus', busSchema);
