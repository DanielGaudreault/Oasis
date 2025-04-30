import * as THREE from 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';

export class Arcade {
    constructor(scene) {
        this.scene = scene;
        this.machines = [];
    }

    init() {
        for (let i = 0; i < 5; i++) {
            const machineGeometry = new THREE.BoxGeometry(5, 10, 5);
            const machineMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
            const machine = new THREE.Mesh(machineGeometry, machineMaterial);
            machine.position.set(0, 5, -50 + i * 15);
            this.scene.add(machine);
            this.machines.push(machine);
        }
    }

    update() {
        this.machines.forEach((machine, index) => {
            machine.position.y = 5 + Math.sin(Date.now() * 0.001 + index) * 2;
        });
    }
}
