import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';

function BookingCard({ booking, onCancel }) {
    const bus = booking.bus;
    const [cancelling, setCancelling] = useState(false);

    const handleCancel = async () => {
        if (!window.confirm('Cancel this booking?')) return;
        setCancelling(true);
        try {
            await api.delete(`/bookings/${booking._id}`);
            onCancel(booking._id);
        } catch {
            alert('Failed to cancel booking.');
        } finally {
            setCancelling(false);
        }
    };

    return (
        <div className="booking-card">
            <div className="booking-card-header">
                <div>
                    <div className="booking-id">ID: {booking.bookingId}</div>
                    <div style={{ fontSize: '1.1rem', fontWeight: 700, marginTop: 6 }}>
                        {bus?.from} → {bus?.to}
                    </div>
                </div>
                <div className={`status-badge status-${booking.status}`}>{booking.status}</div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 12, marginBottom: 16 }}>
                {[
                    { label: 'Bus', value: bus?.busName },
                    { label: 'Date', value: bus?.date },
                    { label: 'Departure', value: bus?.departureTime },
                    { label: 'Seats', value: booking.seats?.join(', ') },
                    { label: 'Total Paid', value: `₹${booking.totalPrice?.toLocaleString()}` },
                    { label: 'Booked On', value: new Date(booking.createdAt).toLocaleDateString('en-IN') },
                ].map((row) => (
                    <div key={row.label}>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: 2 }}>{row.label}</div>
                        <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{row.value || '—'}</div>
                    </div>
                ))}
            </div>

            {booking.status === 'confirmed' && (
                <button
                    className="btn btn-danger btn-sm"
                    onClick={handleCancel}
                    disabled={cancelling}
                >
                    {cancelling ? 'Cancelling...' : 'Cancel Booking'}
                </button>
            )}
        </div>
    );
}

export default function BookingHistoryPage() {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        api.get('/bookings/me')
            .then(({ data }) => setBookings(data))
            .catch(() => setError('Failed to load bookings.'))
            .finally(() => setLoading(false));
    }, []);

    const handleCancel = (id) => {
        setBookings((prev) =>
            prev.map((b) => b._id === id ? { ...b, status: 'cancelled' } : b)
        );
    };

    return (
        <div className="page">
            <div className="container">
                <div className="page-header">
                    <h1 className="page-title">My Bookings</h1>
                    <p className="page-subtitle">Your complete travel history</p>
                </div>

                {loading && <div className="spinner-wrap"><div className="spinner" /></div>}
                {!loading && error && <div className="error-msg">{error}</div>}

                {!loading && !error && bookings.length === 0 && (
                    <div className="empty-state">
                        <div className="empty-state-icon">🎫</div>
                        <h3>No bookings yet</h3>
                        <p>Start your journey by booking your first bus ticket!</p>
                        <Link to="/" className="btn btn-primary">Search Buses</Link>
                    </div>
                )}

                {!loading && bookings.length > 0 && (
                    <div className="bookings-grid">
                        {bookings.map((booking) => (
                            <BookingCard key={booking._id} booking={booking} onCancel={handleCancel} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
