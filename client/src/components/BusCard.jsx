import { useNavigate } from 'react-router-dom';

export default function BusCard({ bus }) {
    const navigate = useNavigate();

    const available = bus.totalSeats - (bus.bookedSeats?.length || 0);
    const isLow = available <= 5;

    return (
        <div className="bus-card" onClick={() => navigate(`/buses/${bus._id}`)}>
            <div>
                {/* Route */}
                <div className="bus-route">
                    <div>
                        <div className="bus-city">{bus.from}</div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{bus.departureTime}</div>
                    </div>
                    <div className="bus-route-line" />
                    <div style={{ textAlign: 'right' }}>
                        <div className="bus-city">{bus.to}</div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{bus.arrivalTime}</div>
                    </div>
                </div>

                {/* Meta */}
                <div className="bus-meta">
                    <span className="bus-type-badge">{bus.busType}</span>
                    <span className="bus-meta-item">🕐 {bus.duration}</span>
                    <span className="bus-meta-item">🚌 {bus.busName}</span>
                    <span className="bus-meta-item">#{bus.busNumber}</span>
                    <span className="bus-rating">⭐ {bus.rating}</span>
                </div>

                {/* Amenities */}
                {bus.amenities?.length > 0 && (
                    <div className="bus-amenities">
                        {bus.amenities.map((a) => (
                            <span key={a} className="amenity-tag">{a}</span>
                        ))}
                    </div>
                )}
            </div>

            {/* Price */}
            <div className="bus-price-section">
                <div className="bus-price">
                    ₹{bus.pricePerSeat.toLocaleString()}
                    <span> /seat</span>
                </div>
                <div className="bus-seats-info" style={{ color: isLow ? 'var(--danger)' : 'var(--success)' }}>
                    {isLow ? '🔥 ' : '✅ '}{available} seats left
                </div>
                <button className="btn btn-primary btn-sm">View Seats →</button>
            </div>
        </div>
    );
}
