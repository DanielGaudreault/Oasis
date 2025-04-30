function loadRaceTrack(scene, camera) {
    // Clear existing scene objects
    while(scene.children.length > 0) { 
        scene.remove(scene.children[0]); 
    }
    
    // Add outdoor lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(1, 1, 1);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    scene.add(directionalLight);
    
    // Add sky
    const skyGeometry = new THREE.SphereGeometry(500, 32, 32);
    const skyMaterial = new THREE.MeshBasicMaterial({ 
        color: 0x87CEEB,
        side: THREE.BackSide
    });
    const sky = new THREE.Mesh(skyGeometry, skyMaterial);
    scene.add(sky);
    
    // Create race track
    createRaceTrack(scene);
    
    // Add spectator stands
    createSpectatorStands(scene, 0, 0, -50, Math.PI);
    createSpectatorStands(scene, 50, 0, 0, -Math.PI/2);
    createSpectatorStands(scene, 0, 0, 50, 0);
    createSpectatorStands(scene, -50, 0, 0, Math.PI/2);
    
    // Add starting grid
    createStartingGrid(scene, 0, 0, 30);
    
    // Add race cars
    const cars = [];
    for (let i = 0; i < 6; i++) {
        const car = createRaceCar(scene, -15 + (i * 6), 0, 25, 0xffffff);
        cars.push(car);
    }
    
    // Add player vehicle
    const playerCar = createRaceCar(scene, 0, 0, 30, 0xff0000);
    cars.push(playerCar);
    
    // Add finish line
    createFinishLine(scene, 0, 0, -30);
    
    // Position camera for third-person view
    camera.position.set(0, 5, 35);
    camera.lookAt(0, 0, 0);
    
    // Return interactive elements
    return {
        cars: cars,
        startRace: () => {
            showNotification("Race starting in 3... 2... 1... GO!");
            // Implement race start logic
        }
    };
}

function createRaceTrack(scene) {
    const group = new THREE.Group();
    
    // Track surface
    const trackGeometry = new THREE.RingGeometry(40, 60, 64, 8, 0, Math.PI * 2);
    const trackMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x333333,
        side: THREE.DoubleSide,
        roughness: 0.8,
        metalness: 0.2
    });
    const track = new THREE.Mesh(trackGeometry, trackMaterial);
    track.rotation.x = -Math.PI / 2;
    track.receiveShadow = true;
    group.add(track);
    
    // Track markings
    const innerLineGeometry = new THREE.RingGeometry(40, 40.5, 64, 1, 0, Math.PI * 2);
    const innerLineMaterial = new THREE.MeshBasicMaterial({ 
        color: 0xffffff,
        side: THREE.DoubleSide
    });
    const innerLine = new THREE.Mesh(innerLineGeometry, innerLineMaterial);
    innerLine.rotation.x = -Math.PI / 2;
    group.add(innerLine);
    
    const outerLineGeometry = new THREE.RingGeometry(59.5, 60, 64, 1, 0, Math.PI * 2);
    const outerLine = new THREE.Mesh(outerLineGeometry, innerLineMaterial);
    outerLine.rotation.x = -Math.PI / 2;
    group.add(outerLine);
    
    // Start/finish straight
    const startFinishGeometry = new THREE.PlaneGeometry(20, 3, 1, 1);
    const startFinishMaterial = new THREE.MeshStandardMaterial({ 
        color: 0xffffff,
        emissive: 0xffffff,
        emissiveIntensity: 0.3,
        side: THREE.DoubleSide
    });
    const startFinish = new THREE.Mesh(startFinishGeometry, startFinishMaterial);
    startFinish.rotation.x = -Math.PI / 2;
    startFinish.position.set(0, 0.01, -30);
    group.add(startFinish);
    
    // Add checkered pattern
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const context = canvas.getContext('2d');
    
    const size = 32;
    for (let y = 0; y < 8; y++) {
        for (let x = 0; x < 8; x++) {
            context.fillStyle = (x + y) % 2 === 0 ? '#ffffff' : '#000000';
            context.fillRect(x * size, y * size, size, size);
        }
    }
    
    const texture = new THREE.CanvasTexture(canvas);
    startFinishMaterial.map = texture;
    
    // Grass area
    const grassGeometry = new THREE.RingGeometry(60, 200, 64, 8, 0, Math.PI * 2);
    const grassMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x00aa00,
        side: THREE.DoubleSide,
        roughness: 0.9,
        metalness: 0.0
    });
    const grass = new THREE.Mesh(grassGeometry, grassMaterial);
    grass.rotation.x = -Math.PI / 2;
    grass.receiveShadow = true;
    group.add(grass);
    
    // Add barriers
    const barrierGeometry = new THREE.BoxGeometry(1, 0.5, 0.1);
    const barrierMaterial = new THREE.MeshStandardMaterial({ 
        color: 0xffffff,
        emissive: 0xffffff,
        emissiveIntensity: 0.2
    });
    
    for (let i = 0; i < 64; i++) {
        const angle = (i / 64) * Math.PI * 2;
        const radius = 40;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;
        
        const barrier = new THREE.Mesh(barrierGeometry, barrierMaterial);
        barrier.position.set(x, 0.25, z);
        barrier.rotation.y = -angle;
        group.add(barrier);
        
        // Add outer barriers
        const outerBarrier = new THREE.Mesh(barrierGeometry, barrierMaterial);
        outerBarrier.position.set(Math.cos(angle) * 60, 0.25, Math.sin(angle) * 60);
        outerBarrier.rotation.y = -angle;
        group.add(outerBarrier);
    }
    
    scene.add(group);
    return group;
}

