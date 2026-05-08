import { useLocation, Link, Navigate } from 'react-router-dom';

export default function ConfirmationPage() {
    const { state } = useLocation();
    const booking = state?.booking;

    if (!booking) return <Navigate to="/" replace />;

    const bus = booking.bus;

    return (
        <div className="page">
            <div className="container">
                <div className="confirmation-page">
                    <div className="confirmation-icon">✅</div>

                    <h1 style={{ fontSize: '2rem', fontWeight: 900, letterSpacing: '-0.5px', marginBottom: 8 }}>
                        Booking Confirmed!
                    </h1>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: 0 }}>
                        Your seats have been reserved successfully.
                    </p>

                    {/* Ticket */}
                    <div className="ticket-card">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
                            <div>
                                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: 4, letterSpacing: '1px', fontWeight: 600 }}>BOOKING ID</div>
                                <div style={{ fontWeight: 800, fontSize: '1.1rem', letterSpacing: '1px', color: 'var(--accent)' }}>
                                    {booking.bookingId}
                                </div>
                            </div>
                            <div className="status-badge status-confirmed">{booking.status}</div>
                        </div>

                        {/* Route */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '20px 0', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', marginBottom: 24 }}>
                            <div>
                                <div style={{ fontSize: '2rem', fontWeight: 900, letterSpacing: '-1px' }}>{bus?.from}</div>
                                <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{bus?.departureTime}</div>
                            </div>
                            <div style={{ flex: 1, textAlign: 'center' }}>
                                <div style={{ fontSize: '1.5rem' }}>🚌</div>
                                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{bus?.duration}</div>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                                <div style={{ fontSize: '2rem', fontWeight: 900, letterSpacing: '-1px' }}>{bus?.to}</div>
                                <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{bus?.arrivalTime}</div>
                            </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                            {[
                                { label: 'Bus Name', value: bus?.busName },
                                { label: 'Bus Type', value: bus?.busType },
                                { label: 'Date', value: bus?.date },
                                { label: 'Seats', value: booking.seats?.join(', ') },
                                { label: 'Passengers', value: booking.passengerDetails?.name },
                                { label: 'Phone', value: booking.passengerDetails?.phone },
                            ].map(({ label, value }) => (
                                <div key={label}>
                                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: 3, fontWeight: 600, letterSpacing: '0.5px' }}>
                                        {label.toUpperCase()}
                                    </div>
                                    <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{value || '—'}</div>
                                </div>
                            ))}
                        </div>

                        <div className="divider" />

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div style={{ color: 'var(--text-secondary)' }}>Total Amount Paid</div>
                            <div style={{ fontSize: '1.6rem', fontWeight: 900, color: 'var(--success)', letterSpacing: '-0.5px' }}>
                                ₹{booking.totalPrice?.toLocaleString()}
                            </div>
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: 16, justifyContent: 'center' }}>
                        <Link to="/bookings" className="btn btn-secondary">View All Bookings</Link>
                        <Link to="/" className="btn btn-primary">Book Another</Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
