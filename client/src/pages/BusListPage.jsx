import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import api from '../api/axios';
import BusCard from '../components/BusCard';
import SearchForm from '../components/SearchForm';

export default function BusListPage() {
    const [searchParams] = useSearchParams();
    const [buses, setBuses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const from = searchParams.get('from') || '';
    const to = searchParams.get('to') || '';
    const date = searchParams.get('date') || '';

    useEffect(() => {
        const fetchBuses = async () => {
            setLoading(true);
            setError('');
            try {
                const params = {};
                if (from) params.from = from;
                if (to) params.to = to;
                if (date) params.date = date;

                const { data } = await api.get('/buses', { params });
                setBuses(data);
            } catch (err) {
                setError('Failed to fetch buses. Please try again.');
            } finally {
                setLoading(false);
            }
        };
        fetchBuses();
    }, [from, to, date]);

    return (
        <div className="page">
            <div className="container">
                <div style={{ marginBottom: 32 }}>
                    <SearchForm initialValues={{ from, to, date }} />
                </div>

                <div className="page-header">
                    <h1 className="page-title">
                        {from && to ? `${from} → ${to}` : 'Available Buses'}
                    </h1>
                    <p className="page-subtitle">
                        {date ? `Date: ${date} · ` : ''}{loading ? '...' : `${buses.length} buses found`}
                    </p>
                </div>

                {loading && (
                    <div className="spinner-wrap">
                        <div className="spinner" />
                    </div>
                )}

                {!loading && error && (
                    <div className="error-msg" style={{ marginBottom: 24 }}>{error}</div>
                )}

                {!loading && !error && buses.length === 0 && (
                    <div className="empty-state">
                        <div className="empty-state-icon">🔍</div>
                        <h3>No buses found</h3>
                        <p>Try different search criteria or dates.</p>
                        <Link to="/" className="btn btn-primary">Search Again</Link>
                    </div>
                )}

                {!loading && !error && buses.length > 0 && (
                    <div className="bus-grid">
                        {buses.map((bus) => (
                            <BusCard key={bus._id} bus={bus} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
