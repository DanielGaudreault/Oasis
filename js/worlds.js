// World Management System

function loadArcadeWorld(scene, camera) {
    // Clear existing scene objects
    while(scene.children.length > 0) { 
        scene.remove(scene.children[0]); 
    }
    
    // Add basic lighting back
    const ambientLight = new THREE.AmbientLight(0x404040);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);
    
    // Create arcade environment
    const floorGeometry = new THREE.PlaneGeometry(20, 20);
    const floorMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x333333, 
        metalness: 0.3,
        roughness: 0.8
    });
    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.rotation.x = -Math.PI / 2;
    scene.add(floor);
    
    // Add arcade machines
    createArcadeMachine(scene, -5, 0, 0, 0xff0000);
    createArcadeMachine(scene, 0, 0, 0, 0x00ff00);
    createArcadeMachine(scene, 5, 0, 0, 0x0000ff);
    
    // Position camera
    camera.position.set(0, 5, 10);
    camera.lookAt(0, 0, 0);
}

function createArcadeMachine(scene, x, y, z, color) {
    const group = new THREE.Group();
    
    // Cabinet
    const cabinetGeometry = new THREE.BoxGeometry(2, 3, 1);
    const cabinetMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x222222,
        metalness: 0.5,
        roughness: 0.7
    });
    const cabinet = new THREE.Mesh(cabinetGeometry, cabinetMaterial);
    cabinet.position.y = 1.5;
    group.add(cabinet);
    
    // Screen
    const screenGeometry = new THREE.PlaneGeometry(1.8, 1.2);
    const screenMaterial = new THREE.MeshStandardMaterial({ 
        color: color,
        emissive: color,
        emissiveIntensity: 0.5
    });
    const screen = new THREE.Mesh(screenGeometry, screenMaterial);
    screen.position.set(0, 1.8, 0.51);
    screen.rotation.y = Math.PI;
    group.add(screen);
    
    // Controls
    const controlsGeometry = new THREE.BoxGeometry(1.8, 0.2, 0.5);
    const controlsMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x111111,
        metalness: 0.8,
        roughness: 0.2
    });
    const controls = new THREE.Mesh(controlsGeometry, controlsMaterial);
    controls.position.set(0, 0.8, 0.51);
    group.add(controls);
    
    group.position.set(x, y, z);
    scene.add(group);
    
    return group;
}

function loadSocialHub(scene, camera) {
    // Clear existing scene objects
    while(scene.children.length > 0) { 
        scene.remove(scene.children[0]); 
    }
    
    // Add basic lighting back
    const ambientLight = new THREE.AmbientLight(0x404040);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);
    
    // Create social hub environment
    const floorGeometry = new THREE.CircleGeometry(15, 32);
    const floorMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x006600,
        metalness: 0.1,
        roughness: 0.8
    });
    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.rotation.x = -Math.PI / 2;
    scene.add(floor);
    
    // Add central fountain
    const fountainGeometry = new THREE.CylinderGeometry(3, 2, 0.5, 32);
    const fountainMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x0077ff,
        metalness: 0.9,
        roughness: 0.1
    });
    const fountain = new THREE.Mesh(fountainGeometry, fountainMaterial);
    fountain.position.y = 0.25;
    scene.add(fountain);
    
    // Add water
    const waterGeometry = new THREE.CylinderGeometry(2.5, 2.5, 0.1, 32);
    const waterMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x00aaff,
        transparent: true,
        opacity: 0.8,
        metalness: 0.9,
        roughness: 0.1
    });
    const water = new THREE.Mesh(waterGeometry, waterMaterial);
    water.position.y = 0.3;
    scene.add(water);
    
    // Add seating areas
    createSeatingArea(scene, -8, 0, -8);
    createSeatingArea(scene, 8, 0, -8);
    createSeatingArea(scene, -8, 0, 8);
    createSeatingArea(scene, 8, 0, 8);
    
    // Position camera
    camera.position.set(0, 10, 20);
    camera.lookAt(0, 0, 0);
}

function createSeatingArea(scene, x, y, z) {
    const group = new THREE.Group();
    
    // Platform
    const platformGeometry = new THREE.CylinderGeometry(3, 3, 0.2, 32);
    const platformMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x333333,
        metalness: 0.3,
        roughness: 0.8
    });
    const platform = new THREE.Mesh(platformGeometry, platformMaterial);
    platform.position.y = 0.1;
    group.add(platform);
    
    // Seats
    for (let i = 0; i < 4; i++) {
        const angle = (i / 4) * Math.PI * 2;
        const seatX = Math.cos(angle) * 2;
        const seatZ = Math.sin(angle) * 2;
        
        const seatGeometry = new THREE.BoxGeometry(1, 0.5, 1);
        const seatMaterial = new THREE.MeshStandardMaterial({ color: 0x888888 });
        const seat = new THREE.Mesh(seatGeometry, seatMaterial);
        seat.position.set(seatX, 0.25, seatZ);
        seat.rotation.y = -angle;
        group.add(seat);
    }
    
    group.position.set(x, y, z);
    scene.add(group);
    
    return group;
}

function loadRaceTrack(scene, camera) {
    // Similar structure to other world loaders
    // Would create a race track environment
}
