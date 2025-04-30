function loadArcadeWorld(scene, camera) {
    // Clear existing scene objects
    while(scene.children.length > 0) { 
        scene.remove(scene.children[0]); 
    }
    
    // Add arcade-style lighting
    const ambientLight = new THREE.AmbientLight(0x333333);
    scene.add(ambientLight);
    
    const directionalLight1 = new THREE.DirectionalLight(0xffaa00, 0.5);
    directionalLight1.position.set(1, 1, 1);
    scene.add(directionalLight1);
    
    const directionalLight2 = new THREE.DirectionalLight(0x00aaff, 0.5);
    directionalLight2.position.set(-1, 1, -1);
    scene.add(directionalLight2);
    
    // Create arcade floor
    const floorGeometry = new THREE.PlaneGeometry(40, 40);
    const floorMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x111111,
        emissive: 0x222222,
        emissiveIntensity: 0.2,
        metalness: 0.8,
        roughness: 0.9
    });
    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.rotation.x = -Math.PI / 2;
    scene.add(floor);
    
    // Add grid pattern to floor
    const gridHelper = new THREE.GridHelper(40, 40, 0x00ff00, 0x003300);
    gridHelper.position.y = 0.01;
    scene.add(gridHelper);
    
    // Create arcade machines in rows
    const games = [
        { name: "JOUST", color: 0xff0000, x: -10, z: -10 },
        { name: "PAC-MAN", color: 0xffff00, x: -5, z: -10 },
        { name: "SPACE INVADERS", color: 0x00ff00, x: 0, z: -10 },
        { name: "DONKEY KONG", color: 0xff6600, x: 5, z: -10 },
        { name: "GALAGA", color: 0x00ffff, x: 10, z: -10 },
        
        { name: "FROGGER", color: 0x00ff00, x: -10, z: 0 },
        { name: "DEFENDER", color: 0xff00ff, x: -5, z: 0 },
        { name: "ASTEROIDS", color: 0xffffff, x: 0, z: 0 },
        { name: "CENTIPEDE", color: 0xff0000, x: 5, z: 0 },
        { name: "DIG DUG", color: 0xffff00, x: 10, z: 0 },
        
        { name: "TEMPEST", color: 0xff00ff, x: -10, z: 10 },
        { name: "MISSILE COMMAND", color: 0x00ffff, x: -5, z: 10 },
        { name: "Q*BERT", color: 0xff6600, x: 0, z: 10 },
        { name: "BURGERTIME", color: 0xffff00, x: 5, z: 10 },
        { name: "ROBOTRON", color: 0xff0000, x: 10, z: 10 }
    ];
    
    games.forEach(game => {
        createArcadeMachine(scene, game.x, 0, game.z, game.color, game.name);
    });
    
    // Add neon signs
    createNeonSign(scene, 0, 5, -15, "ARCADE", 0xff00ff);
    createNeonSign(scene, -15, 5, 0, "HIGH SCORES", 0x00ffff);
    createNeonSign(scene, 15, 5, 0, "PLAYER 1", 0xffff00);
    
    // Position camera
    camera.position.set(0, 10, 20);
    camera.lookAt(0, 0, 0);
    
    // Add player avatar
    if (playerAvatar) {
        playerAvatar.group.position.set(0, 0, 15);
        playerAvatar.group.rotation.y = Math.PI;
    }
    
    // Return interactive machines
    return {
        machines: games.map(game => ({
            position: new THREE.Vector3(game.x, 0, game.z),
            name: game.name,
            interact: () => startMiniGame(game.name)
        })),
        portal: {
            position: new THREE.Vector3(0, 0, 18),
            destination: "social",
            interact: () => loadWorld("social")
        }
    };
}

