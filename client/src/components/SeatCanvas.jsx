import { useRef, useState, useCallback } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, RoundedBox } from '@react-three/drei';
import * as THREE from 'three';

// ─── Individual Seat Mesh ──────────────────────────────────────────────────────
function Seat({ seatNumber, position, status, onSelect }) {
    const meshRef = useRef();
    const [hovered, setHovered] = useState(false);

    useFrame(() => {
        if (!meshRef.current) return;
        const targetY = hovered && status === 'available' ? 0.12 : 0;
        meshRef.current.position.y += (targetY - meshRef.current.position.y) * 0.15;
    });

    const color = {
        booked: '#ff4d6d',
        selected: '#6c63ff',
        available: hovered ? '#00e8a8' : '#00c896',
    }[status];

    const emissive = {
        booked: '#330010',
        selected: '#1a1760',
        available: hovered ? '#007a5a' : '#004d3a',
    }[status];

    return (
        <group position={position}>
            {/* Seat base */}
            <mesh
                ref={meshRef}
                onClick={() => status !== 'booked' && onSelect(seatNumber)}
                onPointerOver={() => status !== 'booked' && setHovered(true)}
                onPointerOut={() => setHovered(false)}
            >
                <boxGeometry args={[0.7, 0.12, 0.65]} />
                <meshStandardMaterial color={color} emissive={emissive} roughness={0.4} metalness={0.1} />
            </mesh>
            {/* Seat back */}
            <mesh position={[0, 0.38, -0.28]}>
                <boxGeometry args={[0.7, 0.65, 0.08]} />
                <meshStandardMaterial color={color} emissive={emissive} roughness={0.4} metalness={0.1} />
            </mesh>
            {/* Seat number label (floating above) */}
            <mesh position={[0, 0.25, 0.1]}>
                <planeGeometry args={[0.4, 0.2]} />
                <meshBasicMaterial transparent opacity={0} />
            </mesh>
        </group>
    );
}

// ─── Bus Body ──────────────────────────────────────────────────────────────────
function BusBody({ totalSeats, bookedSeats, selectedSeats, onSeatSelect }) {
    const COLS = 4; // 2 left + aisle + 2 right
    const rows = Math.ceil(totalSeats / COLS);

    const getSeatStatus = (num) => {
        if (bookedSeats.includes(num)) return 'booked';
        if (selectedSeats.includes(num)) return 'selected';
        return 'available';
    };

    const seats = [];
    let seatNum = 1;

    for (let row = 0; row < rows; row++) {
        const z = row * 1.1 - (rows * 1.1) / 2 + 0.55;

        // Left pair: cols 0 and 1
        for (let col = 0; col < 2; col++) {
            if (seatNum > totalSeats) break;
            const x = col === 0 ? -1.4 : -0.55;
            seats.push(
                <Seat
                    key={seatNum}
                    seatNumber={seatNum}
                    position={[x, 0.5, z]}
                    status={getSeatStatus(seatNum)}
                    onSelect={onSeatSelect}
                />
            );
            seatNum++;
        }

        // Right pair: cols 2 and 3
        for (let col = 0; col < 2; col++) {
            if (seatNum > totalSeats) break;
            const x = col === 0 ? 0.55 : 1.4;
            seats.push(
                <Seat
                    key={seatNum}
                    seatNumber={seatNum}
                    position={[x, 0.5, z]}
                    status={getSeatStatus(seatNum)}
                    onSelect={onSeatSelect}
                />
            );
            seatNum++;
        }
    }

    const busLength = rows * 1.1 + 2;

    return (
        <group>
            {/* Floor */}
            <mesh position={[0, 0.05, 0]}>
                <boxGeometry args={[4.2, 0.1, busLength]} />
                <meshStandardMaterial color="#1a1d26" roughness={0.8} />
            </mesh>

            {/* Ceiling */}
            <mesh position={[0, 2.0, 0]}>
                <boxGeometry args={[4.2, 0.08, busLength]} />
                <meshStandardMaterial color="#14161f" roughness={0.9} />
            </mesh>

            {/* Left wall */}
            <mesh position={[-2.1, 1.0, 0]}>
                <boxGeometry args={[0.08, 2.0, busLength]} />
                <meshStandardMaterial color="#12141c" roughness={0.9} />
            </mesh>

            {/* Right wall */}
            <mesh position={[2.1, 1.0, 0]}>
                <boxGeometry args={[0.08, 2.0, busLength]} />
                <meshStandardMaterial color="#12141c" roughness={0.9} />
            </mesh>

            {/* Aisle strip */}
            <mesh position={[0, 0.11, 0]}>
                <boxGeometry args={[0.8, 0.01, busLength]} />
                <meshStandardMaterial color="#22253a" roughness={0.9} />
            </mesh>

            {/* Overhead luggage strip - left */}
            <mesh position={[-1.7, 1.75, 0]}>
                <boxGeometry args={[0.55, 0.1, busLength - 0.4]} />
                <meshStandardMaterial color="#1e2130" roughness={0.8} />
            </mesh>

            {/* Overhead luggage strip - right */}
            <mesh position={[1.7, 1.75, 0]}>
                <boxGeometry args={[0.55, 0.1, busLength - 0.4]} />
                <meshStandardMaterial color="#1e2130" roughness={0.8} />
            </mesh>

            {/* Ambient interior light strips */}
            <mesh position={[-1.4, 1.9, 0]}>
                <boxGeometry args={[0.05, 0.06, busLength - 0.5]} />
                <meshStandardMaterial color="#6c63ff" emissive="#6c63ff" emissiveIntensity={1.5} />
            </mesh>
            <mesh position={[1.4, 1.9, 0]}>
                <boxGeometry args={[0.05, 0.06, busLength - 0.5]} />
                <meshStandardMaterial color="#6c63ff" emissive="#6c63ff" emissiveIntensity={1.5} />
            </mesh>

            {/* Seats */}
            {seats}
        </group>
    );
}

// ─── Scene ─────────────────────────────────────────────────────────────────────
function Scene({ totalSeats, bookedSeats, selectedSeats, onSeatSelect }) {
    return (
        <>
            <ambientLight intensity={0.6} />
            <directionalLight position={[5, 8, 5]} intensity={1.2} castShadow />
            <directionalLight position={[-5, 4, -5]} intensity={0.4} color="#8888ff" />
            <pointLight position={[0, 3, 0]} intensity={0.8} color="#6c63ff" />

            <BusBody
                totalSeats={totalSeats}
                bookedSeats={bookedSeats}
                selectedSeats={selectedSeats}
                onSeatSelect={onSeatSelect}
            />

            <OrbitControls
                enablePan={false}
                minDistance={4}
                maxDistance={18}
                minPolarAngle={Math.PI / 6}
                maxPolarAngle={Math.PI / 2}
            />
        </>
    );
}

// ─── Main Export ───────────────────────────────────────────────────────────────
export default function SeatCanvas({ totalSeats, bookedSeats, selectedSeats, onSeatSelect }) {
    return (
        <div style={{ height: '480px', width: '100%', cursor: 'grab' }}>
            <Canvas
                camera={{ position: [0, 6, 10], fov: 55 }}
                shadows
                style={{ background: 'transparent' }}
            >
                <Scene
                    totalSeats={totalSeats}
                    bookedSeats={bookedSeats}
                    selectedSeats={selectedSeats}
                    onSeatSelect={onSeatSelect}
                />
            </Canvas>
        </div>
    );
}
