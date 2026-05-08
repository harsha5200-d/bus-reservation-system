import { Link } from 'react-router-dom';
import SunsetScene from '../components/SunsetScene';

export default function HomePage() {
    return (
        <div>
            {/* ── Immersive Fullscreen 3D Sunset Bus Scene ── */}
            <section style={{
                position: 'relative',
                width: '100%',
                height: '100vh',
                overflow: 'hidden',
                backgroundColor: '#0a0515' // dark fallback while loading
            }}>
                <SunsetScene />

                {/* Dark gradient overlay so text is readable */}
                <div style={{
                    position: 'absolute', inset: 0,
                    background: 'linear-gradient(to bottom, rgba(0,0,0,0.15) 0%, rgba(10,5,30,0.6) 100%)',
                    pointerEvents: 'none',
                    zIndex: 1
                }} />

                {/* Content overlay */}
                <div style={{
                    position: 'absolute', inset: 0,
                    display: 'flex', flexDirection: 'column',
                    alignItems: 'center', justifyContent: 'center',
                    padding: '0 24px', zIndex: 10,
                }}>
                    <h1 style={{
                        fontSize: 'clamp(2.5rem, 6vw, 5.5rem)',
                        fontWeight: 900, lineHeight: 1.1,
                        letterSpacing: '-2px', textAlign: 'center',
                        marginBottom: 16, color: '#fff',
                        textShadow: '0 4px 32px rgba(0,0,0,0.8)',
                    }}>
                        Book Your Bus Ticket <br />
                        <span style={{
                            background: 'linear-gradient(135deg, #ffb347, #ff6e00)',
                            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                        }}>
                            In Seconds
                        </span>
                    </h1>

                    <p style={{
                        color: 'rgba(255,240,200,0.9)', fontSize: '1.2rem',
                        maxWidth: 600, textAlign: 'center',
                        marginBottom: 44, lineHeight: 1.6,
                        textShadow: '0 2px 16px rgba(0,0,0,0.6)',
                        fontWeight: 500
                    }}>
                        Watch the sunset on your way to the destination. Book instantly.
                    </p>

                    {/* Action button to go to buses page */}
                    <Link to="/buses" style={{
                        padding: '16px 40px',
                        background: 'linear-gradient(135deg, #ffb347, #ff6e00)',
                        color: '#fff',
                        borderRadius: 99,
                        fontSize: '1.2rem',
                        fontWeight: 700,
                        textDecoration: 'none',
                        boxShadow: '0 8px 24px rgba(255,110,0,0.4)',
                        transition: 'transform 0.2s',
                    }} onMouseOver={e => e.currentTarget.style.transform = 'scale(1.05)'} onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}>
                        View Routes
                    </Link>
                </div>
            </section>
        </div>
    );
}
