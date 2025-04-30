class Avatar {
    constructor(scene, x = 0, y = 0, z = 0) {
        this.scene = scene;
        this.group = new THREE.Group();
        this.group.position.set(x, y, z);
        this.parts = {};
        this.animations = {};
        this.currentAnimation = null;
        
        // Expanded customization options
        this.options = {
            headType: ['human', 'robot', 'alien', 'animal', 'fantasy'],
            headDetail: ['default', 'visor', 'horns', 'antenna', 'hat'],
            bodyType: ['humanoid', 'mech', 'slim', 'heavy', 'floating'],
            primaryColor: ['#FF3366', '#33FF66', '#3366FF', '#FF33FF', '#FFFF33'],
            secondaryColor: ['#660000', '#006600', '#000066', '#660066', '#666600'],
            accessories: ['none', 'jetpack', 'sword', 'shield', 'cape']
        };
        
        this.selected = {
            headType: 'human',
            headDetail: 'default',
            bodyType: 'humanoid',
            primaryColor: '#FF3366',
            secondaryColor: '#660000',
            accessories: 'none'
        };
        
        this.init();
        this.createAnimations();
    }
    
    init() {
        this.createAvatar();
        this.scene.add(this.group);
    }
    
    createAvatar() {
        this.clearAvatar();
        
        // Create body based on type
        switch(this.selected.bodyType) {
            case 'humanoid':
                this.createHumanoidBody();
                break;
            case 'mech':
                this.createMechBody();
                break;
            case 'slim':
                this.createSlimBody();
                break;
            case 'heavy':
                this.createHeavyBody();
                break;
            case 'floating':
                this.createFloatingBody();
                break;
        }
        
        // Create head based on type
        this.createHead();
        
        // Add accessories
        this.addAccessories();
    }
    
    createHumanoidBody() {
        // Torso
        const torsoGeometry = new THREE.BoxGeometry(1.2, 1.5, 0.6);
        const torsoMaterial = new THREE.MeshStandardMaterial({ 
            color: this.selected.primaryColor,
            metalness: 0.4,
            roughness: 0.7
        });
        const torso = new THREE.Mesh(torsoGeometry, torsoMaterial);
        torso.position.y = 0.75;
        this.group.add(torso);
        this.parts.torso = torso;
        
        // Arms
        const upperArmGeometry = new THREE.CylinderGeometry(0.15, 0.15, 0.8, 8);
        const lowerArmGeometry = new THREE.CylinderGeometry(0.15, 0.15, 0.8, 8);
        
        // Left arm
        const leftUpperArm = new THREE.Mesh(upperArmGeometry, torsoMaterial);
        leftUpperArm.position.set(-0.8, 1.1, 0);
        leftUpperArm.rotation.z = Math.PI / 2;
        this.group.add(leftUpperArm);
        
        const leftLowerArm = new THREE.Mesh(lowerArmGeometry, torsoMaterial);
        leftLowerArm.position.set(-1.6, 1.1, 0);
        leftLowerArm.rotation.z = Math.PI / 2;
        this.group.add(leftLowerArm);
        
        // Right arm
        const rightUpperArm = new THREE.Mesh(upperArmGeometry, torsoMaterial);
        rightUpperArm.position.set(0.8, 1.1, 0);
        rightUpperArm.rotation.z = Math.PI / 2;
        this.group.add(rightUpperArm);
        
        const rightLowerArm = new THREE.Mesh(lowerArmGeometry, torsoMaterial);
        rightLowerArm.position.set(1.6, 1.1, 0);
        rightLowerArm.rotation.z = Math.PI / 2;
        this.group.add(rightLowerArm);
        
        // Legs
        const upperLegGeometry = new THREE.CylinderGeometry(0.2, 0.2, 0.8, 8);
        const lowerLegGeometry = new THREE.CylinderGeometry(0.2, 0.15, 0.8, 8);
        
        // Left leg
        const leftUpperLeg = new THREE.Mesh(upperLegGeometry, torsoMaterial);
        leftUpperLeg.position.set(-0.3, -0.4, 0);
        this.group.add(leftUpperLeg);
        
        const leftLowerLeg = new THREE.Mesh(lowerLegGeometry, torsoMaterial);
        leftLowerLeg.position.set(-0.3, -1.2, 0);
        this.group.add(leftLowerLeg);
        
        // Right leg
        const rightUpperLeg = new THREE.Mesh(upperLegGeometry, torsoMaterial);
        rightUpperLeg.position.set(0.3, -0.4, 0);
        this.group.add(rightUpperLeg);
        
        const rightLowerLeg = new THREE.Mesh(lowerLegGeometry, torsoMaterial);
        rightLowerLeg.position.set(0.3, -1.2, 0);
        this.group.add(rightLowerLeg);
        
        // Store references for animation
        this.parts.leftArm = { upper: leftUpperArm, lower: leftLowerArm };
        this.parts.rightArm = { upper: rightUpperArm, lower: rightLowerArm };
        this.parts.leftLeg = { upper: leftUpperLeg, lower: leftLowerLeg };
        this.parts.rightLeg = { upper: rightUpperLeg, lower: rightLowerLeg };
    }
    
    createHead() {
        let headGeometry;
        const headMaterial = new THREE.MeshStandardMaterial({ 
            color: this.selected.secondaryColor,
            metalness: 0.3,
            roughness: 0.7
        });
        
        switch(this.selected.headType) {
            case 'human':
                headGeometry = new THREE.SphereGeometry(0.4, 32, 32);
                break;
            case 'robot':
                headGeometry = new THREE.BoxGeometry(0.7, 0.7, 0.7);
                break;
            case 'alien':
                headGeometry = new THREE.ConeGeometry(0.4, 0.8, 5);
                break;
            case 'animal':
                headGeometry = new THREE.DodecahedronGeometry(0.4);
                break;
            case 'fantasy':
                headGeometry = new THREE.TorusKnotGeometry(0.3, 0.1, 100, 16);
                break;
        }
        
        const head = new THREE.Mesh(headGeometry, headMaterial);
        head.position.y = 1.9;
        this.group.add(head);
        this.parts.head = head;
        
        // Add head details
        this.addHeadDetails();
    }
    
    addHeadDetails() {
        const detailMaterial = new THREE.MeshStandardMaterial({ 
            color: this.selected.primaryColor,
            metalness: 0.8,
            roughness: 0.2
        });
        
        switch(this.selected.headDetail) {
            case 'visor':
                const visorGeometry = new THREE.CylinderGeometry(0.3, 0.3, 0.1, 32, 1, true);
                const visor = new THREE.Mesh(visorGeometry, detailMaterial);
                visor.position.set(0, 1.9, 0.2);
                visor.rotation.x = Math.PI / 2;
                this.group.add(visor);
                break;
                
            case 'horns':
                const hornGeometry = new THREE.ConeGeometry(0.05, 0.3, 16);
                const leftHorn = new THREE.Mesh(hornGeometry, detailMaterial);
                leftHorn.position.set(-0.2, 2.1, 0.2);
                leftHorn.rotation.x = -0.5;
                this.group.add(leftHorn);
                
                const rightHorn = new THREE.Mesh(hornGeometry, detailMaterial);
                rightHorn.position.set(0.2, 2.1, 0.2);
                rightHorn.rotation.x = -0.5;
                this.group.add(rightHorn);
                break;
                
            case 'antenna':
                const antennaGeometry = new THREE.CylinderGeometry(0.02, 0.02, 0.4, 8);
                const antenna = new THREE.Mesh(antennaGeometry, detailMaterial);
                antenna.position.set(0, 2.1, 0);
                this.group.add(antenna);
                
                const sphereGeometry = new THREE.SphereGeometry(0.05, 8, 8);
                const sphere = new THREE.Mesh(sphereGeometry, detailMaterial);
                sphere.position.set(0, 2.3, 0);
                this.group.add(sphere);
                break;
                
            case 'hat':
                const hatGeometry = new THREE.CylinderGeometry(0.5, 0.6, 0.2, 32);
                const hat = new THREE.Mesh(hatGeometry, detailMaterial);
                hat.position.set(0, 2.1, 0);
                this.group.add(hat);
                break;
        }
    }
    
    addAccessories() {
        const accessoryMaterial = new THREE.MeshStandardMaterial({ 
            color: this.selected.primaryColor,
            metalness: 0.8,
            roughness: 0.1
        });
        
        switch(this.selected.accessories) {
            case 'jetpack':
                const jetpackGeometry = new THREE.BoxGeometry(0.8, 0.6, 0.3);
                const jetpack = new THREE.Mesh(jetpackGeometry, accessoryMaterial);
                jetpack.position.set(0, 0.8, -0.4);
                this.group.add(jetpack);
                
                // Jetpack thrusters
                const thrusterGeometry = new THREE.CylinderGeometry(0.1, 0.15, 0.3, 16);
                const leftThruster = new THREE.Mesh(thrusterGeometry, accessoryMaterial);
                leftThruster.position.set(-0.3, 0.5, -0.5);
                leftThruster.rotation.x = Math.PI / 2;
                this.group.add(leftThruster);
                
                const rightThruster = new THREE.Mesh(thrusterGeometry, accessoryMaterial);
                rightThruster.position.set(0.3, 0.5, -0.5);
                rightThruster.rotation.x = Math.PI / 2;
                this.group.add(rightThruster);
                break;
                
            case 'sword':
                const swordBladeGeometry = new THREE.BoxGeometry(0.05, 1.0, 0.1);
                const swordBlade = new THREE.Mesh(swordBladeGeometry, accessoryMaterial);
                swordBlade.position.set(0.5, 1.0, 0);
                this.group.add(swordBlade);
                
                const swordHiltGeometry = new THREE.BoxGeometry(0.1, 0.2, 0.1);
                const swordHilt = new THREE.Mesh(swordHiltGeometry, accessoryMaterial);
                swordHilt.position.set(0.5, 0.6, 0);
                this.group.add(swordHilt);
                break;
                
            case 'shield':
                const shieldGeometry = new THREE.CylinderGeometry(0.5, 0.5, 0.05, 32);
                const shield = new THREE.Mesh(shieldGeometry, accessoryMaterial);
                shield.position.set(-0.8, 1.2, 0);
                shield.rotation.y = Math.PI / 2;
                this.group.add(shield);
                break;
                
            case 'cape':
                // Simple cape using a plane
                const capeGeometry = new THREE.PlaneGeometry(0.8, 1.2);
                const cape = new THREE.Mesh(capeGeometry, accessoryMaterial);
                cape.position.set(0, 0.8, -0.3);
                cape.rotation.x = Math.PI / 2;
                this.group.add(cape);
                break;
        }
    }
    
    clearAvatar() {
        // Remove all current avatar parts
        while(this.group.children.length > 0) { 
            this.group.remove(this.group.children[0]); 
        }
        this.parts = {};
    }
    
    createAnimations() {
        // Idle animation
        this.animations.idle = {
            update: (time) => {
                if (this.parts.head) {
                    this.parts.head.rotation.y = Math.sin(time * 0.5) * 0.1;
                }
                
                if (this.parts.leftArm && this.parts.leftArm.upper) {
                    this.parts.leftArm.upper.rotation.z = Math.PI / 2 + Math.sin(time) * 0.05;
                    this.parts.rightArm.upper.rotation.z = Math.PI / 2 + Math.sin(time + Math.PI) * 0.05;
                }
            }
        };
        
        // Walk animation
        this.animations.walk = {
            update: (time) => {
                if (this.parts.head) {
                    this.parts.head.rotation.y = Math.sin(time) * 0.1;
                }
                
                if (this.parts.leftArm && this.parts.leftArm.upper) {
                    // Arm swing
                    this.parts.leftArm.upper.rotation.z = Math.PI / 2 + Math.sin(time * 5) * 0.5;
                    this.parts.rightArm.upper.rotation.z = Math.PI / 2 - Math.sin(time * 5) * 0.5;
                    
                    // Leg movement
                    this.parts.leftLeg.upper.rotation.x = Math.sin(time * 5) * 0.3;
                    this.parts.rightLeg.upper.rotation.x = -Math.sin(time * 5) * 0.3;
                    
                    // Body bounce
                    this.group.position.y = Math.sin(time * 10) * 0.05;
                }
            }
        };
        
        // Jump animation
        this.animations.jump = {
            startTime: 0,
            update: (time) => {
                const jumpTime = time - this.animations.jump.startTime;
                const jumpHeight = Math.sin(Math.min(jumpTime * 5, Math.PI)) * 1.0;
                
                this.group.position.y = jumpHeight;
                
                if (jumpTime > Math.PI / 5) {
                    this.playAnimation('idle');
                }
            }
        };
        
        // Default to idle animation
        this.currentAnimation = 'idle';
    }
    
    playAnimation(name) {
        if (this.animations[name]) {
            this.currentAnimation = name;
            if (name === 'jump') {
                this.animations.jump.startTime = performance.now() / 1000;
            }
        }
    }
    
    update(time) {
        if (this.currentAnimation && this.animations[this.currentAnimation]) {
            this.animations[this.currentAnimation].update(time);
        }
    }
    
    initCustomizerUI() {
        const container = document.querySelector('.customization-options');
        container.innerHTML = '';
        
        // Create color pickers
        const colorPickerHTML = `
            <div class="option-group">
                <h3>PRIMARY COLOR</h3>
                <input type="color" id="primary-color" value="${this.selected.primaryColor}" class="color-picker">
            </div>
            <div class="option-group">
                <h3>SECONDARY COLOR</h3>
                <input type="color" id="secondary-color" value="${this.selected.secondaryColor}" class="color-picker">
            </div>
        `;
        container.innerHTML += colorPickerHTML;
        
        // Create options for each category
        for (const category in this.options) {
            if (category.includes('Color')) continue;
            
            const optionGroup = document.createElement('div');
            optionGroup.className = 'option-group';
            
            const title = document.createElement('h3');
            title.textContent = category.toUpperCase();
            optionGroup.appendChild(title);
            
            // Add preview image for each option
            const previewContainer = document.createElement('div');
            previewContainer.className = 'preview-container';
            optionGroup.appendChild(previewContainer);
            
            this.options[category].forEach(option => {
                const optionItem = document.createElement('div');
                optionItem.className = 'option-item';
                if (this.selected[category] === option) {
                    optionItem.classList.add('selected');
                }
                
                // Add icon or text representation
                const icon = document.createElement('div');
                icon.className = 'option-icon';
                icon.textContent = option.charAt(0).toUpperCase();
                optionItem.appendChild(icon);
                
                const label = document.createElement('span');
                label.textContent = option;
                optionItem.appendChild(label);
                
                optionItem.addEventListener('click', () => {
                    this.selected[category] = option;
                    this.createAvatar();
                    
                    // Update UI
                    document.querySelectorAll(`.option-group:nth-child(${Array.from(container.children).indexOf(optionGroup) + 1} .option-item`)
                        .forEach(item => item.classList.remove('selected'));
                    optionItem.classList.add('selected');
                });
                
                optionGroup.appendChild(optionItem);
            });
            
            container.appendChild(optionGroup);
        }
        
        // Add event listeners for color pickers
        document.getElementById('primary-color').addEventListener('input', (e) => {
            this.selected.primaryColor = e.target.value;
            this.createAvatar();
        });
        
        document.getElementById('secondary-color').addEventListener('input', (e) => {
            this.selected.secondaryColor = e.target.value;
            this.createAvatar();
        });
        
        // Add save button
        const saveButton = document.createElement('button');
        saveButton.id = 'save-avatar';
        saveButton.textContent = 'SAVE AVATAR';
        saveButton.addEventListener('click', () => {
            this.saveAvatarToLocalStorage();
            document.getElementById('avatar-customizer').classList.add('hidden');
        });
        container.appendChild(saveButton);
    }
    
    saveAvatarToLocalStorage() {
        localStorage.setItem('oasisAvatar', JSON.stringify(this.selected));
    }
    
    loadAvatarFromLocalStorage() {
        const savedAvatar = localStorage.getItem('oasisAvatar');
        if (savedAvatar) {
            this.selected = JSON.parse(savedAvatar);
            this.createAvatar();
        }
    }
}

// Export for use in main.js
let playerAvatar = null;

function initAvatar(scene, x = 0, y = 0, z = 0) {
    playerAvatar = new Avatar(scene, x, y, z);
    playerAvatar.loadAvatarFromLocalStorage();
    return playerAvatar;
}

function openAvatarCustomizer() {
    document.getElementById('avatar-customizer').classList.remove('hidden');
    if (playerAvatar) {
        playerAvatar.initCustomizerUI();
    }
}