function createArcadeMachine(scene, x, y, z, color, gameName) {
    const group = new THREE.Group();
    group.position.set(x, y, z);
    
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
    
    // Add game title texture
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 128;
    const context = canvas.getContext('2d');
    context.fillStyle = `rgb(${parseInt(color.slice(1,3), 16)}, ${parseInt(color.slice(3,5), 16)}, ${parseInt(color.slice(5,7), 16)})`;
    context.font = 'Bold 20px Arial';
    context.textAlign = 'center';
    context.fillText(gameName, canvas.width/2, canvas.height/2);
    
    const texture = new THREE.CanvasTexture(canvas);
    screenMaterial.map = texture;
    
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
    
    // Joystick
    const joystickBaseGeometry = new THREE.CylinderGeometry(0.2, 0.2, 0.1, 16);
    const joystickBase = new THREE.Mesh(joystickBaseGeometry, controlsMaterial);
    joystickBase.position.set(-0.5, 0.9, 0.6);
    group.add(joystickBase);
    
    const joystickStickGeometry = new THREE.CylinderGeometry(0.05, 0.05, 0.3, 8);
    const joystickStick = new THREE.Mesh(joystickStickGeometry, controlsMaterial);
    joystickStick.position.set(-0.5, 1.05, 0.6);
    group.add(joystickStick);
    
    const joystickBallGeometry = new THREE.SphereGeometry(0.08, 8, 8);
    const joystickBall = new THREE.Mesh(joystickBallGeometry, controlsMaterial);
    joystickBall.position.set(-0.5, 1.2, 0.6);
    group.add(joystickBall);
    
    // Buttons
    for (let i = 0; i < 3; i++) {
        const buttonGeometry = new THREE.CylinderGeometry(0.1, 0.1, 0.1, 16);
        const buttonMaterial = new THREE.MeshStandardMaterial({ 
            color: 0xff0000,
            emissive: 0xff0000,
            emissiveIntensity: 0.3
        });
        const button = new THREE.Mesh(buttonGeometry, buttonMaterial);
        button.position.set(0.3 + (i * 0.3), 0.9, 0.6);
        group.add(button);
    }
    
    // Marquee (top of cabinet)
    const marqueeGeometry = new THREE.BoxGeometry(1.9, 0.3, 0.1);
    const marqueeMaterial = new THREE.MeshStandardMaterial({ 
        color: color,
        emissive: color,
        emissiveIntensity: 0.3
    });
    const marquee = new THREE.Mesh(marqueeGeometry, marqueeMaterial);
    marquee.position.set(0, 2.85, 0.45);
    group.add(marquee);
    
    // Add interaction data
    group.userData = {
        type: 'arcade',
        name: gameName,
        color: color,
        interact: () => startMiniGame(gameName)
    };
    
    scene.add(group);
    return group;
}

function createNeonSign(scene, x, y, z, text, color) {
    const group = new THREE.Group();
    group.position.set(x, y, z);
    
    // Text geometry
    const loader = new THREE.FontLoader();
    loader.load('https://threejs.org/examples/fonts/helvetiker_regular.typeface.json', font => {
        const textGeometry = new THREE.TextGeometry(text, {
            font: font,
            size: 0.5,
            height: 0.1,
            curveSegments: 12,
            bevelEnabled: true,
            bevelThickness: 0.03,
            bevelSize: 0.02,
            bevelOffset: 0,
            bevelSegments: 5
        });
        
        const textMaterial = new THREE.MeshStandardMaterial({
            color: color,
            emissive: color,
            emissiveIntensity: 0.8,
            metalness: 0.3,
            roughness: 0.4
        });
        
        const textMesh = new THREE.Mesh(textGeometry, textMaterial);
        textMesh.position.set(-text.length * 0.25, 0, 0); // Center text
        group.add(textMesh);
        
        // Add glow effect with particles
        const particles = new THREE.BufferGeometry();
        const particleCount = text.length * 10;
        const positions = new Float32Array(particleCount * 3);
        
        for (let i = 0; i < particleCount; i++) {
            const i3 = i * 3;
            positions[i3] = (Math.random() - 0.5) * text.length * 0.6;
            positions[i3 + 1] = (Math.random() - 0.5) * 1.0;
            positions[i3 + 2] = (Math.random() - 0.1) * 0.2;
        }
        
        particles.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        
        const particleMaterial = new THREE.PointsMaterial({
            color: color,
            size: 0.05,
            transparent: true,
            opacity: 0.8,
            blending: THREE.AdditiveBlending
        });
        
        const particleSystem = new THREE.Points(particles, particleMaterial);
        group.add(particleSystem);
        
        // Animation for neon flicker
        function animateNeon() {
            const intensity = 0.7 + Math.random() * 0.3;
            textMaterial.emissiveIntensity = intensity;
            particleMaterial.opacity = 0.5 + Math.random() * 0.3;
        }
        
        group.userData.update = animateNeon;
    });
    
    scene.add(group);
    return group;
}

