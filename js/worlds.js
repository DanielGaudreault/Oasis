function loadSocialHub(scene, camera) {
    // Clear existing scene objects
    while(scene.children.length > 0) { 
        scene.remove(scene.children[0]); 
    }
    
    // Add environment lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 0.5);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);
    
    // Add hemisphere light for natural outdoor feel
    const hemisphereLight = new THREE.HemisphereLight(0xffffbb, 0x080820, 0.5);
    scene.add(hemisphereLight);
    
    // Create social hub environment - futuristic plaza
    const groundGeometry = new THREE.CircleGeometry(30, 64);
    const groundMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x225522,
        metalness: 0.1,
        roughness: 0.8
    });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    scene.add(ground);
    
    // Add central fountain with particle effects
    createFountain(scene, 0, 0, 0);
    
    // Add holographic billboards
    createHolographicBillboard(scene, -10, 0, -15, "WELCOME TO OASIS", 0xff00ff);
    createHolographicBillboard(scene, 10, 0, -15, "PLAYER SCORES", 0x00ffff);
    
    // Add interactive NPC avatars
    createNPC(scene, -5, 0, 5, "Warrior");
    createNPC(scene, 5, 0, 5, "Mage");
    createNPC(scene, 0, 0, -5, "Rogue");
    
    // Add seating areas with interactive spots
    createInteractiveSeatingArea(scene, -15, 0, -10, "Chat Lounge");
    createInteractiveSeatingArea(scene, 15, 0, -10, "Game Room");
    createInteractiveSeatingArea(scene, 0, 0, 15, "Trading Post");
    
    // Add portal to other worlds
    createPortal(scene, 0, 0, -20, "Arcade");
    createPortal(scene, -20, 0, 0, "Race Track");
    
    // Position camera for overview
    camera.position.set(0, 15, 30);
    camera.lookAt(0, 0, 0);
    
    // Add player avatar to the scene
    if (playerAvatar) {
        playerAvatar.group.position.set(0, 0, 10);
        playerAvatar.group.rotation.y = Math.PI;
    }
    
    // Return interaction points
    return {
        npcs: [
            { position: new THREE.Vector3(-5, 0, 5), name: "Warrior" },
            { position: new THREE.Vector3(5, 0, 5), name: "Mage" },
            { position: new THREE.Vector3(0, 0, -5), name: "Rogue" }
        ],
        seatingAreas: [
            { position: new THREE.Vector3(-15, 0, -10), name: "Chat Lounge" },
            { position: new THREE.Vector3(15, 0, -10), name: "Game Room" },
            { position: new THREE.Vector3(0, 0, 15), name: "Trading Post" }
        ],
        portals: [
            { position: new THREE.Vector3(0, 0, -20), destination: "arcade" },
            { position: new THREE.Vector3(-20, 0, 0), destination: "race" }
        ]
    };
}

function createFountain(scene, x, y, z) {
    const group = new THREE.Group();
    group.position.set(x, y, z);
    
    // Base
    const baseGeometry = new THREE.CylinderGeometry(3, 4, 0.5, 32);
    const baseMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x777777,
        metalness: 0.8,
        roughness: 0.2
    });
    const base = new THREE.Mesh(baseGeometry, baseMaterial);
    group.add(base);
    
    // Middle
    const middleGeometry = new THREE.CylinderGeometry(2, 3, 1, 32);
    const middle = new THREE.Mesh(middleGeometry, baseMaterial);
    middle.position.y = 0.75;
    group.add(middle);
    
    // Top
    const topGeometry = new THREE.CylinderGeometry(1, 2, 1, 32);
    const top = new THREE.Mesh(topGeometry, baseMaterial);
    top.position.y = 1.75;
    group.add(top);
    
    // Water
    const waterGeometry = new THREE.CylinderGeometry(0.8, 0.8, 0.2, 32);
    const waterMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x00aaff,
        transparent: true,
        opacity: 0.8,
        metalness: 0.9,
        roughness: 0.1
    });
    const water = new THREE.Mesh(waterGeometry, waterMaterial);
    water.position.y = 2.0;
    group.add(water);
    
    // Particle system for fountain effect
    const particleCount = 100;
    const particles = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);
    
    for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        positions[i3] = (Math.random() - 0.5) * 2;
        positions[i3 + 1] = 2.2 + Math.random() * 1.5;
        positions[i3 + 2] = (Math.random() - 0.5) * 2;
        
        sizes[i] = 0.1 + Math.random() * 0.1;
    }
    
    particles.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particles.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
    
    const particleMaterial = new THREE.PointsMaterial({
        color: 0x00aaff,
        size: 0.1,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending
    });
    
    const particleSystem = new THREE.Points(particles, particleMaterial);
    group.add(particleSystem);
    
    // Animation for particles
    function animateParticles() {
        const positions = particles.attributes.position.array;
        
        for (let i = 0; i < particleCount; i++) {
            const i3 = i * 3;
            
            positions[i3 + 1] -= 0.02;
            
            if (positions[i3 + 1] < 2.0) {
                positions[i3] = (Math.random() - 0.5) * 2;
                positions[i3 + 1] = 2.2 + Math.random() * 0.3;
                positions[i3 + 2] = (Math.random() - 0.5) * 2;
            }
        }
        
        particles.attributes.position.needsUpdate = true;
    }
    
    group.userData.update = animateParticles;
    scene.add(group);
    return group;
}

