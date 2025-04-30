import * as THREE from 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';

export class SocialHub {
    constructor(scene) {
        this.scene = scene;
        this.platform = null;
    }

    init() {
        const platformGeometry = new THREE.CircleGeometry(30, 32);
        const platformMaterial = new THREE.MeshBasicMaterial({ color: 0x0000ff });
        this.platform = new THREE.Mesh(platformGeometry, platformMaterial);
        this.platform.position.set(-100, 0, 0);
        this.platform.rotation.x = Math.PI / 2;
        this.scene.add(this.platform);
    }

    update() {
        // Pulse effect
        if (this.platform) {
            this.platform.scale.set(1 + 0.1 * Math.sin(Date.now() * 0.001), 1 + 0.1 * Math.sin(Date.now() * 0.001), 1);
        }
    }
}