function startMiniGame(gameName) {
    showNotification(`Starting ${gameName}...`);
    
    // Here you would implement the actual mini-game
    // For now, we'll just show a simple demo
    
    // Create a simple game screen
    const gameContainer = document.createElement('div');
    gameContainer.id = 'mini-game-container';
    gameContainer.style.position = 'fixed';
    gameContainer.style.top = '0';
    gameContainer.style.left = '0';
    gameContainer.style.width = '100%';
    gameContainer.style.height = '100%';
    gameContainer.style.backgroundColor = 'rgba(0,0,0,0.9)';
    gameContainer.style.zIndex = '300';
    gameContainer.style.display = 'flex';
    gameContainer.style.flexDirection = 'column';
    gameContainer.style.justifyContent = 'center';
    gameContainer.style.alignItems = 'center';
    
    const gameTitle = document.createElement('h1');
    gameTitle.textContent = gameName;
    gameTitle.style.color = '#fff';
    gameTitle.style.fontSize = '48px';
    gameContainer.appendChild(gameTitle);
    
    const gameCanvas = document.createElement('canvas');
    gameCanvas.width = 800;
    gameCanvas.height = 600;
    gameCanvas.style.border = '2px solid #fff';
    gameContainer.appendChild(gameCanvas);
    
    const closeButton = document.createElement('button');
    closeButton.textContent = 'EXIT GAME';
    closeButton.style.marginTop = '20px';
    closeButton.style.padding = '10px 20px';
    closeButton.style.backgroundColor = '#f00';
    closeButton.style.color = '#fff';
    closeButton.style.border = 'none';
    closeButton.style.cursor = 'pointer';
    closeButton.addEventListener('click', () => {
        document.body.removeChild(gameContainer);
    });
    gameContainer.appendChild(closeButton);
    
    document.body.appendChild(gameContainer);
    
    // Simple game implementation based on game name
    const ctx = gameCanvas.getContext('2d');
    
    switch(gameName) {
        case 'PAC-MAN':
            drawPacManGame(ctx, gameCanvas);
            break;
        case 'SPACE INVADERS':
            drawSpaceInvadersGame(ctx, gameCanvas);
            break;
        // Add more game implementations...
        default:
            ctx.fillStyle = '#fff';
            ctx.font = '24px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('GAME DEMO - COMING SOON!', gameCanvas.width/2, gameCanvas.height/2);
    }
}

