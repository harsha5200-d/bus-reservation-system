import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import SeatCanvas from '../components/SeatCanvas';
import { useAuth } from '../context/AuthContext';

export default function BusDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();

    const [bus, setBus] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedSeats, setSelectedSeats] = useState([]);
    const [passenger, setPassenger] = useState({ name: user?.name || '', email: '', phone: '' });
    const [booking, setBooking] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        api.get(`/buses/${id}`)
            .then(({ data }) => setBus(data))
            .catch(() => setError('Bus not found.'))
            .finally(() => setLoading(false));
    }, [id]);

    const handleSeatSelect = (seatNum) => {
        setSelectedSeats((prev) =>
            prev.includes(seatNum) ? prev.filter((s) => s !== seatNum) : [...prev, seatNum]
        );
    };

    const handleBook = async () => {
        if (selectedSeats.length === 0) { setError('Please select at least one seat.'); return; }
        if (!passenger.name || !passenger.phone) { setError('Please fill passenger name and phone.'); return; }
        setError('');
        setBooking(true);
        try {
            const { data } = await api.post('/bookings', {
                busId: id,
                seats: selectedSeats,
                passengerDetails: passenger,
            });
            navigate('/confirmation', { state: { booking: data } });
        } catch (err) {
            setError(err.response?.data?.message || 'Booking failed. Please try again.');
        } finally {
            setBooking(false);
        }
    };

    if (loading) return <div className="spinner-wrap"><div className="spinner" /></div>;
    if (!bus && error) return <div className="page container"><div className="error-msg">{error}</div></div>;

    const totalPrice = selectedSeats.length * (bus?.pricePerSeat || 0);

    return (
        <div className="page">
            <div className="container">
                {/* Bus title */}
                <div className="page-header">
                    <h1 className="page-title">{bus.busName}</h1>
                    <p className="page-subtitle">
                        {bus.from} → {bus.to} · {bus.date} · {bus.departureTime} – {bus.arrivalTime}
                    </p>
                </div>

                <div className="bus-detail-layout">
                    {/* 3D Seat Canvas */}
                    <div>
                        <div className="seat-canvas-wrapper">
                            <div className="canvas-label">🎮 Select Your Seats (3D View)</div>
                            <div className="seat-legend">
                                <div className="legend-item"><div className="legend-dot" style={{ background: '#00c896' }} />Available</div>
                                <div className="legend-item"><div className="legend-dot" style={{ background: '#ff4d6d' }} />Booked</div>
                                <div className="legend-item"><div className="legend-dot" style={{ background: '#6c63ff' }} />Selected</div>
                            </div>
                            <SeatCanvas
                                totalSeats={bus.totalSeats}
                                bookedSeats={bus.bookedSeats || []}
                                selectedSeats={selectedSeats}
                                onSeatSelect={handleSeatSelect}
                            />
                            <div style={{ padding: '12px 24px 20px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                                💡 Drag to rotate · Scroll to zoom · Click a seat to select
                            </div>
                        </div>
                    </div>

                    {/* Booking Sidebar */}
                    <div className="booking-sidebar">
                        <div className="booking-summary">
                            <h3>📋 Booking Summary</h3>

                            <div className="summary-row">
                                <span className="label">Bus</span>
                                <span className="value">{bus.busName}</span>
                            </div>
                            <div className="summary-row">
                                <span className="label">Route</span>
                                <span className="value">{bus.from} → {bus.to}</span>
                            </div>
                            <div className="summary-row">
                                <span className="label">Date</span>
                                <span className="value">{bus.date}</span>
                            </div>
                            <div className="summary-row">
                                <span className="label">Departure</span>
                                <span className="value">{bus.departureTime}</span>
                            </div>
                            <div className="summary-row">
                                <span className="label">Type</span>
                                <span className="value">{bus.busType}</span>
                            </div>
                            <div className="summary-row">
                                <span className="label">Price/seat</span>
                                <span className="value">₹{bus.pricePerSeat}</span>
                            </div>

                            <div style={{ margin: '16px 0 8px', fontWeight: 600, fontSize: '0.85rem' }}>
                                Selected Seats ({selectedSeats.length})
                            </div>
                            <div className="selected-seats-display">
                                {selectedSeats.length === 0
                                    ? <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>No seats selected</span>
                                    : selectedSeats.sort((a, b) => a - b).map((s) => (
                                        <span key={s} className="seat-chip">#{s}</span>
                                    ))
                                }
                            </div>

                            <div className="divider" />

                            <div className="summary-row summary-total">
                                <span className="label">Total</span>
                                <span className="value">₹{totalPrice.toLocaleString()}</span>
                            </div>
                        </div>

                        {/* Passenger Details */}
                        <div className="card" style={{ marginTop: 20 }}>
                            <h3 style={{ fontWeight: 700, marginBottom: 16, fontSize: '1rem' }}>Passenger Details</h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                                <div className="form-group">
                                    <label className="form-label">Name *</label>
                                    <input className="form-input" value={passenger.name} onChange={(e) => setPassenger(p => ({ ...p, name: e.target.value }))} placeholder="Full name" />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Email</label>
                                    <input className="form-input" type="email" value={passenger.email} onChange={(e) => setPassenger(p => ({ ...p, email: e.target.value }))} placeholder="Email (optional)" />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Phone *</label>
                                    <input className="form-input" type="tel" value={passenger.phone} onChange={(e) => setPassenger(p => ({ ...p, phone: e.target.value }))} placeholder="10-digit mobile" />
                                </div>
                            </div>
                        </div>

                        {error && <div className="error-msg" style={{ marginTop: 16 }}>{error}</div>}

                        <button
                            className="btn btn-primary btn-full"
                            style={{ marginTop: 16 }}
                            onClick={handleBook}
                            disabled={booking || selectedSeats.length === 0}
                        >
                            {booking ? 'Booking...' : `Book ${selectedSeats.length} Seat${selectedSeats.length !== 1 ? 's' : ''} · ₹${totalPrice.toLocaleString()}`}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
