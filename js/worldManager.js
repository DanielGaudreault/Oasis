import { SocialHub } from './worlds/socialHub.js';
import { ArcadeWorld } from './worlds/arcadeWorld.js';
import { RaceTrack } from './worlds/raceTrack.js';

class WorldManager {
    constructor(scene, camera, avatarSystem) {
        this.scene = scene;
        this.camera = camera;
        this.avatarSystem = avatarSystem;
        this.currentWorld = null;
        this.worlds = {
            social: new SocialHub(scene, camera, avatarSystem),
            arcade: new ArcadeWorld(scene, camera, avatarSystem),
            race: new RaceTrack(scene, camera, avatarSystem)
        };
        this.clock = new THREE.Clock();
    }

    loadWorld(worldName) {
        if (this.currentWorld === worldName) return;
        
        // Transition effects
        this.startTransition(() => {
            if (this.currentWorld) {
                this.worlds[this.currentWorld].cleanup();
            }
            
            this.currentWorld = worldName;
            this.worlds[worldName].init();
            
            // Position player avatar
            this.avatarSystem.positionAvatarInWorld(worldName);
            
            this.endTransition();
        });
    }

    startTransition(callback) {
        // Implement transition animation (fade out, etc.)
        callback();
    }

    endTransition() {
        // Implement transition completion
    }

    update(delta) {
        if (this.currentWorld) {
            this.worlds[this.currentWorld].update(delta);
        }
    }
}

export { WorldManager };