function createHolographicBillboard(scene, x, y, z, text, color) {
    const group = new THREE.Group();
    group.position.set(x, y, z);
    
    // Billboard stand
    const standGeometry = new THREE.BoxGeometry(0.2, 3, 0.2);
    const standMaterial = new THREE.MeshStandardMaterial({ 
        color: 0xaaaaaa,
        metalness: 0.8,
        roughness: 0.2
    });
    const stand = new THREE.Mesh(standGeometry, standMaterial);
    stand.position.y = 1.5;
    group.add(stand);
    
    // Holographic display
    const displayGeometry = new THREE.PlaneGeometry(5, 3);
    const displayMaterial = new THREE.MeshStandardMaterial({ 
        color: color,
        transparent: true,
        opacity: 0.7,
        emissive: color,
        emissiveIntensity: 0.5,
        side: THREE.DoubleSide
    });
    const display = new THREE.Mesh(displayGeometry, displayMaterial);
    display.position.y = 3.0;
    group.add(display);
    
    // Create text texture
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 256;
    const context = canvas.getContext('2d');
    context.fillStyle = `rgba(${parseInt(color.slice(1,3), 16)}, ${parseInt(color.slice(3,5), 16)}, ${parseInt(color.slice(5,7), 16)}, 0.8)`;
    context.font = 'Bold 40px Arial';
    context.textAlign = 'center';
    context.fillText(text, canvas.width/2, canvas.height/2);
    
    const texture = new THREE.CanvasTexture(canvas);
    displayMaterial.map = texture;
    
    // Add scanline effect
    const scanlineGeometry = new THREE.PlaneGeometry(5, 3);
    const scanlineMaterial = new THREE.MeshBasicMaterial({
        color: 0x000000,
        transparent: true,
        opacity: 0.1,
        wireframe: true
    });
    const scanlines = new THREE.Mesh(scanlineGeometry, scanlineMaterial);
    scanlines.position.y = 3.01; // Slightly above the display
    group.add(scanlines);
    
    // Animation for holographic effect
    function animateHologram() {
        display.material.opacity = 0.6 + Math.sin(Date.now() * 0.005) * 0.1;
        scanlines.position.y = 3.01 + Math.sin(Date.now() * 0.01) * 0.02;
    }
    
    group.userData.update = animateHologram;
    scene.add(group);
    return group;
}

function createNPC(scene, x, y, z, type) {
    const npc = new Avatar(scene, x, y, z);
    
    // Customize based on type
    switch(type) {
        case "Warrior":
            npc.selected.headType = 'human';
            npc.selected.bodyType = 'heavy';
            npc.selected.accessories = 'sword';
            npc.selected.primaryColor = '#cc0000';
            break;
        case "Mage":
            npc.selected.headType = 'alien';
            npc.selected.bodyType = 'floating';
            npc.selected.accessories = 'cape';
            npc.selected.primaryColor = '#0000cc';
            break;
        case "Rogue":
            npc.selected.headType = 'animal';
            npc.selected.bodyType = 'slim';
            npc.selected.accessories = 'none';
            npc.selected.primaryColor = '#00cc00';
            break;
    }
    
    npc.createAvatar();
    
    // Add interaction
    npc.group.userData = {
        type: 'npc',
        name: type,
        interact: () => {
            showNotification(`${type}: "Greetings, traveler! Need any help?"`);
        }
    };
    
    // Add idle animation
    npc.playAnimation('idle');
    
    return npc;
}

