// Main Game Controller
document.addEventListener('DOMContentLoaded', () => {
    // Simulate loading
    setTimeout(() => {
        document.getElementById('loading-screen').style.display = 'none';
        initGame();
    }, 2000);
});

let playerAvatar = null;
let currentWorld = null;
let worldInteractables = [];
let lastTime = 0;

function initGame() {
    // Initialize Three.js renderer
    const gameContainer = document.getElementById('game-container');
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000);
    renderer.shadowMap.enabled = true;
    gameContainer.appendChild(renderer.domElement);
    
    // Setup camera
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;
    
    // Setup scene
    const scene = new THREE.Scene();
    
    // Initialize avatar
    playerAvatar = initAvatar(scene, 0, 0, 10);
    
    // Game state
    const gameState = {
        credits: 1000,
        level: 1,
        playerName: "Guest",
        inventory: []
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
            loadWorld(world, scene, camera);
            toggleMainMenu();
        });
    });
    
    // Handle clicks on 3D objects
    renderer.domElement.addEventListener('click', (event) => {
        handleObjectClick(event, scene, camera);
    }, false);
    
    // Handle keyboard input
    const keys = {};
    document.addEventListener('keydown', (event) => {
        keys[event.key] = true;
        
        // Toggle menu with ESC
        if (event.key === 'Escape') {
            toggleMainMenu();
        }
    });
    
    document.addEventListener('keyup', (event) => {
        keys[event.key] = false;
    });
    
    // Animation loop
    function animate(time) {
        time *= 0.001; // Convert to seconds
        const deltaTime = time - lastTime;
        lastTime = time;
        
        requestAnimationFrame(animate);
        
        // Update animations
        if (playerAvatar) {
            playerAvatar.update(time);
        }
        
        // Update world objects
        scene.children.forEach(child => {
            if (child.userData && child.userData.update) {
                child.userData.update();
            }
        });
        
        // Handle continuous keyboard input
        handlePlayerMovement(keys, deltaTime);
        
        renderer.render(scene, camera);
    }
    animate(0);
    
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
        playerAvatar.initCustomizerUI();
    }
    
    function closeAvatarCustomizer() {
        document.getElementById('avatar-customizer').classList.add('hidden');
    }
    
    function loadWorld(worldName, scene, camera) {
        // Clear current world interactables
        worldInteractables = [];
        
        // Load new world
        switch(worldName) {
            case 'arcade':
                worldInteractables = loadArcadeWorld(scene, camera);
                break;
            case 'social':
                worldInteractables = loadSocialHub(scene, camera);
                break;
            case 'race':
                worldInteractables = loadRaceTrack(scene, camera);
                break;
        }
        
        currentWorld = worldName;
        showNotification(`Entering ${worldName.toUpperCase()}...`);
    }
    
    function handleObjectClick(event, scene, camera) {
        // Don't interact if menu is open
        if (!document.getElementById('main-menu').classList.contains('hidden')) return;
        
        // Calculate mouse position in normalized device coordinates
        const mouse = new THREE.Vector2();
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
        
        // Set up raycaster
        const raycaster = new THREE.Raycaster();
        raycaster.setFromCamera(mouse, camera);
        
        // Calculate objects intersecting the ray
        const intersects = raycaster.intersectObjects(scene.children, true);
        
        if (intersects.length > 0) {
            // Find the first interactive object
            let interactiveObj = null;
            for (let i = 0; i < intersects.length; i++) {
                let obj = intersects[i].object;
                
                // Traverse up the parent chain to find an object with userData
                while (obj && !obj.userData.interact) {
                    obj = obj.parent;
                }
                
                if (obj && obj.userData.interact) {
                    interactiveObj = obj;
                    break;
                }
            }
            
            if (interactiveObj) {
                interactiveObj.userData.interact();
            }
        }
    }
    
    function handlePlayerMovement(keys, deltaTime) {
        if (!playerAvatar || !playerAvatar.group) return;
        
        const moveSpeed = 5 * deltaTime;
        const rotateSpeed = 2 * deltaTime;
        
        if (keys['w'] || keys['ArrowUp']) {
            playerAvatar.group.translateZ(-moveSpeed);
            playerAvatar.playAnimation('walk');
        } else if (keys['s'] || keys['ArrowDown']) {
            playerAvatar.group.translateZ(moveSpeed);
            playerAvatar.playAnimation('walk');
        } else {
            playerAvatar.playAnimation('idle');
        }
        
        if (keys['a'] || keys['ArrowLeft']) {
            playerAvatar.group.rotation.y += rotateSpeed;
        }
        
        if (keys['d'] || keys['ArrowRight']) {
            playerAvatar.group.rotation.y -= rotateSpeed;
        }
        
        if (keys[' '] && !playerAvatar.jumping) {
            playerAvatar.playAnimation('jump');
        }
    }
    
    // Initial load
    loadWorld('social', scene, camera);
}

function showNotification(message) {
    const notification = document.getElementById('notification-center');
    notification.textContent = message;
    notification.style.opacity = 1;
    
    setTimeout(() => {
        notification.style.opacity = 0;
    }, 3000);
}