function drawPacManGame(ctx, canvas) {
    // Simple Pac-Man implementation
    let pacman = {
        x: 50,
        y: canvas.height/2,
        radius: 20,
        mouthAngle: 0.2,
        direction: 0,
        speed: 3
    };
    
    let dots = [];
    for (let i = 0; i < 20; i++) {
        dots.push({
            x: 100 + i * 30,
            y: canvas.height/2,
            radius: 5,
            eaten: false
        });
    }
    
    function draw() {
        // Clear canvas
        ctx.fillStyle = '#000';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Draw dots
        ctx.fillStyle = '#fff';
        dots.forEach(dot => {
            if (!dot.eaten) {
                ctx.beginPath();
                ctx.arc(dot.x, dot.y, dot.radius, 0, Math.PI * 2);
                ctx.fill();
            }
        });
        
        // Draw Pac-Man
        ctx.fillStyle = '#ff0';
        ctx.beginPath();
        ctx.arc(pacman.x, pacman.y, pacman.radius, 
                pacman.mouthAngle + pacman.direction, 
                -pacman.mouthAngle + pacman.direction);
        ctx.lineTo(pacman.x, pacman.y);
        ctx.fill();
        
        // Animation
        pacman.mouthAngle = (pacman.mouthAngle + 0.05) % (Math.PI * 0.4);
        
        // Move Pac-Man
        pacman.x += pacman.speed;
        if (pacman.x > canvas.width + pacman.radius) {
            pacman.x = -pacman.radius;
        }
        
        // Check dot collision
        dots.forEach(dot => {
            if (!dot.eaten) {
                const dx = pacman.x - dot.x;
                const dy = pacman.y - dot.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < pacman.radius + dot.radius) {
                    dot.eaten = true;
                }
            }
        });
        
        requestAnimationFrame(draw);
    }
    
    draw();
}

function drawSpaceInvadersGame(ctx, canvas) {
    // Simple Space Invaders implementation
    let player = {
        x: canvas.width/2,
        y: canvas.height - 50,
        width: 50,
        height: 20,
        speed: 5
    };
    
    let invaders = [];
    for (let row = 0; row < 4; row++) {
        for (let col = 0; col < 8; col++) {
            invaders.push({
                x: 100 + col * 50,
                y: 50 + row * 40,
                width: 30,
                height: 20,
                alive: true
            });
        }
    }
    
    let bullets = [];
    let invaderDirection = 1;
    let invaderSpeed = 0.5;
    
    function draw() {
        // Clear canvas
        ctx.fillStyle = '#000';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Draw player
        ctx.fillStyle = '#0f0';
        ctx.fillRect(player.x - player.width/2, player.y - player.height/2, player.width, player.height);
        
        // Draw invaders
        ctx.fillStyle = '#f00';
        invaders.forEach(invader => {
            if (invader.alive) {
                ctx.fillRect(invader.x - invader.width/2, invader.y - invader.height/2, invader.width, invader.height);
            }
        });
        
        // Draw bullets
        ctx.fillStyle = '#fff';
        bullets.forEach(bullet => {
            ctx.fillRect(bullet.x - 2, bullet.y - 10, 4, 20);
        });
        
        // Move bullets
        bullets = bullets.filter(bullet => bullet.y > 0);
        bullets.forEach(bullet => bullet.y -= 5);
        
        // Move invaders
        let moveDown = false;
        invaders.forEach(invader => {
            if (invader.alive) {
                invader.x += invaderSpeed * invaderDirection;
                
                if (invader.x > canvas.width - invader.width/2 || invader.x < invader.width/2) {
                    moveDown = true;
                }
            }
        });
        
        if (moveDown) {
            invaderDirection *= -1;
            invaders.forEach(invader => {
                if (invader.alive) {
                    invader.y += 20;
                }
            });
        }
        
        // Check bullet collisions
        bullets.forEach((bullet, bulletIndex) => {
            invaders.forEach((invader, invaderIndex) => {
                if (invader.alive && 
                    bullet.x > invader.x - invader.width/2 && 
                    bullet.x < invader.x + invader.width/2 &&
                    bullet.y > invader.y - invader.height/2 && 
                    bullet.y < invader.y + invader.height/2) {
                    
                    invader.alive = false;
                    bullets.splice(bulletIndex, 1);
                }
            });
        });
        
        requestAnimationFrame(draw);
    }
    
    // Keyboard controls
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
            player.x = Math.max(player.width/2, player.x - player.speed);
        } else if (e.key === 'ArrowRight') {
            player.x = Math.min(canvas.width - player.width/2, player.x + player.speed);
        } else if (e.key === ' ') {
            bullets.push({ x: player.x, y: player.y - player.height/2 });
        }
    });
    
    draw();
}
