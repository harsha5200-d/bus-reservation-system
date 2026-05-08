import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function SearchForm({ initialValues = {} }) {
    const navigate = useNavigate();
    const [form, setForm] = useState({
        from: initialValues.from || '',
        to: initialValues.to || '',
        date: initialValues.date || '',
    });

    const handleChange = (e) => {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const params = new URLSearchParams(form).toString();
        navigate(`/buses?${params}`);
    };

    return (
        <form onSubmit={handleSubmit} className="search-card">
            <div className="search-grid">
                <div className="form-group">
                    <label className="form-label">From</label>
                    <input
                        type="text"
                        name="from"
                        className="form-input"
                        placeholder="e.g. Bangalore"
                        value={form.from}
                        onChange={handleChange}
                    />
                </div>
                <div className="form-group">
                    <label className="form-label">To</label>
                    <input
                        type="text"
                        name="to"
                        className="form-input"
                        placeholder="e.g. Mumbai"
                        value={form.to}
                        onChange={handleChange}
                    />
                </div>
                <div className="form-group">
                    <label className="form-label">Date</label>
                    <input
                        type="date"
                        name="date"
                        className="form-input"
                        value={form.date}
                        onChange={handleChange}
                        min={new Date().toISOString().split('T')[0]}
                    />
                </div>
                <button type="submit" className="btn btn-primary" style={{ height: '46px' }}>
                    🔍 Search
                </button>
            </div>
        </form>
    );
}
