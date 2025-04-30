import * as THREE from 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';

export class RaceTrack {
    constructor(scene) {
        this.scene = scene;
        this.track = null;
    }

    init() {
        const trackGeometry = new THREE.RingGeometry(50, 60, 32);
        const trackMaterial = new THREE.MeshBasicMaterial({ color: 0x888888, side: THREE.DoubleSide });
        this.track = new THREE.Mesh(trackGeometry, trackMaterial);
        this.track.position.set(100, 0, 0);
        this.track.rotation.x = Math.PI / 2;
        this.scene.add(this.track);
    }

    update() {
        // Rotate track for visual effect
        if (this.track) {
            this.track.rotation.z += 0.01;
        }
    }
}
