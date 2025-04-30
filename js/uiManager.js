export class UIManager {
    constructor(avatarSystem, worldManager) {
        this.avatarSystem = avatarSystem;
        this.worldManager = worldManager;
        this.locationDisplay = document.getElementById('location');
    }

    init() {
        document.getElementById('social-btn').addEventListener('click', () => {
            this.avatarSystem.teleport('social');
            this.updateLocation('Social Hub');
        });
        document.getElementById('race-btn').addEventListener('click', () => {
            this.avatarSystem.teleport('race');
            this.updateLocation('Race Track');
        });
        document.getElementById('arcade-btn').addEventListener('click', () => {
            this.avatarSystem.teleport('arcade');
            this.updateLocation('Arcade');
        });
    }

    updateLocation(location) {
        this.locationDisplay.textContent = `Location: ${location}`;
    }

    hideLoadingScreen() {
        const loadingScreen = document.getElementById('loading-screen');
        loadingScreen.style.display = 'none';
    }
}
