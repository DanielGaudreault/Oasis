// Worlds Management System
class WorldManager {
  constructor(scene, camera) {
    this.scene = scene;
    this.camera = camera;
    this.currentWorld = null;
    this.interactables = [];
    this.audioListener = new THREE.AudioListener();
    this.camera.add(this.audioListener);
    this.sounds = {};
    this.clock = new THREE.Clock();
    this.initSounds();
  }

  initSounds() {
    // Initialize audio loader
    const audioLoader = new THREE.AudioLoader();
    
    // Background music
    this.sounds.background = new THREE.Audio(this.audioListener);
    audioLoader.load('assets/sounds/background.mp3', (buffer) => {
      this.sounds.background.setBuffer(buffer);
      this.sounds.background.setLoop(true);
      this.sounds.background.setVolume(0.3);
    });
    
    // Interaction sounds
    this.sounds.select = new THREE.Audio(this.audioListener);
    audioLoader.load('assets/sounds/select.wav', (buffer) => {
      this.sounds.select.setBuffer(buffer);
    });
    
    this.sounds.portal = new THREE.Audio(this.audioListener);
    audioLoader.load('assets/sounds/portal.wav', (buffer) => {
      this.sounds.portal.setBuffer(buffer);
    });
  }

  loadWorld(worldName) {
    // Play transition sound
    if (this.sounds.portal) this.sounds.portal.play();
    
    // Clear current world
    this.clearWorld();
    
    // Start loading new world
    showNotification(`LOADING ${worldName.toUpperCase()}...`);
    
    // Small delay to allow notification to show
    setTimeout(() => {
      switch(worldName.toLowerCase()) {
        case 'arcade':
          this.loadArcadeWorld();
          break;
        case 'social':
          this.loadSocialHub();
          break;
        case 'race':
          this.loadRaceTrack();
          break;
        default:
          this.loadSocialHub();
      }
      
      this.currentWorld = worldName;
      showNotification(`ENTERING ${worldName.toUpperCase()}`);
      
      // Play background music if not already playing
      if (!this.sounds.background.isPlaying) {
        this.sounds.background.play();
      }
    }, 500);
  }

  clearWorld() {
    // Remove all objects from scene except lights and camera
    this.scene.children.slice().forEach(child => {
      if (!(child instanceof THREE.Light) && child !== this.camera) {
        this.scene.remove(child);
      }
    });
    
    this.interactables = [];
  }

  update() {
    const delta = this.clock.getDelta();
    
    // Update all interactables
    this.interactables.forEach(obj => {
      if (obj.update) obj.update(delta);
    });
    
    // World-specific updates
    if (this.currentWorld === 'arcade') {
      this.updateArcadeWorld(delta);
    } else if (this.currentWorld === 'social') {
      this.updateSocialHub(delta);
    } else if (this.currentWorld === 'race') {
      this.updateRaceTrack(delta);
    }
  }

  /* ---------------------- */
  /* SOCIAL HUB IMPLEMENTATION */
  /* ---------------------- */
  loadSocialHub() {
    // Environment
    this.createSocialHubEnvironment();
    
    // Centerpiece
    this.createFountain(0, 0, 0);
    
    // Interactive elements
    this.interactables.push(
      this.createNPC(-5, 0, 5, "Warrior", "Looking for a quest?"),
      this.createNPC(5, 0, 5, "Mage", "Interested in magic?"),
      this.createNPC(0, 0, -5, "Merchant", "I have rare items for sale!"),
      this.createPortal(0, 0, -20, "Arcade", 0x00ffff),
      this.createPortal(-20, 0, 0, "Race Track", 0xff00ff),
      this.createHolographicBillboard(10, 0, -15, "LEADERBOARD", 0x00ffff),
      this.createHolographicBillboard(-10, 0, -15, "NEWS", 0xff00ff),
      this.createSeatingArea(-15, 0, -10, "Chat Lounge"),
      this.createSeatingArea(15, 0, -10, "Game Room")
    );
    
    // Position camera
    this.camera.position.set(0, 15, 30);
    this.camera.lookAt(0, 0, 0);
  }

