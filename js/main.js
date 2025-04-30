// Main Game Controller
document.addEventListener('DOMContentLoaded', () => {
    // Simulate loading
    setTimeout(() => {
        document.getElementById('loading-screen').style.display = 'none';
        initGame();
    }, 2000);
});

function initGame() {
    // Initialize Three.js renderer
    const gameContainer = document.getElementById('game-container');
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000);
    gameContainer.appendChild(renderer.domElement);
    
    // Setup camera
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;
    
    // Setup scene
    const scene = new THREE.Scene();
    
    // Add basic lighting
    const ambientLight = new THREE.AmbientLight(0x404040);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);
    
    // Game state
    const gameState = {
        currentWorld: null,
        credits: 1000,
        level: 1,
        playerName: "Guest",
        avatar: null
    };
    
    // UI Event Listeners
    document.getElementById('menu-toggle').addEventListener('click', toggleMainMenu);
    document.querySelector('.close-btn').addEventListener('click', toggleMainMenu);
    document.getElementById('avatar-customize').addEventListener('click', openAvatarCustomizer);
    document.querySelector('#avatar-customizer .close-btn').addEventListener('click', closeAvatarCustomizer);
    
    // World buttons
    document.querySelectorAll('.world-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const world = btn.dataset.world;
            loadWorld(world);
            toggleMainMenu();
        });
    });
    
    // Animation loop
    function animate() {
        requestAnimationFrame(animate);
        renderer.render(scene, camera);
    }
    animate();
    
    // Window resize handler
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
    
    // Helper functions
    function toggleMainMenu() {
        document.getElementById('main-menu').classList.toggle('hidden');
    }
    
    function openAvatarCustomizer() {
        document.getElementById('avatar-customizer').classList.remove('hidden');
        // Initialize avatar customizer UI
    }
    
    function closeAvatarCustomizer() {
        document.getElementById('avatar-customizer').classList.add('hidden');
    }
    
    function loadWorld(worldName) {
        // Clear current world
        if (gameState.currentWorld) {
            // Cleanup existing world
        }
        
        // Load new world
        switch(worldName) {
            case 'arcade':
                loadArcadeWorld(scene, camera);
                break;
            case 'social':
                loadSocialHub(scene, camera);
                break;
            case 'race':
                loadRaceTrack(scene, camera);
                break;
        }
        
        gameState.currentWorld = worldName;
        showNotification(`Entering ${worldName.toUpperCase()}...`);
    }
    
    function showNotification(message) {
        const notification = document.getElementById('notification-center');
        notification.textContent = message;
        notification.style.opacity = 1;
        
        setTimeout(() => {
            notification.style.opacity = 0;
        }, 3000);
    }
    
    // Initial load
    loadWorld('social');
}
