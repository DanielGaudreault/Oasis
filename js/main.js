import * as THREE from 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';
import { AvatarSystem } from './avatarSystem.js';
import { UIManager } from './uiManager.js';
import { WorldManager } from './worldManager.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('world') });
renderer.setSize(window.innerWidth, window.innerHeight);

// Initialize systems
const worldManager = new WorldManager(scene);
const avatarSystem = new AvatarSystem(scene, camera);
const uiManager = new UIManager(avatarSystem, worldManager);

function init() {
    worldManager.init();
    avatarSystem.init();
    uiManager.init();

    // Simulate loading
    setTimeout(() => {
        uiManager.hideLoadingScreen();
    }, 2000);

    animate();
}

function animate() {
    requestAnimationFrame(animate);
    worldManager.update();
    avatarSystem.update();
    renderer.render(scene, camera);
}

init();

// Handle window resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
