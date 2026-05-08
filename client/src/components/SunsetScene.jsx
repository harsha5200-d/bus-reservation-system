import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function SunsetScene() {
    const mountRef = useRef(null);

    useEffect(() => {
        const mount = mountRef.current;
        if (!mount) return;

        const W = mount.clientWidth;
        const H = mount.clientHeight;

        // ─── Renderer ───────────────────────────────────────────────────
        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(W, H);
        renderer.shadowMap.enabled = true;
        mount.appendChild(renderer.domElement);

        // ─── Scene & Camera ─────────────────────────────────────────────
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(60, W / H, 0.1, 1000);
        camera.position.set(0, 4, 18);
        camera.lookAt(0, 2, 0);

        // ─── Gradient Sky Background ────────────────────────────────────
        const skyGeo = new THREE.SphereGeometry(200, 32, 16);
        const skyMat = new THREE.ShaderMaterial({
            uniforms: {
                topColor: { value: new THREE.Color(0x1a0030) }, // deep purple top
                midColor: { value: new THREE.Color(0xff6a29) }, // orange mid
                botColor: { value: new THREE.Color(0xffe066) }, // warm yellow bottom
            },
            vertexShader: `
                varying vec3 vWorldPosition;
                void main() {
                    vWorldPosition = (modelMatrix * vec4(position, 1.0)).xyz;
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
            `,
            fragmentShader: `
                uniform vec3 topColor;
                uniform vec3 midColor;
                uniform vec3 botColor;
                varying vec3 vWorldPosition;
                void main() {
                    float h = normalize(vWorldPosition).y;
                    vec3 col;
                    if (h > 0.0) {
                        col = mix(midColor, topColor, min(h * 2.2, 1.0));
                    } else {
                        col = mix(midColor, botColor, min(-h * 4.0, 1.0));
                    }
                    gl_FragColor = vec4(col, 1.0);
                }
            `,
            side: THREE.BackSide,
        });
        const sky = new THREE.Mesh(skyGeo, skyMat);
        scene.add(sky);

        // ─── Sun Disc ────────────────────────────────────────────────────
        const sunGeo = new THREE.CircleGeometry(3.2, 64);
        const sunMat = new THREE.MeshBasicMaterial({ color: 0xffcc44 });
        const sun = new THREE.Mesh(sunGeo, sunMat);
        sun.position.set(0, 6, -60);
        scene.add(sun);

        // Sun glow ring 1
        const glow1 = new THREE.Mesh(
            new THREE.CircleGeometry(4.5, 64),
            new THREE.MeshBasicMaterial({ color: 0xff8833, transparent: true, opacity: 0.35 })
        );
        glow1.position.set(0, 6, -60.1);
        scene.add(glow1);

        // Sun glow ring 2
        const glow2 = new THREE.Mesh(
            new THREE.CircleGeometry(7, 64),
            new THREE.MeshBasicMaterial({ color: 0xff5500, transparent: true, opacity: 0.15 })
        );
        glow2.position.set(0, 6, -60.2);
        scene.add(glow2);

        // ─── Road ────────────────────────────────────────────────────────
        const roadGeo = new THREE.PlaneGeometry(14, 300);
        const roadMat = new THREE.MeshLambertMaterial({ color: 0x222226 });
        const road = new THREE.Mesh(roadGeo, roadMat);
        road.rotation.x = -Math.PI / 2;
        road.position.set(0, 0, 0);
        road.receiveShadow = true;
        scene.add(road);

        // Road lane dashes
        for (let i = -150; i < 150; i += 6) {
            const dashGeo = new THREE.PlaneGeometry(0.22, 3);
            const dashMat = new THREE.MeshBasicMaterial({ color: 0xffdd44 });
            const dash = new THREE.Mesh(dashGeo, dashMat);
            dash.rotation.x = -Math.PI / 2;
            dash.position.set(0, 0.01, i);
            scene.add(dash);
        }

        // Road edges (white lines)
        [5.5, -5.5].forEach(x => {
            const edgeGeo = new THREE.PlaneGeometry(0.18, 300);
            const edgeMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
            const edge = new THREE.Mesh(edgeGeo, edgeMat);
            edge.rotation.x = -Math.PI / 2;
            edge.position.set(x, 0.01, 0);
            scene.add(edge);
        });

        // ─── Ground (grass) ──────────────────────────────────────────────
        const groundGeo = new THREE.PlaneGeometry(400, 400);
        const groundMat = new THREE.MeshLambertMaterial({ color: 0x3a6b1a });
        const ground = new THREE.Mesh(groundGeo, groundMat);
        ground.rotation.x = -Math.PI / 2;
        ground.position.y = -0.03;
        ground.receiveShadow = true;
        scene.add(ground);

        // ─── Trees ──────────────────────────────────────────────────────
        function makeTree(x, z, h = 5, leafColor = 0xe8841a) {
            const trunk = new THREE.Mesh(
                new THREE.CylinderGeometry(0.25, 0.35, h * 0.38, 7),
                new THREE.MeshLambertMaterial({ color: 0x5c3a1e })
            );
            trunk.position.set(x, h * 0.19, z);
            trunk.castShadow = true;
            scene.add(trunk);

            // layered foliage for autumn look
            const layers = [
                { r: 1.8, y: h * 0.35, c: leafColor },
                { r: 2.4, y: h * 0.55, c: leafColor === 0xe8841a ? 0xd4600a : 0xd45a00 },
                { r: 1.6, y: h * 0.78, c: 0xf0a030 },
            ];
            layers.forEach(l => {
                const cone = new THREE.Mesh(
                    new THREE.ConeGeometry(l.r, h * 0.45, 7),
                    new THREE.MeshLambertMaterial({ color: l.c })
                );
                cone.position.set(x, l.y, z);
                cone.castShadow = true;
                scene.add(cone);
            });
        }

        // Trees both sides of road
        for (let z = -80; z < 80; z += 9) {
            const offset = (Math.random() - 0.5) * 3;
            const h = 6 + Math.random() * 4;
            const c = [0xe8841a, 0xd4600a, 0xf0a030, 0xcc4a00, 0xe86010][Math.floor(Math.random() * 5)];
            makeTree(10 + offset, z + (Math.random() - 0.5) * 4, h, c);
            makeTree(-10 + offset, z + (Math.random() - 0.5) * 4, h, c);
        }

        // ─── Lights ──────────────────────────────────────────────────────
        scene.add(new THREE.AmbientLight(0xffd6a0, 0.65));
        const sunLight = new THREE.DirectionalLight(0xff9944, 1.1);
        sunLight.position.set(-5, 10, -20);
        sunLight.castShadow = true;
        scene.add(sunLight);

        // ─── Luxury 3D Bus ──────────────────────────────────────────────
        const busGroup = new THREE.Group();

        // Chassis/Body (facing +Z, so length is along Z)
        const bodyGeo = new THREE.BoxGeometry(3.6, 4.2, 11);
        const bodyMat = new THREE.MeshStandardMaterial({
            color: 0x08080a, metalness: 0.85, roughness: 0.25
        });
        const body = new THREE.Mesh(bodyGeo, bodyMat);
        body.position.y = 2.6;
        body.castShadow = true;
        busGroup.add(body);

        // Front Windshield
        const glassMat = new THREE.MeshStandardMaterial({
            color: 0x020202, metalness: 0.95, roughness: 0.05
        });
        const windshield = new THREE.Mesh(new THREE.PlaneGeometry(3.4, 2.0), glassMat);
        windshield.position.set(0, 3.4, 5.51); // Front face is at +5.5 Z
        busGroup.add(windshield);

        // Side Windows
        const sideWinGeo = new THREE.PlaneGeometry(10, 1.6);
        const leftWin = new THREE.Mesh(sideWinGeo, glassMat);
        leftWin.rotation.y = -Math.PI / 2;
        leftWin.position.set(-1.81, 3.2, 0);
        const rightWin = new THREE.Mesh(sideWinGeo, glassMat);
        rightWin.rotation.y = Math.PI / 2;
        rightWin.position.set(1.81, 3.2, 0);
        busGroup.add(leftWin, rightWin);

        // Headlights (Glowing)
        const hlGeo = new THREE.BoxGeometry(0.8, 0.35, 0.1);
        const hlMat = new THREE.MeshStandardMaterial({
            color: 0xffffff, emissive: 0xffddaa, emissiveIntensity: 4
        });
        const hlRight = new THREE.Mesh(hlGeo, hlMat);
        hlRight.position.set(1.2, 1.2, 5.51);
        const hlLeft = new THREE.Mesh(hlGeo, hlMat);
        hlLeft.position.set(-1.2, 1.2, 5.51);
        busGroup.add(hlRight, hlLeft);

        // Grill/Logo area
        const grill = new THREE.Mesh(
            new THREE.BoxGeometry(1.8, 1.0, 0.1),
            new THREE.MeshStandardMaterial({ color: 0x111111, metalness: 0.9 })
        );
        grill.position.set(0, 1.4, 5.51);
        busGroup.add(grill);

        // Wheels
        const wheelGeo = new THREE.CylinderGeometry(0.65, 0.65, 0.5, 16);
        wheelGeo.rotateZ(Math.PI / 2);
        const wheelMat = new THREE.MeshStandardMaterial({ color: 0x020202, roughness: 0.9 });
        const wheelPositions = [
            [-1.9, 0.65, 3.5], [1.9, 0.65, 3.5],   // Front
            [-1.9, 0.65, -3.5], [1.9, 0.65, -3.5]  // Back
        ];
        wheelPositions.forEach(pos => {
            const wheel = new THREE.Mesh(wheelGeo, wheelMat);
            wheel.position.set(...pos);
            busGroup.add(wheel);
        });

        // Add spot lights mimicking headlights projecting forward
        const rightBeam = new THREE.SpotLight(0xffddaa, 3, 100, Math.PI / 6, 0.5, 1);
        rightBeam.position.set(1.2, 1.2, 5.5);
        rightBeam.target.position.set(1.2, 0, 40);
        const leftBeam = new THREE.SpotLight(0xffddaa, 3, 100, Math.PI / 6, 0.5, 1);
        leftBeam.position.set(-1.2, 1.2, 5.5);
        leftBeam.target.position.set(-1.2, 0, 40);
        busGroup.add(rightBeam, rightBeam.target, leftBeam, leftBeam.target);

        scene.add(busGroup);

        // ─── Fireflies / Particles ───────────────────────────────────────
        const particleCount = 120;
        const positions = new Float32Array(particleCount * 3);
        for (let i = 0; i < particleCount; i++) {
            positions[i * 3] = (Math.random() - 0.5) * 80;
            positions[i * 3 + 1] = Math.random() * 12 + 0.5;
            positions[i * 3 + 2] = (Math.random() - 0.5) * 80;
        }
        const particleGeo = new THREE.BufferGeometry();
        particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        const particleMat = new THREE.PointsMaterial({
            color: 0xffee88,
            size: 0.18,
            transparent: true,
            opacity: 0.75,
        });
        scene.add(new THREE.Points(particleGeo, particleMat));

        // ─── Resize ──────────────────────────────────────────────────────
        const onResize = () => {
            const w = mount.clientWidth;
            const h = mount.clientHeight;
            camera.aspect = w / h;
            camera.updateProjectionMatrix();
            renderer.setSize(w, h);
        };
        window.addEventListener('resize', onResize);

        // ─── Animation Loop ───────────────────────────────────────────────
        let frameId;
        const clock = new THREE.Clock();

        const animate = () => {
            frameId = requestAnimationFrame(animate);
            const t = clock.getElapsedTime();

            // Move bus: comes from the horizon (-Z) towards camera (+Z)
            const busSpeed = 22;
            // Loop from Z = -130 (far away) to Z = 30 (past camera)
            const currentZ = -130 + ((t * busSpeed) % 160);
            busGroup.position.z = currentZ;

            // Slight hover/bump effect on bus to simulate driving
            busGroup.position.y = Math.sin(t * 20) * 0.03;

            // Gentle camera sway
            camera.position.x = Math.sin(t * 0.06) * 1.5;
            camera.lookAt(0, 2, 0);

            // Slowly pulse sun glow
            const pulse = 0.12 + 0.08 * Math.sin(t * 0.9);
            glow1.material.opacity = pulse + 0.25;
            glow2.material.opacity = pulse * 0.5;

            // Drift particles
            const pos = particleGeo.attributes.position.array;
            for (let i = 0; i < particleCount; i++) {
                pos[i * 3 + 1] += 0.004;
                if (pos[i * 3 + 1] > 13) pos[i * 3 + 1] = 0.5;
            }
            particleGeo.attributes.position.needsUpdate = true;

            renderer.render(scene, camera);
        };
        animate();

        return () => {
            cancelAnimationFrame(frameId);
            window.removeEventListener('resize', onResize);
            mount.removeChild(renderer.domElement);
            renderer.dispose();
        };
    }, []);

    return (
        <div ref={mountRef} style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
        }} />
    );
}
