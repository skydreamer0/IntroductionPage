/**
 * Three.js Particle Background
 * Creates an immersive, slowly animating particle field with
 * connecting lines for a premium tech-aesthetic feel.
 */
(function () {
    'use strict';

    const CONFIG = {
        particleCount: 120,
        particleSize: 2,
        lineDistance: 150,
        mouseInfluence: 80,
        colors: {
            particles: [0x60a5fa, 0x818cf8, 0x34d399, 0xa78bfa],
            lines: 0x60a5fa,
        },
        speed: 0.3,
    };

    let scene, camera, renderer, particles, lines;
    let mouseX = 0, mouseY = 0;
    let windowHalfX = window.innerWidth / 2;
    let windowHalfY = window.innerHeight / 2;
    let animationId;

    function init() {
        // Create canvas container
        const container = document.getElementById('three-bg');
        if (!container) return;

        // Scene
        scene = new THREE.Scene();

        // Camera
        camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            1,
            2000
        );
        camera.position.z = 500;

        // Renderer
        renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setClearColor(0x000000, 0);
        container.appendChild(renderer.domElement);

        // Particles
        createParticles();

        // Lines (connections between nearby particles)
        createLines();

        // Events
        document.addEventListener('mousemove', onMouseMove, false);
        window.addEventListener('resize', onWindowResize, false);

        // Start animation
        animate();
    }

    function createParticles() {
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(CONFIG.particleCount * 3);
        const colors = new Float32Array(CONFIG.particleCount * 3);
        const velocities = [];

        for (let i = 0; i < CONFIG.particleCount; i++) {
            const i3 = i * 3;
            positions[i3] = (Math.random() - 0.5) * 1000;
            positions[i3 + 1] = (Math.random() - 0.5) * 1000;
            positions[i3 + 2] = (Math.random() - 0.5) * 600;

            // Random color from palette
            const colorHex = CONFIG.colors.particles[
                Math.floor(Math.random() * CONFIG.colors.particles.length)
            ];
            const color = new THREE.Color(colorHex);
            colors[i3] = color.r;
            colors[i3 + 1] = color.g;
            colors[i3 + 2] = color.b;

            velocities.push({
                x: (Math.random() - 0.5) * CONFIG.speed,
                y: (Math.random() - 0.5) * CONFIG.speed,
                z: (Math.random() - 0.5) * CONFIG.speed * 0.5,
            });
        }

        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

        const material = new THREE.PointsMaterial({
            size: CONFIG.particleSize,
            vertexColors: true,
            transparent: true,
            opacity: 0.8,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
        });

        particles = new THREE.Points(geometry, material);
        particles.userData.velocities = velocities;
        scene.add(particles);
    }

    function createLines() {
        const geometry = new THREE.BufferGeometry();
        // Maximum possible lines: each pair of particles
        const maxLines = CONFIG.particleCount * CONFIG.particleCount;
        const positions = new Float32Array(maxLines * 6);
        const colors = new Float32Array(maxLines * 6);

        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        geometry.setDrawRange(0, 0);

        const material = new THREE.LineBasicMaterial({
            vertexColors: true,
            transparent: true,
            opacity: 0.4,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
        });

        lines = new THREE.LineSegments(geometry, material);
        scene.add(lines);
    }

    function updateLines() {
        const particlePositions = particles.geometry.attributes.position.array;
        const linePositions = lines.geometry.attributes.position.array;
        const lineColors = lines.geometry.attributes.color.array;
        let vertexCount = 0;

        const lineColor = new THREE.Color(CONFIG.colors.lines);

        for (let i = 0; i < CONFIG.particleCount; i++) {
            for (let j = i + 1; j < CONFIG.particleCount; j++) {
                const i3 = i * 3;
                const j3 = j * 3;

                const dx = particlePositions[i3] - particlePositions[j3];
                const dy = particlePositions[i3 + 1] - particlePositions[j3 + 1];
                const dz = particlePositions[i3 + 2] - particlePositions[j3 + 2];
                const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

                if (dist < CONFIG.lineDistance) {
                    const alpha = 1 - dist / CONFIG.lineDistance;
                    const v = vertexCount * 6;

                    linePositions[v] = particlePositions[i3];
                    linePositions[v + 1] = particlePositions[i3 + 1];
                    linePositions[v + 2] = particlePositions[i3 + 2];
                    linePositions[v + 3] = particlePositions[j3];
                    linePositions[v + 4] = particlePositions[j3 + 1];
                    linePositions[v + 5] = particlePositions[j3 + 2];

                    lineColors[v] = lineColor.r * alpha;
                    lineColors[v + 1] = lineColor.g * alpha;
                    lineColors[v + 2] = lineColor.b * alpha;
                    lineColors[v + 3] = lineColor.r * alpha;
                    lineColors[v + 4] = lineColor.g * alpha;
                    lineColors[v + 5] = lineColor.b * alpha;

                    vertexCount++;
                }
            }
        }

        lines.geometry.setDrawRange(0, vertexCount * 2);
        lines.geometry.attributes.position.needsUpdate = true;
        lines.geometry.attributes.color.needsUpdate = true;
    }

    function animate() {
        animationId = requestAnimationFrame(animate);

        const positions = particles.geometry.attributes.position.array;
        const velocities = particles.userData.velocities;

        for (let i = 0; i < CONFIG.particleCount; i++) {
            const i3 = i * 3;
            positions[i3] += velocities[i].x;
            positions[i3 + 1] += velocities[i].y;
            positions[i3 + 2] += velocities[i].z;

            // Boundary wrapping
            if (positions[i3] > 500) positions[i3] = -500;
            if (positions[i3] < -500) positions[i3] = 500;
            if (positions[i3 + 1] > 500) positions[i3 + 1] = -500;
            if (positions[i3 + 1] < -500) positions[i3 + 1] = 500;
            if (positions[i3 + 2] > 300) positions[i3 + 2] = -300;
            if (positions[i3 + 2] < -300) positions[i3 + 2] = 300;
        }

        particles.geometry.attributes.position.needsUpdate = true;

        // Update connecting lines
        updateLines();

        // Subtle camera movement following mouse
        camera.position.x += (mouseX * 0.5 - camera.position.x) * 0.02;
        camera.position.y += (-mouseY * 0.5 - camera.position.y) * 0.02;
        camera.lookAt(scene.position);

        renderer.render(scene, camera);
    }

    function onMouseMove(event) {
        mouseX = event.clientX - windowHalfX;
        mouseY = event.clientY - windowHalfY;
    }

    function onWindowResize() {
        windowHalfX = window.innerWidth / 2;
        windowHalfY = window.innerHeight / 2;
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }

    // Initialize on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