function createSpectatorStands(scene, x, y, z, rotationY) {
    const group = new THREE.Group();
    group.position.set(x, y, z);
    group.rotation.y = rotationY;
    
    // Stand structure
    const standGeometry = new THREE.BoxGeometry(30, 5, 10);
    const standMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x888888,
        metalness: 0.3,
        roughness: 0.7
    });
    const stand = new THREE.Mesh(standGeometry, standMaterial);
    stand.position.y = 2.5;
    group.add(stand);
    
    // Seating
    const seatGeometry = new THREE.BoxGeometry(28, 0.2, 0.5);
    const seatMaterial = new THREE.MeshStandardMaterial({ color: 0xff0000 });
    
    for (let row = 0; row < 5; row++) {
        for (let col = 0; col < 20; col++) {
            const seat = new THREE.Mesh(seatGeometry, seatMaterial);
            seat.position.set(
                -14 + col * 1.4,
                0.1 + row * 0.5,
                4.5 - row * 0.5
            );
            group.add(seat);
        }
    }
    
    // Roof
    const roofGeometry = new THREE.BoxGeometry(30, 0.5, 12);
    const roofMaterial = new THREE.MeshStandardMaterial({ color: 0x333333 });
    const roof = new THREE.Mesh(roofGeometry, roofMaterial);
    roof.position.set(0, 5.25, 0);
    group.add(roof);
    
    // Support beams
    const beamGeometry = new THREE.BoxGeometry(0.5, 5, 0.5);
    for (let i = 0; i < 6; i++) {
        const beam = new THREE.Mesh(beamGeometry, standMaterial);
        beam.position.set(-15 + i * 6, 2.5, -2);
        group.add(beam);
    }
    
    // Spectators (simple representation)
    for (let row = 0; row < 5; row++) {
        for (let col = 0; col < 20; col++) {
            if (Math.random() > 0.3) {
                const spectatorGeometry = new THREE.BoxGeometry(0.5, 1, 0.3);
                const spectatorMaterial = new THREE.MeshStandardMaterial({ 
                    color: Math.random() * 0xffffff 
                });
                const spectator = new THREE.Mesh(spectatorGeometry, spectatorMaterial);
                spectator.position.set(
                    -14 + col * 1.4,
                    1.1 + row * 0.5,
                    4.3 - row * 0.5
                );
                group.add(spectator);
            }
        }
    }
    
    scene.add(group);
    return group;
}

