import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
    const { user, logout, isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const isActive = (path) => location.pathname === path ? 'nav-link active' : 'nav-link';

    return (
        <nav className="navbar">
            <div className="container navbar-inner">
                <Link to="/" className="navbar-logo">
                    🚌 <span>BusGo</span>
                </Link>

                <div className="navbar-links">
                    <Link to="/" className={isActive('/')}>Home</Link>
                    {isAuthenticated && (
                        <>
                            <Link to="/buses" className={isActive('/buses')}>Search</Link>
                            <Link to="/bookings" className={isActive('/bookings')}>My Bookings</Link>
                        </>
                    )}
                </div>

                <div className="navbar-links">
                    {isAuthenticated ? (
                        <>
                            <div className="nav-user">
                                <div className="nav-user-avatar">
                                    {user?.name?.[0]?.toUpperCase() || 'U'}
                                </div>
                                <span>{user?.name?.split(' ')[0]}</span>
                            </div>
                            <button className="btn btn-secondary btn-sm" onClick={handleLogout}>
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="btn btn-secondary btn-sm">Login</Link>
                            <Link to="/register" className="btn btn-primary btn-sm">Register</Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
}
