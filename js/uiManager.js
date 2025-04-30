class UIManager {
    constructor(game) {
        this.game = game;
        this.initUI();
        this.setupEventListeners();
    }

    initUI() {
        // Create HUD
        this.hud = document.createElement('div');
        this.hud.id = 'player-hud';
        this.hud.className = 'ui-panel';
        
        // Credits display
        this.creditsDisplay = document.createElement('div');
        this.creditsDisplay.className = 'hud-item';
        this.creditsDisplay.innerHTML = 'CREDITS: <span>1000</span>';
        this.hud.appendChild(this.creditsDisplay);
        
        // Level display
        this.levelDisplay = document.createElement('div');
        this.levelDisplay.className = 'hud-item';
        this.levelDisplay.innerHTML = 'LEVEL: <span>1</span>';
        this.hud.appendChild(this.levelDisplay);
        
        // Menu button
        this.menuButton = document.createElement('div');
        this.menuButton.className = 'hud-item';
        this.menuButton.innerHTML = '≡ MENU';
        this.menuButton.style.cursor = 'pointer';
        this.hud.appendChild(this.menuButton);
        
        document.body.appendChild(this.hud);
        
        // Create notification center
        this.notificationCenter = document.createElement('div');
        this.notificationCenter.id = 'notification-center';
        document.body.appendChild(this.notificationCenter);
        
        // Create main menu
        this.createMainMenu();
        
        // Create avatar customizer
        this.createAvatarCustomizer();
    }

    createMainMenu() {
        this.mainMenu = document.createElement('div');
        this.mainMenu.id = 'main-menu';
        
        // Menu header
        const header = document.createElement('div');
        header.className = 'menu-header';
        
        const title = document.createElement('h1');
        title.textContent = 'OASIS MAIN MENU';
        header.appendChild(title);
        
        const closeBtn = document.createElement('div');
        closeBtn.className = 'close-btn';
        closeBtn.textContent = '✕';
        closeBtn.addEventListener('click', () => this.toggleMenu());
        header.appendChild(closeBtn);
        
        this.mainMenu.appendChild(header);
        
        // Worlds section
        const worldsSection = document.createElement('div');
        worldsSection.className = 'menu-section';
        
        const worldsTitle = document.createElement('h2');
        worldsTitle.textContent = 'WORLDS';
        worldsSection.appendChild(worldsTitle);
        
        const worlds = ['Social Hub', 'Arcade', 'Race Track'];
        worlds.forEach(world => {
            const btn = document.createElement('button');
            btn.className = 'btn';
            btn.textContent = world;
            btn.addEventListener('click', () => {
                this.game.worldManager.loadWorld(world.toLowerCase().replace(' ', ''));
                this.toggleMenu();
            });
            worldsSection.appendChild(btn);
        });
        
        this.mainMenu.appendChild(worldsSection);
        
        // Avatar section
        const avatarSection = document.createElement('div');
        avatarSection.className = 'menu-section';
        
        const avatarTitle = document.createElement('h2');
        avatarTitle.textContent = 'AVATAR';
        avatarSection.appendChild(avatarTitle);
        
        const customizeBtn = document.createElement('button');
        customizeBtn.className = 'btn';
        customizeBtn.textContent = 'CUSTOMIZE';
        customizeBtn.addEventListener('click', () => this.showAvatarCustomizer());
        avatarSection.appendChild(customizeBtn);
        
        this.mainMenu.appendChild(avatarSection);
        
        document.body.appendChild(this.mainMenu);
    }

    createAvatarCustomizer() {
        this.avatarCustomizer = document.createElement('div');
        this.avatarCustomizer.id = 'avatar-customizer';
        
        // Customizer header
        const header = document.createElement('div');
        header.className = 'customizer-header';
        
        const title = document.createElement('h1');
        title.textContent = 'AVATAR CUSTOMIZATION';
        header.appendChild(title);
        
        const closeBtn = document.createElement('div');
        closeBtn.className = 'close-btn';
        closeBtn.textContent = '✕';
        closeBtn.addEventListener('click', () => this.hideAvatarCustomizer());
        header.appendChild(closeBtn);
        
        this.avatarCustomizer.appendChild(header);
        
        // Preview container
        const previewContainer = document.createElement('div');
        previewContainer.className = 'avatar-preview-container';
        this.avatarCustomizer.appendChild(previewContainer);
        
        // Customization options
        const optionsContainer = document.createElement('div');
        optionsContainer.className = 'customization-options';
        
        // Body type options
        const bodyTypeGroup = document.createElement('div');
        bodyTypeGroup.className = 'option-group';
        
        const bodyTypeTitle = document.createElement('h3');
        bodyTypeTitle.textContent = 'BODY TYPE';
        bodyTypeGroup.appendChild(bodyTypeTitle);
        
        ['Humanoid', 'Cyborg', 'Animal', 'Robot', 'Fantasy'].forEach(type => {
            const option = document.createElement('div');
            option.className = 'option-item';
            
            const icon = document.createElement('div');
            icon.className = 'option-icon';
            icon.textContent = type.charAt(0);
            option.appendChild(icon);
            
            const label = document.createElement('span');
            label.textContent = type;
            option.appendChild(label);
            
            option.addEventListener('click', () => {
                // Update avatar body type
            });
            
            bodyTypeGroup.appendChild(option);
        });
        
        optionsContainer.appendChild(bodyTypeGroup);
        
        // Color options
        const colorGroup = document.createElement('div');
        colorGroup.className = 'option-group';
        
        const colorTitle = document.createElement('h3');
        colorTitle.textContent = 'COLORS';
        colorGroup.appendChild(colorTitle);
        
        // Primary color
        const primaryColorGroup = document.createElement('div');
        primaryColorGroup.className = 'color-picker-group';
        
        const primaryLabel = document.createElement('label');
        primaryLabel.className = 'color-picker-label';
        primaryLabel.textContent = 'Primary Color';
        primaryColorGroup.appendChild(primaryLabel);
        
        const primaryPicker = document.createElement('input');
        primaryPicker.type = 'color';
        primaryPicker.className = 'color-picker';
        primaryPicker.value = '#FF3366';
        primaryPicker.addEventListener('input', (e) => {
            // Update primary color
        });
        primaryColorGroup.appendChild(primaryPicker);
        
        colorGroup.appendChild(primaryColorGroup);
        
        optionsContainer.appendChild(colorGroup);
        
        this.avatarCustomizer.appendChild(optionsContainer);
        
        // Save button
        const saveBtn = document.createElement('button');
        saveBtn.className = 'btn';
        saveBtn.textContent = 'SAVE AVATAR';
        saveBtn.addEventListener('click', () => this.hideAvatarCustomizer());
        this.avatarCustomizer.appendChild(saveBtn);
        
        document.body.appendChild(this.avatarCustomizer);
    }

    showNotification(message, duration = 3000) {
        this.notificationCenter.textContent = message;
        this.notificationCenter.style.opacity = 1;
        
        setTimeout(() => {
            this.notificationCenter.style.opacity = 0;
        }, duration);
    }

    toggleMenu() {
        this.mainMenu.style.display = this.mainMenu.style.display === 'flex' ? 'none' : 'flex';
    }

    showAvatarCustomizer() {
        this.avatarCustomizer.style.display = 'flex';
        this.mainMenu.style.display = 'none';
    }

    hideAvatarCustomizer() {
        this.avatarCustomizer.style.display = 'none';
    }

    setupEventListeners() {
        this.menuButton.addEventListener('click', () => this.toggleMenu());
        
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.toggleMenu();
            }
        });
    }
}
