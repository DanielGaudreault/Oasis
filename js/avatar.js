// Avatar System

class Avatar {
    constructor(scene) {
        this.scene = scene;
        this.group = new THREE.Group();
        this.parts = {};
        this.options = {
            head: ['round', 'square', 'triangular'],
            body: ['humanoid', 'robotic', 'animal'],
            color: ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff']
        };
        this.selected = {
            head: 'round',
            body: 'humanoid',
            color: '#ff0000'
        };
        
        this.init();
    }
    
    init() {
        this.createDefaultAvatar();
        this.scene.add(this.group);
    }
    
    createDefaultAvatar() {
        // Head
        const headGeometry = new THREE.SphereGeometry(0.5, 32, 32);
        const headMaterial = new THREE.MeshStandardMaterial({ 
            color: 0xff0000,
            metalness: 0.3,
            roughness: 0.7
        });
        const head = new THREE.Mesh(headGeometry, headMaterial);
        head.position.y = 1.5;
        this.group.add(head);
        this.parts.head = head;
        
        // Body
        const bodyGeometry = new THREE.BoxGeometry(1, 1, 0.5);
        const bodyMaterial = new THREE.MeshStandardMaterial({ 
            color: 0xff0000,
            metalness: 0.3,
            roughness: 0.7
        });
        const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
        body.position.y = 0.75;
        this.group.add(body);
        this.parts.body = body;
        
        // Arms
        const leftArm = this.createLimb(0.75, 0.2, 0.2, -0.6, 1.25, 0);
        const rightArm = this.createLimb(0.75, 0.2, 0.2, 0.6, 1.25, 0);
        this.group.add(leftArm);
        this.group.add(rightArm);
        this.parts.leftArm = leftArm;
        this.parts.rightArm = rightArm;
        
        // Legs
        const leftLeg = this.createLimb(0.5, 0.25, 0.25, -0.25, -0.25, 0);
        const rightLeg = this.createLimb(0.5, 0.25, 0.25, 0.25, -0.25, 0);
        this.group.add(leftLeg);
        this.group.add(rightLeg);
        this.parts.leftLeg = leftLeg;
        this.parts.rightLeg = rightLeg;
    }
    
    createLimb(length, width, depth, x, y, z) {
        const geometry = new THREE.BoxGeometry(width, length, depth);
        const material = new THREE.MeshStandardMaterial({ 
            color: 0xff0000,
            metalness: 0.3,
            roughness: 0.7
        });
        const limb = new THREE.Mesh(geometry, material);
        limb.position.set(x, y, z);
        return limb;
    }
    
    updateAppearance() {
        // Update all parts based on selected options
        Object.values(this.parts).forEach(part => {
            if (part.material) {
                part.material.color.set(this.selected.color);
            }
        });
        
        // Update head shape
        this.group.remove(this.parts.head);
        let headGeometry;
        
        switch(this.selected.head) {
            case 'round':
                headGeometry = new THREE.SphereGeometry(0.5, 32, 32);
                break;
            case 'square':
                headGeometry = new THREE.BoxGeometry(0.8, 0.8, 0.8);
                break;
            case 'triangular':
                headGeometry = new THREE.ConeGeometry(0.5, 1, 4);
                break;
        }
        
        const headMaterial = new THREE.MeshStandardMaterial({ 
            color: this.selected.color,
            metalness: 0.3,
            roughness: 0.7
        });
        const newHead = new THREE.Mesh(headGeometry, headMaterial);
        newHead.position.y = 1.5;
        this.group.add(newHead);
        this.parts.head = newHead;
    }
    
    initCustomizerUI() {
        const container = document.querySelector('.customization-options');
        container.innerHTML = '';
        
        // Create options for each category
        for (const category in this.options) {
            const optionGroup = document.createElement('div');
            optionGroup.className = 'option-group';
            
            const title = document.createElement('h3');
            title.textContent = category.toUpperCase();
            optionGroup.appendChild(title);
            
            this.options[category].forEach(option => {
                const optionItem = document.createElement('div');
                optionItem.className = 'option-item';
                if (this.selected[category] === option) {
                    optionItem.classList.add('selected');
                }
                optionItem.textContent = option;
                optionItem.addEventListener('click', () => {
                    this.selected[category] = option;
                    this.updateAppearance();
                    
                    // Update UI
                    document.querySelectorAll(`.option-group:nth-child(${Object.keys(this.options).indexOf(category) + 1}) .option-item`)
                        .forEach(item => item.classList.remove('selected'));
                    optionItem.classList.add('selected');
                });
                
                optionGroup.appendChild(optionItem);
            });
            
            container.appendChild(optionGroup);
        }
    }
}

// Export for use in main.js
let playerAvatar = null;

function initAvatar(scene) {
    playerAvatar = new Avatar(scene);
    return playerAvatar;
}

function openAvatarCustomizer() {
    document.getElementById('avatar-customizer').classList.remove('hidden');
    if (playerAvatar) {
        playerAvatar.initCustomizerUI();
    }
}