function createStartingGrid(scene, x, y, z) {
    const group = new THREE.Group();
    group.position.set(x, y, z);
    
    // Grid lines
    const lineMaterial = new THREE.LineBasicMaterial({ color: 0xffffff });
    
    for (let i = 0; i < 6; i++) {
        const lineGeometry = new THREE.BufferGeometry().setFromPoints([
            new THREE.Vector3(-15, 0.01, -i * 5),
            new THREE.Vector3(15, 0.01, -i * 5)
        ]);
        const line = new THREE.Line(lineGeometry, lineMaterial);
        group.add(line);
    }
    
    // Position markers
    for (let i = 0; i < 6; i++) {
        const numberGeometry = new THREE.TextGeometry((i + 1).toString(), {
            size: 1,
            height: 0.1
        });
        const numberMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
        const number = new THREE.Mesh(numberGeometry, numberMaterial);
        number.position.set(-18, 0.1, -i * 5);
        number.rotation.x = -Math.PI / 2;
        group.add(number);
    }
    
    scene.add(group);
    return group;
}

function createRaceCar(scene, x, y, z, color) {
    const group = new THREE.Group();
    group.position.set(x, y, z);
    
    // Car body
    const bodyGeometry = new THREE.BoxGeometry(3, 1, 6);
    const bodyMaterial = new THREE.MeshStandardMaterial({ 
        color: color,
        metalness: 0.5,
        roughness: 0.5
    });
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    group.add(body);
    
    // Car cabin
    const cabinGeometry = new THREE.BoxGeometry(2, 1, 2);
    const cabinMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x333333,
        transparent: true,
        opacity: 0.7
    });
    const cabin = new THREE.Mesh(cabinGeometry, cabinMaterial);
    cabin.position.set(0, 0.5, -0.5);
    group.add(cabin);
    
    // Wheels
    const wheelGeometry = new THREE.CylinderGeometry(0.5, 0.5, 0.3, 16);
    const wheelMaterial = new THREE.MeshStandardMaterial({ color: 0x111111 });
    
    const wheelPositions = [
        { x: -1.5, y: -0.5, z: 2 },
        { x: 1.5, y: -0.5, z: 2 },
        { x: -1.5, y: -0.5, z: -2 },
        { x: 1.5, y: -0.5, z: -2 }
    ];
    
    wheelPositions.forEach(pos => {
        const wheel = new THREE.Mesh(wheelGeometry, wheelMaterial);
        wheel.position.set(pos.x, pos.y, pos.z);
        wheel.rotation.z = Math.PI / 2;
        group.add(wheel);
    });
    
    // Spoiler
    const spoilerGeometry = new THREE.BoxGeometry(2.5, 0.2, 0.5);
    const spoiler = new THREE.Mesh(spoilerGeometry, bodyMaterial);
    spoiler.position.set(0, 0.6, -3);
    group.add(spoiler);
    
    // Exhaust pipes
    const exhaustGeometry = new THREE.CylinderGeometry(0.1, 0.1, 0.5, 8);
    const exhaustMaterial = new THREE.MeshStandardMaterial({ color: 0x888888 });
    
    const leftExhaust = new THREE.Mesh(exhaustGeometry, exhaustMaterial);
    leftExhaust.position.set(-0.5, -0.2, 3);
    leftExhaust.rotation.x = Math.PI / 4;
    group.add(leftExhaust);
    
    const rightExhaust = new THREE.Mesh(exhaustGeometry, exhaustMaterial);
    rightExhaust.position.set(0.5, -0.2, 3);
    rightExhaust.rotation.x = Math.PI / 4;
    group.add(rightExhaust);
    
    // Number
    const numberGeometry = new THREE.TextGeometry('42', {
        size: 0.5,
        height: 0.1
    });
    const numberMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const number = new THREE.Mesh(numberGeometry, numberMaterial);
    number.position.set(0, 0.1, 0);
    number.rotation.x = -Math.PI / 2;
    group.add(number);
    
    scene.add(group);
    
    // Add interaction
    group.userData = {
        type: 'race-car',
        color: color,
        interact: () => {
            showNotification(`Selected ${color === 0xff0000 ? 'your' : 'opponent'} vehicle`);
            if (color === 0xff0000) {
                // Make this the player's vehicle
            }
        }
    };
    
    return group;
}

function
