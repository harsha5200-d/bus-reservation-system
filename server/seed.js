const mongoose = require('mongoose');
require('dotenv').config();

const Bus = require('./models/Bus');

const buses = [
    {
        busNumber: 'KA01AB1234',
        busName: 'Karnataka Express',
        busType: 'Volvo AC',
        from: 'Bangalore',
        to: 'Mumbai',
        date: '2026-03-01',
        departureTime: '06:00',
        arrivalTime: '22:00',
        duration: '16h 00m',
        totalSeats: 40,
        bookedSeats: [1, 5, 12, 20, 33],
        pricePerSeat: 1200,
        amenities: ['WiFi', 'Charging Point', 'Blanket', 'Water Bottle'],
        rating: 4.5,
    },
    {
        busNumber: 'MH02CD5678',
        busName: 'Deccan Queen',
        busType: 'AC Sleeper',
        from: 'Mumbai',
        to: 'Pune',
        date: '2026-03-01',
        departureTime: '08:30',
        arrivalTime: '12:00',
        duration: '3h 30m',
        totalSeats: 36,
        bookedSeats: [3, 7, 15],
        pricePerSeat: 450,
        amenities: ['Charging Point', 'Snacks'],
        rating: 4.2,
    },
    {
        busNumber: 'TN03EF9012',
        busName: 'Chennai Rider',
        busType: 'AC Seater',
        from: 'Chennai',
        to: 'Bangalore',
        date: '2026-03-01',
        departureTime: '07:00',
        arrivalTime: '13:00',
        duration: '6h 00m',
        totalSeats: 42,
        bookedSeats: [2, 4, 8, 16, 24],
        pricePerSeat: 650,
        amenities: ['WiFi', 'Charging Point'],
        rating: 4.0,
    },
    {
        busNumber: 'DL04GH3456',
        busName: 'Delhi Darpan',
        busType: 'Volvo AC',
        from: 'Delhi',
        to: 'Jaipur',
        date: '2026-03-01',
        departureTime: '05:30',
        arrivalTime: '11:00',
        duration: '5h 30m',
        totalSeats: 40,
        bookedSeats: [10, 11, 22],
        pricePerSeat: 700,
        amenities: ['WiFi', 'Blanket', 'Pillow', 'Water Bottle'],
        rating: 4.7,
    },
    {
        busNumber: 'GJ05IJ7890',
        busName: 'Gujarat Mail',
        busType: 'Non-AC Seater',
        from: 'Ahmedabad',
        to: 'Surat',
        date: '2026-03-01',
        departureTime: '09:00',
        arrivalTime: '13:00',
        duration: '4h 00m',
        totalSeats: 48,
        bookedSeats: [6, 18, 30, 42],
        pricePerSeat: 250,
        amenities: ['Charging Point'],
        rating: 3.8,
    },
    {
        busNumber: 'RJ06KL2345',
        busName: 'Rajputana Cruiser',
        busType: 'AC Sleeper',
        from: 'Jaipur',
        to: 'Delhi',
        date: '2026-03-02',
        departureTime: '22:00',
        arrivalTime: '04:30',
        duration: '6h 30m',
        totalSeats: 32,
        bookedSeats: [1, 3, 5, 9],
        pricePerSeat: 850,
        amenities: ['WiFi', 'Blanket', 'Pillow'],
        rating: 4.3,
    },
    {
        busNumber: 'AP07MN6789',
        busName: 'Andhra Traveller',
        busType: 'AC Seater',
        from: 'Hyderabad',
        to: 'Chennai',
        date: '2026-03-02',
        departureTime: '11:00',
        arrivalTime: '19:30',
        duration: '8h 30m',
        totalSeats: 44,
        bookedSeats: [2, 14, 26, 38],
        pricePerSeat: 900,
        amenities: ['WiFi', 'Charging Point', 'Snacks'],
        rating: 4.4,
    },
    {
        busNumber: 'KL08OP1234',
        busName: 'Kerala Highway Star',
        busType: 'Volvo AC',
        from: 'Kochi',
        to: 'Bangalore',
        date: '2026-03-02',
        departureTime: '20:00',
        arrivalTime: '08:00',
        duration: '12h 00m',
        totalSeats: 40,
        bookedSeats: [5, 7, 13, 19, 25, 31],
        pricePerSeat: 1100,
        amenities: ['WiFi', 'Charging Point', 'Blanket', 'Pillow', 'Water Bottle'],
        rating: 4.6,
    },
    {
        busNumber: 'UP09QR5678',
        busName: 'Uttar Pradesh Express',
        busType: 'Non-AC Sleeper',
        from: 'Lucknow',
        to: 'Delhi',
        date: '2026-03-02',
        departureTime: '23:00',
        arrivalTime: '07:00',
        duration: '8h 00m',
        totalSeats: 36,
        bookedSeats: [4, 8, 12],
        pricePerSeat: 500,
        amenities: ['Charging Point'],
        rating: 3.9,
    },
    {
        busNumber: 'WB10ST9012',
        busName: 'Kolkata Express',
        busType: 'AC Seater',
        from: 'Kolkata',
        to: 'Bhubaneswar',
        date: '2026-03-02',
        departureTime: '06:00',
        arrivalTime: '13:00',
        duration: '7h 00m',
        totalSeats: 42,
        bookedSeats: [1, 10, 20, 30],
        pricePerSeat: 750,
        amenities: ['WiFi', 'Charging Point', 'Water Bottle'],
        rating: 4.1,
    },
];

async function seed() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ MongoDB connected for seeding');

        await Bus.deleteMany({});
        console.log('🗑️  Cleared existing buses');

        const inserted = await Bus.insertMany(buses);
        console.log(`🌱 Seeded ${inserted.length} buses successfully`);

        await mongoose.disconnect();
        console.log('🔌 Disconnected');
        process.exit(0);
    } catch (err) {
        console.error('❌ Seed error:', err.message);
        process.exit(1);
    }
}

seed();
