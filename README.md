# OASIS Web - A Simplified Open World

A basic web-based 3D open-world experience inspired by *Ready Player One*'s OASIS, built with Three.js. Features a simple avatar, a race track, a social hub, and an arcade area with basic interactivity.

## Setup
1. Create a project folder and add the provided files in the specified structure.
2. Serve the project using a local server (e.g., `python -m http.server` or VS Code's Live Server).
3. Open `index.html` in a browser.

## Requirements
- Internet connection (for Three.js CDN).
- Modern browser with WebGL support.

## Controls
- **WASD**: Move avatar.
- **UI Buttons**: Teleport to Social Hub, Race Track, or Arcade.

## File Structure
- `index.html`: Main HTML file.
- `css/loading.css`: Loading screen styles.
- `css/style.css`: General UI styles.
- `js/RaceTrack.js`: Race track logic.
- `js/SocialHub.js`: Social hub logic.
- `js/arcade.js`: Arcade logic.
- `js/avatarSystem.js`: Avatar movement and controls.
- `js/main.js`: Main game loop and initialization.
- `js/uiManager.js`: UI management.
- `js/worldManager.js`: World and area management.

## Limitations
- Single-player only.
- Basic graphics (no textures or advanced lighting).
- No multiplayer or backend integration.

## Future Improvements
- Add multiplayer via WebSocket.
- Implement advanced graphics (shaders, textures).
- Add interactive arcade games.
- Include backend for user accounts and persistence.

Built with ❤️ by Grok 3 (xAI).
