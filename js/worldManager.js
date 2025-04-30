import * as THREE from 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';
import { RaceTrack } from './RaceTrack.js';
import { SocialHub } from './SocialHub.js';
import { Arcade } from './arcade.js';

export class WorldManager {
    constructor(scene) {
        this.scene = scene;
        this.raceTrack = new RaceTrack(scene);
        this.socialHub = new SocialHub(scene);
        this.arcade = new Arcade(scene);
    }

    init() {
        // Ground
        const groundGeometry = new THREE.PlaneGeometry(1000, 1000);
        const groundMaterial = new THREE.MeshBasicMaterial({ color: 0x333333 });
        const ground = new THREE.Mesh(groundGeometry, groundMaterial);
        ground.rotation.x = -Math.PI / 2;
        this.scene.add(ground);

        // Initialize areas
        this.raceTrack.init();
        this.socialHub.init();
        this.arcade.init();
    }

    update() {
        this.raceTrack.update();
        this.socialHub.update();
        this.arcade.update();
    }
}
