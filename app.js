// ===== LaunchPad — 3D Interactive Landing Page =====

(function () {
    'use strict';

    // ===== Global State =====
    const mouse = { x: 0, y: 0, normX: 0, normY: 0 };
    let isMobile = window.innerWidth <= 768;

    // ===== Loader =====
    const loader = document.getElementById('loader');
    const loaderProgress = document.getElementById('loader-progress');
    let loadProgress = 0;

    function animateLoader() {
        loadProgress += Math.random() * 15 + 5;
        if (loadProgress > 100) loadProgress = 100;
        loaderProgress.style.width = loadProgress + '%';

        if (loadProgress < 100) {
            requestAnimationFrame(animateLoader);
        } else {
            setTimeout(() => {
                loader.classList.add('hidden');
                initAnimations();
            }, 400);
        }
    }

    // ===== Custom Cursor =====
    function initCursor() {
        if (isMobile) return;

        const cursor = document.getElementById('cursor');
        const follower = document.getElementById('cursor-follower');

        document.addEventListener('mousemove', (e) => {
            mouse.x = e.clientX;
            mouse.y = e.clientY;
            mouse.normX = (e.clientX / window.innerWidth) * 2 - 1;
            mouse.normY = -(e.clientY / window.innerHeight) * 2 + 1;

            cursor.style.transform = `translate(${e.clientX - 4}px, ${e.clientY - 4}px)`;
            follower.style.transform = `translate(${e.clientX - 18}px, ${e.clientY - 18}px)`;
        });

        // Hover effects on interactive elements
        const hoverElements = document.querySelectorAll('a, button, .feature-card, .testimonial-card, .pricing-card, .step');
        hoverElements.forEach(el => {
            el.addEventListener('mouseenter', () => follower.classList.add('hovering'));
            el.addEventListener('mouseleave', () => follower.classList.remove('hovering'));
        });
    }

    // ===== Navigation =====
    function initNav() {
        const nav = document.getElementById('nav');
        const toggle = document.getElementById('nav-toggle');
        const menu = document.getElementById('mobile-menu');

        window.addEventListener('scroll', () => {
            nav.classList.toggle('scrolled', window.scrollY > 50);
        });

        toggle.addEventListener('click', () => {
            menu.classList.toggle('open');
        });

        // Close mobile menu on link click
        document.querySelectorAll('.mobile-link').forEach(link => {
            link.addEventListener('click', () => menu.classList.remove('open'));
        });

        // Smooth scroll for anchor links
        document.querySelectorAll('a[href^="#"]').forEach(link => {
            link.addEventListener('click', (e) => {
                const target = document.querySelector(link.getAttribute('href'));
                if (target) {
                    e.preventDefault();
                    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            });
        });
    }

    // ===== Three.js — Hero Scene =====
    function initHeroScene() {
        const canvas = document.getElementById('hero-canvas');
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.z = 30;

        const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

        // Lights
        const ambientLight = new THREE.AmbientLight(0x667eea, 0.4);
        scene.add(ambientLight);

        const pointLight1 = new THREE.PointLight(0x667eea, 1.5, 50);
        pointLight1.position.set(10, 10, 10);
        scene.add(pointLight1);

        const pointLight2 = new THREE.PointLight(0x764ba2, 1.2, 50);
        pointLight2.position.set(-10, -5, 10);
        scene.add(pointLight2);

        const pointLight3 = new THREE.PointLight(0xf5576c, 0.8, 50);
        pointLight3.position.set(0, 10, -10);
        scene.add(pointLight3);

        // Materials
        const glassMaterial = new THREE.MeshPhysicalMaterial({
            color: 0x667eea,
            metalness: 0.1,
            roughness: 0.05,
            transparent: true,
            opacity: 0.6,
            side: THREE.DoubleSide,
        });

        const accentMaterial = new THREE.MeshPhysicalMaterial({
            color: 0x764ba2,
            metalness: 0.3,
            roughness: 0.1,
            transparent: true,
            opacity: 0.5,
        });

        const warmMaterial = new THREE.MeshPhysicalMaterial({
            color: 0xf5576c,
            metalness: 0.2,
            roughness: 0.1,
            transparent: true,
            opacity: 0.4,
        });

        const coolMaterial = new THREE.MeshPhysicalMaterial({
            color: 0x4facfe,
            metalness: 0.2,
            roughness: 0.15,
            transparent: true,
            opacity: 0.45,
        });

        const greenMaterial = new THREE.MeshPhysicalMaterial({
            color: 0x43e97b,
            metalness: 0.1,
            roughness: 0.2,
            transparent: true,
            opacity: 0.35,
        });

        // Geometries
        const shapes = [];
        const geometries = [
            new THREE.IcosahedronGeometry(2.5, 0),
            new THREE.OctahedronGeometry(2, 0),
            new THREE.TorusGeometry(1.8, 0.6, 16, 32),
            new THREE.TetrahedronGeometry(2, 0),
            new THREE.TorusKnotGeometry(1.2, 0.4, 64, 16),
            new THREE.DodecahedronGeometry(1.8, 0),
            new THREE.ConeGeometry(1.5, 3, 6),
            new THREE.BoxGeometry(2, 2, 2),
        ];

        const materials = [glassMaterial, accentMaterial, warmMaterial, coolMaterial, greenMaterial];

        for (let i = 0; i < 18; i++) {
            const geo = geometries[i % geometries.length];
            const mat = materials[i % materials.length].clone();
            const mesh = new THREE.Mesh(geo, mat);

            const radius = 8 + Math.random() * 16;
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.random() * Math.PI;

            mesh.position.set(
                radius * Math.sin(phi) * Math.cos(theta),
                radius * Math.sin(phi) * Math.sin(theta) - 2,
                radius * Math.cos(phi) - 10
            );

            mesh.rotation.set(
                Math.random() * Math.PI,
                Math.random() * Math.PI,
                Math.random() * Math.PI
            );

            const scale = 0.4 + Math.random() * 0.8;
            mesh.scale.set(scale, scale, scale);

            mesh.userData = {
                originalPos: mesh.position.clone(),
                rotSpeed: {
                    x: (Math.random() - 0.5) * 0.008,
                    y: (Math.random() - 0.5) * 0.008,
                    z: (Math.random() - 0.5) * 0.005,
                },
                floatSpeed: 0.3 + Math.random() * 0.5,
                floatAmplitude: 0.5 + Math.random() * 1.5,
                phase: Math.random() * Math.PI * 2,
            };

            scene.add(mesh);
            shapes.push(mesh);
        }

        // Particle field
        const particleCount = 200;
        const particleGeo = new THREE.BufferGeometry();
        const positions = new Float32Array(particleCount * 3);
        for (let i = 0; i < particleCount * 3; i++) {
            positions[i] = (Math.random() - 0.5) * 60;
        }
        particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        const particleMat = new THREE.PointsMaterial({
            color: 0x667eea,
            size: 0.08,
            transparent: true,
            opacity: 0.5,
        });
        const particles = new THREE.Points(particleGeo, particleMat);
        scene.add(particles);

        // Animation loop
        let time = 0;
        function animate() {
            requestAnimationFrame(animate);
            time += 0.01;

            shapes.forEach((shape) => {
                const ud = shape.userData;
                shape.rotation.x += ud.rotSpeed.x;
                shape.rotation.y += ud.rotSpeed.y;
                shape.rotation.z += ud.rotSpeed.z;

                shape.position.y = ud.originalPos.y + Math.sin(time * ud.floatSpeed + ud.phase) * ud.floatAmplitude;
                shape.position.x = ud.originalPos.x + Math.cos(time * ud.floatSpeed * 0.5 + ud.phase) * ud.floatAmplitude * 0.3;

                // Mouse interaction
                if (!isMobile) {
                    shape.position.x += mouse.normX * 1.5;
                    shape.position.y += mouse.normY * 1.0;
                }
            });

            particles.rotation.y += 0.0003;
            particles.rotation.x += 0.0001;

            renderer.render(scene, camera);
        }

        animate();

        // Resize handler
        window.addEventListener('resize', () => {
            isMobile = window.innerWidth <= 768;
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        });
    }

    // ===== Three.js — Feature Card 3D Scenes =====
    function initFeatureScenes() {
        createMiniScene('feature-3d-1', createRocketScene);
        createMiniScene('feature-3d-2', createToolkitScene);
    }

    function createMiniScene(containerId, sceneBuilder) {
        const container = document.getElementById(containerId);
        if (!container) return;

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(50, container.clientWidth / container.clientHeight, 0.1, 100);
        camera.position.z = 6;

        const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        renderer.setSize(container.clientWidth, container.clientHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        container.appendChild(renderer.domElement);

        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        scene.add(ambientLight);

        const pointLight = new THREE.PointLight(0x667eea, 2, 20);
        pointLight.position.set(3, 3, 5);
        scene.add(pointLight);

        const group = sceneBuilder(scene);

        let time = 0;
        function animate() {
            requestAnimationFrame(animate);
            time += 0.01;
            group.rotation.y += 0.005;
            group.position.y = Math.sin(time * 0.8) * 0.2;
            renderer.render(scene, camera);
        }
        animate();

        const observer = new ResizeObserver(() => {
            camera.aspect = container.clientWidth / container.clientHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(container.clientWidth, container.clientHeight);
        });
        observer.observe(container);
    }

    function createRocketScene(scene) {
        const group = new THREE.Group();

        // Abstract "rocket" from primitives
        const bodyMat = new THREE.MeshPhysicalMaterial({
            color: 0x667eea, metalness: 0.3, roughness: 0.1, transparent: true, opacity: 0.8
        });
        const body = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.7, 2.5, 8), bodyMat);
        group.add(body);

        const noseMat = new THREE.MeshPhysicalMaterial({
            color: 0x764ba2, metalness: 0.4, roughness: 0.1, transparent: true, opacity: 0.8
        });
        const nose = new THREE.Mesh(new THREE.ConeGeometry(0.5, 1, 8), noseMat);
        nose.position.y = 1.75;
        group.add(nose);

        const finMat = new THREE.MeshPhysicalMaterial({
            color: 0xf5576c, metalness: 0.3, roughness: 0.2, transparent: true, opacity: 0.7
        });

        for (let i = 0; i < 3; i++) {
            const fin = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.8, 0.08), finMat);
            fin.position.y = -1;
            fin.rotation.y = (i / 3) * Math.PI * 2;
            fin.position.x = Math.cos((i / 3) * Math.PI * 2) * 0.7;
            fin.position.z = Math.sin((i / 3) * Math.PI * 2) * 0.7;
            group.add(fin);
        }

        // Exhaust particles
        const exhaustGeo = new THREE.BufferGeometry();
        const exhaustPositions = new Float32Array(30 * 3);
        for (let i = 0; i < 30 * 3; i += 3) {
            exhaustPositions[i] = (Math.random() - 0.5) * 0.6;
            exhaustPositions[i + 1] = -1.5 - Math.random() * 1.5;
            exhaustPositions[i + 2] = (Math.random() - 0.5) * 0.6;
        }
        exhaustGeo.setAttribute('position', new THREE.BufferAttribute(exhaustPositions, 3));
        const exhaustMat = new THREE.PointsMaterial({ color: 0xf5576c, size: 0.1, transparent: true, opacity: 0.6 });
        const exhaust = new THREE.Points(exhaustGeo, exhaustMat);
        group.add(exhaust);

        // Orbiting rings
        const ringMat = new THREE.MeshPhysicalMaterial({
            color: 0x4facfe, metalness: 0.1, roughness: 0.3, transparent: true, opacity: 0.4, side: THREE.DoubleSide
        });
        const ring = new THREE.Mesh(new THREE.TorusGeometry(1.8, 0.04, 16, 64), ringMat);
        ring.rotation.x = Math.PI / 3;
        group.add(ring);

        group.rotation.x = -0.2;
        scene.add(group);
        return group;
    }

    function createToolkitScene(scene) {
        const group = new THREE.Group();

        // Central cube (represents platform)
        const cubeMat = new THREE.MeshPhysicalMaterial({
            color: 0xa18cd1, metalness: 0.2, roughness: 0.1, transparent: true, opacity: 0.7
        });
        const cube = new THREE.Mesh(new THREE.BoxGeometry(1.5, 1.5, 1.5), cubeMat);
        group.add(cube);

        // Orbiting tools
        const toolMats = [
            new THREE.MeshPhysicalMaterial({ color: 0x667eea, metalness: 0.3, roughness: 0.1, transparent: true, opacity: 0.8 }),
            new THREE.MeshPhysicalMaterial({ color: 0xf5576c, metalness: 0.3, roughness: 0.1, transparent: true, opacity: 0.7 }),
            new THREE.MeshPhysicalMaterial({ color: 0x43e97b, metalness: 0.3, roughness: 0.1, transparent: true, opacity: 0.7 }),
            new THREE.MeshPhysicalMaterial({ color: 0x4facfe, metalness: 0.3, roughness: 0.1, transparent: true, opacity: 0.7 }),
        ];

        const toolGeos = [
            new THREE.OctahedronGeometry(0.4),
            new THREE.TetrahedronGeometry(0.45),
            new THREE.IcosahedronGeometry(0.35),
            new THREE.DodecahedronGeometry(0.35),
        ];

        for (let i = 0; i < 4; i++) {
            const tool = new THREE.Mesh(toolGeos[i], toolMats[i]);
            const angle = (i / 4) * Math.PI * 2;
            tool.position.set(Math.cos(angle) * 2.2, Math.sin(angle) * 0.5, Math.sin(angle) * 2.2);
            group.add(tool);
        }

        // Connection lines (wireframe)
        const wireMat = new THREE.MeshBasicMaterial({ color: 0x667eea, transparent: true, opacity: 0.15, wireframe: true });
        const wireSphere = new THREE.Mesh(new THREE.SphereGeometry(2.5, 8, 8), wireMat);
        group.add(wireSphere);

        scene.add(group);
        return group;
    }

    // ===== Three.js — CTA Background =====
    function initCTAScene() {
        const canvas = document.getElementById('cta-canvas');
        if (!canvas) return;

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(60, canvas.clientWidth / canvas.clientHeight, 0.1, 100);
        camera.position.z = 10;

        const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
        renderer.setSize(canvas.clientWidth, canvas.clientHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

        // Floating particles
        const particleCount = 80;
        const geo = new THREE.BufferGeometry();
        const pos = new Float32Array(particleCount * 3);
        for (let i = 0; i < particleCount * 3; i++) {
            pos[i] = (Math.random() - 0.5) * 20;
        }
        geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
        const mat = new THREE.PointsMaterial({ color: 0xffffff, size: 0.12, transparent: true, opacity: 0.6 });
        const points = new THREE.Points(geo, mat);
        scene.add(points);

        // Floating shapes
        const shapes = [];
        for (let i = 0; i < 6; i++) {
            const shapeMat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.1, wireframe: true });
            const geos = [
                new THREE.IcosahedronGeometry(1, 0),
                new THREE.OctahedronGeometry(0.8, 0),
                new THREE.TetrahedronGeometry(0.9, 0),
            ];
            const mesh = new THREE.Mesh(geos[i % 3], shapeMat);
            mesh.position.set((Math.random() - 0.5) * 12, (Math.random() - 0.5) * 6, (Math.random() - 0.5) * 8);
            mesh.userData.rotSpeed = { x: (Math.random() - 0.5) * 0.01, y: (Math.random() - 0.5) * 0.01 };
            scene.add(mesh);
            shapes.push(mesh);
        }

        function animate() {
            requestAnimationFrame(animate);
            points.rotation.y += 0.001;
            shapes.forEach(s => {
                s.rotation.x += s.userData.rotSpeed.x;
                s.rotation.y += s.userData.rotSpeed.y;
            });
            renderer.render(scene, camera);
        }
        animate();

        const observer = new ResizeObserver(() => {
            camera.aspect = canvas.clientWidth / canvas.clientHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(canvas.clientWidth, canvas.clientHeight);
        });
        observer.observe(canvas.parentElement);
    }

    // ===== GSAP Animations =====
    function initAnimations() {
        gsap.registerPlugin(ScrollTrigger);

        // Animate elements on scroll
        document.querySelectorAll('[data-animate]').forEach((el) => {
            const delay = parseFloat(el.dataset.delay) || 0;

            gsap.to(el, {
                opacity: 1,
                y: 0,
                duration: 0.8,
                delay: delay,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: el,
                    start: 'top 85%',
                    once: true,
                },
            });
        });

        // Parallax on hero content
        gsap.to('.hero-content', {
            yPercent: 30,
            opacity: 0,
            ease: 'none',
            scrollTrigger: {
                trigger: '.hero',
                start: 'top top',
                end: 'bottom top',
                scrub: 1,
            },
        });

        // Stats counter animation
        const statNumbers = document.querySelectorAll('.stat-number[data-count]');
        statNumbers.forEach((el) => {
            const target = parseInt(el.dataset.count);
            ScrollTrigger.create({
                trigger: el,
                start: 'top 85%',
                once: true,
                onEnter: () => {
                    gsap.to({ val: 0 }, {
                        val: target,
                        duration: 2,
                        ease: 'power2.out',
                        onUpdate: function () {
                            el.textContent = Math.floor(this.targets()[0].val).toLocaleString();
                        },
                    });
                },
            });
        });

        // Feature cards stagger on hover — tilt effect
        document.querySelectorAll('.feature-card, .testimonial-card, .pricing-card, .step').forEach((card) => {
            card.addEventListener('mousemove', (e) => {
                if (isMobile) return;
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                const rotateX = (y - centerY) / centerY * -5;
                const rotateY = (x - centerX) / centerX * 5;

                gsap.to(card, {
                    rotateX: rotateX,
                    rotateY: rotateY,
                    transformPerspective: 800,
                    duration: 0.4,
                    ease: 'power2.out',
                });
            });

            card.addEventListener('mouseleave', () => {
                gsap.to(card, {
                    rotateX: 0,
                    rotateY: 0,
                    duration: 0.6,
                    ease: 'power2.out',
                });
            });
        });

        // Marquee speed-up on scroll
        gsap.to('.marquee-content', {
            scrollTrigger: {
                trigger: '.marquee-section',
                start: 'top bottom',
                end: 'bottom top',
                scrub: 1,
            },
            x: -100,
            ease: 'none',
        });

        // Section headers scale effect
        gsap.utils.toArray('.section-title').forEach((title) => {
            gsap.from(title, {
                scale: 0.9,
                scrollTrigger: {
                    trigger: title,
                    start: 'top 80%',
                    end: 'top 50%',
                    scrub: 1,
                },
            });
        });

        // Pricing cards stagger
        gsap.from('.pricing-card', {
            y: 60,
            opacity: 0,
            stagger: 0.15,
            duration: 0.8,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: '.pricing-grid',
                start: 'top 80%',
                once: true,
            },
        });
    }

    // ===== Magnetic Buttons =====
    function initMagneticButtons() {
        if (isMobile) return;

        document.querySelectorAll('.btn-primary, .btn-white').forEach((btn) => {
            btn.addEventListener('mousemove', (e) => {
                const rect = btn.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;

                gsap.to(btn, {
                    x: x * 0.2,
                    y: y * 0.2,
                    duration: 0.3,
                    ease: 'power2.out',
                });
            });

            btn.addEventListener('mouseleave', () => {
                gsap.to(btn, { x: 0, y: 0, duration: 0.5, ease: 'elastic.out(1, 0.5)' });
            });
        });
    }

    // ===== Smooth Reveal on Scroll — Navbar Background =====
    function initScrollEffects() {
        // Add gradient orbs that move on scroll
        const hero = document.querySelector('.hero');
        const orb1 = document.createElement('div');
        const orb2 = document.createElement('div');

        const orbStyle = `
            position: absolute;
            border-radius: 50%;
            filter: blur(80px);
            pointer-events: none;
            z-index: 0;
        `;

        orb1.style.cssText = orbStyle + `
            width: 500px; height: 500px;
            background: radial-gradient(circle, rgba(102,126,234,0.15), transparent);
            top: 10%; left: -10%;
        `;

        orb2.style.cssText = orbStyle + `
            width: 400px; height: 400px;
            background: radial-gradient(circle, rgba(245,87,108,0.1), transparent);
            bottom: 10%; right: -5%;
        `;

        hero.appendChild(orb1);
        hero.appendChild(orb2);

        // Parallax orbs on mouse move
        if (!isMobile) {
            document.addEventListener('mousemove', () => {
                gsap.to(orb1, {
                    x: mouse.normX * 30,
                    y: mouse.normY * -20,
                    duration: 1,
                    ease: 'power2.out',
                });
                gsap.to(orb2, {
                    x: mouse.normX * -20,
                    y: mouse.normY * 15,
                    duration: 1.2,
                    ease: 'power2.out',
                });
            });
        }
    }

    // ===== Initialize Everything =====
    function init() {
        initCursor();
        initNav();
        initHeroScene();
        initFeatureScenes();
        initCTAScene();
        initMagneticButtons();
        initScrollEffects();

        // Start loader animation
        animateLoader();
    }

    // Wait for DOM
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
