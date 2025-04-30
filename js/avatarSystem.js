class AvatarSystem {
    constructor(scene) {
        this.scene = scene;
        this.avatar = null;
        this.mixer = null;
        this.animations = {};
        this.config = {
            bodyTypes: ['humanoid', 'cyborg', 'animal', 'robot', 'fantasy'],
            headTypes: ['human', 'helmet', 'alien', 'beast', 'holographic'],
            colors: {
                primary: '#FF3366',
                secondary: '#3366FF',
                accent: '#33FF66'
            },
            accessories: ['none', 'jetpack', 'sword', 'shield', 'cape']
        };
        
        this.init();
    }

    init() {
        this.createDefaultAvatar();
        this.loadAnimations();
    }

    createDefaultAvatar() {
        // Create basic avatar
        this.avatar = new THREE.Group();
        
        // Body
        const bodyGeometry = new THREE.BoxGeometry(0.8, 1.5, 0.4);
        const bodyMaterial = new THREE.MeshStandardMaterial({
            color: new THREE.Color(this.config.colors.primary),
            metalness: 0.3,
            roughness: 0.7
        });
        const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
        this.avatar.add(body);
        
        // Head
        const headGeometry = new THREE.SphereGeometry(0.4, 16, 16);
        const headMaterial = new THREE.MeshStandardMaterial({
            color: new THREE.Color(this.config.colors.secondary),
            metalness: 0.5,
            roughness: 0.5
        });
        const head = new THREE.Mesh(headGeometry, headMaterial);
        head.position.y = 1.0;
        this.avatar.add(head);
        
        // Add to scene
        this.scene.add(this.avatar);
    }

    loadAnimations() {
        // Setup animation mixer
        this.mixer = new THREE.AnimationMixer(this.avatar);
        
        // Create animation clips
        this.animations.idle = this.createIdleAnimation();
        this.animations.walk = this.createWalkAnimation();
        this.animations.jump = this.createJumpAnimation();
        
        // Start with idle animation
        this.playAnimation('idle');
    }

    playAnimation(name) {
        if (this.animations[name]) {
            this.mixer.stopAllAction();
            const action = this.mixer.clipAction(this.animations[name]);
            action.play();
        }
    }

    update(delta) {
        if (this.mixer) {
            this.mixer.update(delta);
        }
    }

    positionAvatarInWorld(worldName) {
        const positions = {
            social: { x: 0, y: 0, z: 10 },
            arcade: { x: 0, y: 0, z: 15 },
            race: { x: 0, y: 0, z: 30 }
        };
        
        if (positions[worldName]) {
            this.avatar.position.set(
                positions[worldName].x,
                positions[worldName].y,
                positions[worldName].z
            );
            this.avatar.rotation.y = Math.PI;
        }
    }

    // Animation creation methods
    createIdleAnimation() {
        // Create simple idle animation
        const tracks = [];
        
        // Head bobbing
        const head = this.avatar.children.find(child => child.geometry instanceof THREE.SphereGeometry);
        if (head) {
            const track = new THREE.VectorKeyframeTrack(
                '.children[1].position[y]',
                [0, 1, 2],
                [1.0, 1.05, 1.0]
            );
            tracks.push(track);
        }
        
        return new THREE.AnimationClip('idle', 2, tracks);
    }

    // ... other animation creation methods
}

export { AvatarSystem };
