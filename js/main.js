import { WorldManager } from './worldManager.js';
import { AvatarSystem } from './avatarSystem.js';
import { UIManager } from './uiManager.js';
import { AudioManager } from './audioManager.js';

class OasisGame {
    constructor() {
        this.loadAssets().then(() => {
            this.init();
            this.hideLoadingScreen();
        });
    }

    async loadAssets() {
        // Load essential assets before initialization
        return new Promise((resolve) => {
            // Simulate asset loading
            setTimeout(() => {
                resolve();
            }, 3000);
        });
    }

    init() {
        // Create Three.js renderer
        this.renderer = new THREE.WebGLRenderer({
            antialias: true,
            powerPreference: "high-performance"
        });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        document.getElementById('game-container').appendChild(this.renderer.domElement);

        // Create scene
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x050510);
        this.scene.fog = new THREE.FogExp2(0x050510, 0.002);

        // Create camera
        this.camera = new THREE.PerspectiveCamera(
            75, window.innerWidth / window.innerHeight, 0.1, 1000
        );
        this.camera.position.set(0, 2, 5);

        // Initialize systems
        this.audioManager = new AudioManager();
        this.uiManager = new UIManager(this);
        this.avatarSystem = new AvatarSystem(this.scene);
        this.worldManager = new WorldManager(this.scene, this.camera, this.avatarSystem);

        // Start with social hub
        this.worldManager.loadWorld('social');

        // Handle window resize
        window.addEventListener('resize', this.onWindowResize.bind(this));

        // Start animation loop
        this.animate();
    }

    animate() {
        requestAnimationFrame(this.animate.bind(this));
        
        // Update systems
        const delta = this.clock.getDelta();
        this.worldManager.update(delta);
        this.avatarSystem.update(delta);
        
        // Render scene
        this.renderer.render(this.scene, this.camera);
    }

    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    hideLoadingScreen() {
        const loadingScreen = document.getElementById('loading-screen');
        loadingScreen.style.opacity = 0;
        setTimeout(() => {
            loadingScreen.style.display = 'none';
        }, 500);
    }
}

// Start the game when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new OasisGame();
});
