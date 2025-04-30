import * as THREE from 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';

export class AvatarSystem {
    constructor(scene, camera) {
        this.scene = scene;
        this.camera = camera;
        this.avatar = null;
        this.speed = 0.5;
        this.keys = {};
    }

    init() {
        const avatarGeometry = new THREE.SphereGeometry(2, 32, 32);
        const avatarMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
        this.avatar = new THREE.Mesh(avatarGeometry, avatarMaterial);
        this.avatar.position.set(0, 2, 0);
        this.scene.add(this.avatar);

        // Camera follows avatar
        this.camera.position.set(0, 10, 20);
        this.camera.lookAt(this.avatar.position);

        // Keyboard controls
        window.addEventListener('keydown', (e) => this.keys[e.key] = true);
        window.addEventListener('keyup', (e) => this.keys[e.key] = false);
    }

    update() {
        if (!this.avatar) return;

        // Movement
        if (this.keys['w']) this.avatar.position.z -= this.speed;
        if (this.keys['s']) this.avatar.position.z += this.speed;
        if (this.keys['a']) this.avatar.position.x -= this.speed;
        if (this.keys['d']) this.avatar.position.x += this.speed;

        // Update camera
        this.camera.position.set(this.avatar.position.x, 10, this.avatar.position.z + 20);
        this.camera.lookAt(this.avatar.position);
    }

    teleport(location) {
        if (location === 'social') {
            this.avatar.position.set(-100, 2, 0);
        } else if (location === 'race') {
            this.avatar.position.set(100, 2, 0);
        } else if (location === 'arcade') {
            this.avatar.position.set(0, 2, -50);
        } else {
            this.avatar.position.set(0, 2, 0);
        }
    }
}