function createInteractiveSeatingArea(scene, x, y, z, name) {
    const group = new THREE.Group();
    group.position.set(x, y, z);
    
    // Circular platform
    const platformGeometry = new THREE.CylinderGeometry(3, 3, 0.2, 32);
    const platformMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x333333,
        metalness: 0.3,
        roughness: 0.8
    });
    const platform = new THREE.Mesh(platformGeometry, platformMaterial);
    group.add(platform);
    
    // Seats
    for (let i = 0; i < 6; i++) {
        const angle = (i / 6) * Math.PI * 2;
        const seatX = Math.cos(angle) * 2;
        const seatZ = Math.sin(angle) * 2;
        
        const seatGeometry = new THREE.BoxGeometry(1, 0.5, 1);
        const seatMaterial = new THREE.MeshStandardMaterial({ color: 0x666666 });
        const seat = new THREE.Mesh(seatGeometry, seatMaterial);
        seat.position.set(seatX, 0.25, seatZ);
        seat.rotation.y = -angle;
        group.add(seat);
        
        // Add hover effect
        seat.userData = {
            originalColor: seatMaterial.color.clone(),
            hover: () => {
                seatMaterial.color.set(0xaaaaaa);
            },
            unhover: () => {
                seatMaterial.color.copy(seat.userData.originalColor);
            }
        };
    }
    
    // Holographic sign
    const signGeometry = new THREE.PlaneGeometry(2, 1);
    const signMaterial = new THREE.MeshStandardMaterial({
        color: 0x00ffff,
        transparent: true,
        opacity: 0.7,
        emissive: 0x00ffff,
        emissiveIntensity: 0.3,
        side: THREE.DoubleSide
    });
    const sign = new THREE.Mesh(signGeometry, signMaterial);
    sign.position.set(0, 1.5, 0);
    sign.rotation.y = Math.PI / 2;
    group.add(sign);
    
    // Add text to sign
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 128;
    const context = canvas.getContext('2d');
    context.fillStyle = 'rgba(0, 255, 255, 0.8)';
    context.font = 'Bold 24px Arial';
    context.textAlign = 'center';
    context.fillText(name, canvas.width/2, canvas.height/2);
    
    const texture = new THREE.CanvasTexture(canvas);
    signMaterial.map = texture;
    
    // Interaction data
    group.userData = {
        type: 'seating',
        name: name,
        interact: () => {
            showNotification(`Entering ${name}...`);
            // Here you would implement the actual interaction
        }
    };
    
    scene.add(group);
    return group;
}

function createPortal(scene, x, y, z, destination) {
    const group = new THREE.Group();
    group.position.set(x, y, z);
    
    // Portal ring
    const ringGeometry = new THREE.TorusGeometry(2, 0.2, 16, 32);
    const ringMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x00ffff,
        emissive: 0x00ffff,
        emissiveIntensity: 0.5,
        metalness: 0.8,
        roughness: 0.2
    });
    const ring = new THREE.Mesh(ringGeometry, ringMaterial);
    ring.rotation.x = Math.PI / 2;
    group.add(ring);
    
    // Portal effect
    const portalGeometry = new THREE.CircleGeometry(1.8, 32);
    const portalMaterial = new THREE.MeshStandardMaterial({
        color: 0x00ffff,
        transparent: true,
        opacity: 0.7,
        emissive: 0x00ffff,
        emissiveIntensity: 0.3,
        side: THREE.DoubleSide
    });
    const portal = new THREE.Mesh(portalGeometry, portalMaterial);
    portal.rotation.x = -Math.PI / 2;
    group.add(portal);
    
    // Particles
    const particleCount = 50;
    const particles = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    
    for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        const radius = 1.8;
        const theta = Math.random() * Math.PI * 2;
        const r = radius * Math.sqrt(Math.random());
        
        positions[i3] = r * Math.cos(theta);
        positions[i3 + 1] = (Math.random() - 0.5) * 0.2;
        positions[i3 + 2] = r * Math.sin(theta);
    }
    
    particles.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    
    const particleMaterial = new THREE.PointsMaterial({
        color: 0x00ffff,
        size: 0.1,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending
    });
    
    const particleSystem = new THREE.Points(particles, particleMaterial);
    group.add(particleSystem);
    
    // Animation for portal
    function animatePortal() {
        ring.rotation.z += 0.01;
        
        // Animate particles
        const positions = particles.attributes.position.array;
        
        for (let i = 0; i < particleCount; i++) {
            const i3 = i * 3;
            positions[i3 + 1] += 0.02;
            
            if (positions[i3 + 1