  createSocialHubEnvironment() {
    // Ground
    const groundGeometry = new THREE.CircleGeometry(30, 64);
    const groundMaterial = new THREE.MeshStandardMaterial({ 
      color: 0x225522,
      metalness: 0.1,
      roughness: 0.8,
      emissive: 0x113311,
      emissiveIntensity: 0.2
    });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    this.scene.add(ground);
    
    // Sky
    const skyGeometry = new THREE.SphereGeometry(200, 32, 32);
    const skyMaterial = new THREE.MeshStandardMaterial({ 
      color: 0x000033,
      emissive: 0x000066,
      emissiveIntensity: 0.3,
      side: THREE.BackSide
    });
    const sky = new THREE.Mesh(skyGeometry, skyMaterial);
    this.scene.add(sky);
    
    // Floating islands in distance
    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2;
      const distance = 100 + Math.random() * 50;
      const x = Math.cos(angle) * distance;
      const z = Math.sin(angle) * distance;
      this.createFloatingIsland(x, -10, z, 10 + Math.random() * 20);
    }
  }

  createFloatingIsland(x, y, z, size) {
    const group = new THREE.Group();
    group.position.set(x, y, z);
    
    // Island base
    const geometry = new THREE.SphereGeometry(size, 32, 32, 0, Math.PI * 2, 0, Math.PI * 0.5);
    const material = new THREE.MeshStandardMaterial({ 
      color: 0x3a5f0b,
      metalness: 0.1,
      roughness: 0.8
    });
    const island = new THREE.Mesh(geometry, material);
    group.add(island);
    
    // Rocks
    const rockGeometry = new THREE.DodecahedronGeometry(size * 0.3, 1);
    const rockMaterial = new THREE.MeshStandardMaterial({ color: 0x555555 });
    
    for (let i = 0; i < 5; i++) {
      const rock = new THREE.Mesh(rockGeometry, rockMaterial);
      rock.position.set(
        (Math.random() - 0.5) * size * 0.8,
        size * 0.3,
        (Math.random() - 0.5) * size * 0.8
      );
      rock.rotation.set(
        Math.random() * Math.PI,
        Math.random() * Math.PI,
        Math.random() * Math.PI
      );
      group.add(rock);
    }
    
    // Glowing crystals
    const crystalGeometry = new THREE.ConeGeometry(0.5, 2, 4);
    const crystalMaterial = new THREE.MeshStandardMaterial({ 
      color: 0x00ffff,
      emissive: 0x00ffff,
      emissiveIntensity: 0.5,
      transparent: true,
      opacity: 0.8
    });
    
    for (let i = 0; i < 3; i++) {
      const crystal = new THREE.Mesh(crystalGeometry, crystalMaterial);
      crystal.position.set(
        (Math.random() - 0.5) * size * 0.6,
        size * 0.5,
        (Math.random() - 0.5) * size * 0.6
      );
      crystal.rotation.x = Math.PI / 2;
      group.add(crystal);
    }
    
    // Animation
    group.userData = {
      update: (delta) => {
        group.rotation.y += delta * 0.1;
        group.position.y = y + Math.sin(this.clock.getElapsedTime() * 0.5) * 2;
      }
    };
    
    this.scene.add(group);
    return group;
  }

  /* ---------------------- */
  /* ARCADE WORLD IMPLEMENTATION */
  /* ---------------------- */
  loadArcadeWorld() {
    // Environment
    this.createArcadeEnvironment();
    
    // Arcade machines
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
      this.interactables.push(
        this.createArcadeMachine(game.x, 0, game.z, game.color, game.name)
      );
    });
    
    // Neon signs
    this.createNeonSign(0, 5, -15, "ARCADE", 0xff00ff);
    this.createNeonSign(-15, 5, 0, "HIGH SCORES", 0x00ffff);
    this.createNeonSign(15, 5, 0, "PLAYER 1", 0xffff00);
    
    // Position camera
    this.camera.position.set(0, 10, 20);
    this.camera.lookAt(0, 0, 0);
  }

  createArcadeEnvironment() {
    // Floor
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
    floor.receiveShadow = true;
    this.scene.add(floor);
    
    // Grid pattern
    const gridHelper = new THREE.GridHelper(40, 40, 0x00ff00, 0x003300);
    gridHelper.position.y = 0.01;
    this.scene.add(gridHelper);
    
    // Walls
    const wallGeometry = new THREE.BoxGeometry(40, 10, 1);
    const wallMaterial = new THREE.MeshStandardMaterial({ 
      color: 0x333333,
      emissive: 0x111111,
      emissiveIntensity: 0.1
    });
    
    const backWall = new THREE.Mesh(wallGeometry, wallMaterial);
    backWall.position.set(0, 5, -20);
    this.scene.add(backWall);
    
    const leftWall = new THREE.Mesh(wallGeometry, wallMaterial);
    leftWall.position.set(-20, 5, 0);
    leftWall.rotation.y = Math.PI / 2;
    this.scene.add(leftWall);
    
    const rightWall = new THREE.Mesh(wallGeometry, wallMaterial);
    rightWall.position.set(20, 5, 0);
    rightWall.rotation.y = Math.PI / 2;
    this.scene.add(rightWall);
    
    // Ceiling
    const ceiling = new THREE.Mesh(floorGeometry, wallMaterial);
    ceiling.position.y = 10;
    ceiling.rotation.x = Math.PI / 2;
    this.scene.add(ceiling);
    
    // Lighting
    const ceilingLight1 = new THREE.PointLight(0xff00ff, 0.5, 15);
    ceilingLight1.position.set(10, 8, 10);
    this.scene.add(ceilingLight1);
    
    const ceilingLight2 = new THREE.PointLight(0x00ffff, 0.5, 15);
    ceilingLight2.position.set(-10, 8, 10);
    this.scene.add(ceilingLight2);
    
    const ceilingLight3 = new THREE.PointLight(0xffff00, 0.5, 15);
    ceilingLight3.position.set(0, 8, -10);
    this.scene.add(ceilingLight3);
  }

  /* ---------------------- */
  /* RACE TRACK IMPLEMENTATION */
  /* ---------------------- */
  loadRaceTrack() {
    // Environment
    this.createRaceTrackEnvironment();
    
    // Track elements
    this.interactables.push(
      this.createStartingGrid(0, 0, 30),
      this.createFinishLine(0, 0, -30),
      this.createSpectatorStands(0, 0, -50, Math.PI),
      this.createSpectatorStands(50, 0, 0, -Math.PI/2),
      this.createSpectatorStands(0, 0, 50, 0),
      this.createSpectatorStands(-50, 0, 0, Math.PI/2),
      this.createPortal(0, 0, 40, "Social Hub", 0xff00ff)
    );
    
    // Race cars
    for (let i = 0; i < 6; i++) {
      this.interactables.push(
        this.createRaceCar(-15 + (i * 6), 0, 25, 0xffffff, `CPU ${i+1}`)
      );
    }
    
    // Position camera
    this.camera.position.set(0, 15, 35);
    this.camera.lookAt(0, 0, 0);
  }

  createRaceTrackEnvironment() {
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
    this.scene.add(track);
    
    // Track markings
    const innerLineGeometry = new THREE.RingGeometry(40, 40.5, 64, 1, 0, Math.PI * 2);
    const innerLineMaterial = new THREE.MeshBasicMaterial({ 
      color: 0xffffff,
      side: THREE.DoubleSide
    });
    const innerLine = new THREE.Mesh(innerLineGeometry, innerLineMaterial);
    innerLine.rotation.x = -Math.PI / 2;
    this.scene.add(innerLine);
    
    const outerLineGeometry = new THREE.RingGeometry(59.5, 60, 64, 1, 0, Math.PI * 2);
    const outerLine = new THREE.Mesh(outerLineGeometry, innerLineMaterial);
    outerLine.rotation.x = -Math.PI / 2;
    this.scene.add(outerLine);
    
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
    this.scene.add(grass);
    
    // Sky
    const skyGeometry = new THREE.SphereGeometry(500, 32, 32);
    const skyMaterial = new THREE.MeshStandardMaterial({ 
      color: 0x87CEEB,
      side: THREE.BackSide,
      metalness: 0.1,
      roughness: 0.9
    });
    const sky = new THREE.Mesh(skyGeometry, skyMaterial);
    this.scene.add(sky);
    
    // Sun
    const sunLight = new THREE.DirectionalLight(0xffffff, 1);
    sunLight.position.set(1, 1, 1);
    this.scene.add(sunLight);
    
    // Clouds
    for (let i = 0; i < 10; i++) {
      this.createCloud(
        Math.random() * 400 - 200,
        50 + Math.random() * 50,
        Math.random() * 400 - 200,
        Math.random() * 10 + 5
      );
    }
  }

  createCloud(x, y, z, size) {
    const group = new THREE.Group();
    group.position.set(x, y, z);
    
    const cloudGeometry = new THREE.SphereGeometry(size, 8, 8);
    const cloudMaterial = new THREE.MeshStandardMaterial({ 
      color: 0xffffff,
      transparent: true,
      opacity: 0.8
    });
    
    // Main cloud body
    const mainCloud = new THREE.Mesh(cloudGeometry, cloudMaterial);
    group.add(mainCloud);
    
    // Cloud puffs
    for (let i = 0; i < 5; i++) {
      const puff = new THREE.Mesh(cloudGeometry, cloudMaterial);
      puff.position.set(
        (Math.random() - 0.5) * size * 1.5,
        (Math.random() - 0.5) * size * 0.5,
        (Math.random() - 0.5) * size * 1.5
      );
      puff.scale.set(
        Math.random() * 0.7 + 0.3,
        Math.random() * 0.5 + 0.3,
        Math.random() * 0.7 + 0.3
      );
      group.add(puff);
    }
    
    // Animation
    group.userData = {
      speed: Math.random() * 0.02 + 0.01,
      update: (delta) => {
        group.position.x += group.userData.speed * delta * 60;
        if (group.position.x > 250) group.position.x = -250;
      }
    };
    
    this.scene.add(group);
    return group;
  }

  /* ---------------------- */
  /* WORLD UPDATE FUNCTIONS */
  /* ---------------------- */
  updateSocialHub(delta) {
    // Social hub specific updates
  }

  updateArcadeWorld(delta) {
    // Arcade world specific updates
  }

  updateRaceTrack(delta) {
    // Race track specific updates
  }
}

// Helper function to show notifications
function showNotification(message) {
  const notification = document.getElementById('notification-center');
  notification.textContent = message;
  notification.style.opacity = 1;
  
  setTimeout(() => {
    notification.style.opacity = 0;
  }, 3000);
}

// Export for use in main game
export { WorldManager };
