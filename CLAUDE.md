# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Izzy Game - A sidescrolling adventure game featuring Izzy, a dog trying to reach her bed to sleep. Players guide Izzy through various levels, encountering treats (collectibles/power-ups) and trials (obstacles/challenges) along the way.

**Game Concept:**
- Genre: Sidescroller/platformer
- Protagonist: Izzy the dog
- Objective: Navigate to the bed at the end of each level
- Gameplay elements: Collect treats, overcome obstacles and challenges

Reference images for the character "Izzy" are stored in the `pics/` directory for design inspiration.

## Technology Stack

- **Game Engine**: Phaser.js 3.x - A popular 2D game framework with arcade physics
- **Build Tool**: Vite - Fast development server with hot module replacement
- **Language**: JavaScript (ES6+ modules with classes)
- **Architecture**: Modular, object-oriented design with separate concerns

## Development Commands

```bash
# Install dependencies
npm install

# Run development server (with hot reload)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Project Structure

```
src/
├── main.js                 # Entry point and Phaser config
├── config.js              # Game constants and configuration
├── scenes/
│   └── GameScene.js       # Main game scene with level logic
├── entities/
│   ├── Player.js          # Player class (Izzy) with movement and animations
│   ├── Treat.js           # Collectible treats with effects
│   ├── Obstacle.js        # Hazard obstacles
│   └── Bed.js             # Goal object with animations
├── sprites/
│   ├── IzzySprite.js      # Izzy sprite graphics (easy to customize!)
│   ├── TreatSprite.js     # Treat sprite graphics
│   ├── BedSprite.js       # Bed sprite graphics
│   ├── CloudSprite.js     # Cloud decoration sprite
│   ├── GrassSprite.js     # Grass decoration sprite
│   └── README.md          # Sprite customization guide
└── utils/
    └── AssetManager.js    # Texture creation orchestrator
```

## Game Architecture

### Core Classes

**config.js**
- Central configuration for game dimensions (1200x700)
- Player physics settings (speed, jump velocity)
- Color palette for consistent theming
- Score values and timing constants

**Sprite Components** (`sprites/` directory)
- Each sprite is in its own file for easy customization
- `IzzySprite.js` - Player character design
- `TreatSprite.js` - Collectible bone design
- `BedSprite.js` - Goal object design
- `CloudSprite.js` - Background cloud decoration
- `GrassSprite.js` - Platform grass decoration
- See `sprites/README.md` for detailed customization guide

**AssetManager** (`utils/AssetManager.js`)
- Orchestrates texture creation by calling sprite components
- Provides `createAllTextures()` for essential game sprites
- Provides `createDecorationTextures()` for optional decorations
- Textures created once and reused for performance

**Player** (`entities/Player.js`)
- Extends `Phaser.Physics.Arcade.Sprite`
- Detailed hound dog design with long legs, snout, and floppy ears
- Features:
  - Horizontal movement with acceleration
  - Single and double-jump mechanics
  - Particle effects for running dust and jumping
  - Squash/stretch animations for visual feedback
  - Celebration and hurt animations
- Controls via cursor keys (arrow keys + space/up for jump)

**Treat** (`entities/Treat.js`)
- Collectible bone-shaped items
- Features:
  - Floating/bobbing animation
  - Continuous rotation
  - Sparkle effects at intervals
  - Particle burst on collection
  - Floating "+10" score text on pickup

**Obstacle** (`entities/Obstacle.js`)
- Red spike hazards that damage the player
- Features:
  - Multiple spike triangles arranged in a row
  - Pulsing glow effect
  - Impact particle effects when hit
  - Flash animation on collision

**Bed** (`entities/Bed.js`)
- Goal object - reaching it wins the level
- Features:
  - Detailed bed texture with frame, mattress, and pillow
  - Gentle bobbing animation
  - Sleeping "Z" particles that float upward
  - Ambient glow effect
  - Celebration particles (hearts, stars, sparkles) when reached

**GameScene** (`scenes/GameScene.js`)
- Main game scene managing all gameplay
- Features:
  - Layered background with gradient sky
  - Parallax scrolling clouds
  - Detailed platforms with grass decoration
  - Camera following player
  - Collision detection and game state management
  - Win/lose conditions with restart logic
  - Enhanced UI with shadows and styling

### Game Features

**Visual Enhancements**:
- Detailed character sprites with proper hound dog proportions
- Particle effects for all major actions (running, jumping, collecting, impacts)
- Smooth animations and tweens throughout
- Parallax cloud system for depth
- Grass and flower decorations
- Gradient backgrounds and atmospheric lighting
- Floating/bobbing animations on collectibles and goal

**Gameplay Mechanics**:
- Double-jump ability for advanced platforming
- Physics-based movement with proper collision detection
- Score tracking for collected treats
- Multiple platforms at varying heights
- Strategic obstacle placement
- Progressive difficulty through level layout

**Controls**:
- **Arrow Keys**: Move left/right
- **Space or Up Arrow**: Jump (press again in air for double jump)

**Game Flow**:
1. Player spawns on the left side of the level
2. Navigate platforms using movement and double-jump
3. Collect treats (bones) for points (+10 each)
4. Avoid red spike obstacles that restart the level
5. Reach the bed on the right side to win
6. Automatic restart after win (3s) or loss (2s)

### Code Organization Principles

- **Separation of Concerns**: Each entity manages its own behavior and rendering
- **Reusability**: Common assets created once via AssetManager
- **Extensibility**: Easy to add new entity types or scenes
- **Configuration-Driven**: Central config file for easy tuning
- **Clean Class Structure**: ES6 classes with clear responsibilities
- **Phaser Best Practices**: Proper use of physics groups, static vs dynamic bodies

### Adding New Features

To add a new entity type:
1. Create a new class in `src/entities/` extending appropriate Phaser class
2. Add texture creation to `AssetManager.js`
3. Instantiate in `GameScene.js` create method
4. Add collision handling in `setupCollisions()` method

To modify game constants:
- Edit `src/config.js` - all values in one place

To add new levels:
- Create new scene class in `src/scenes/`
- Register in `src/main.js` config
- Implement level-specific platform and object placement

### Customizing Sprites

All sprite graphics are extracted into separate components in `src/sprites/`:

**To change Izzy's appearance:**
1. Open `src/sprites/IzzySprite.js`
2. Modify the `create()` method - change colors, shapes, or proportions
3. Colors use hex format: `0xRRGGBB` (e.g., `0xFF0000` for red)
4. Save and the game will hot reload automatically

**To change treats or other objects:**
- Follow the same pattern for `TreatSprite.js`, `BedSprite.js`, etc.
- Each file has a `create()` method containing all drawing code
- Use Phaser Graphics API: `fillCircle()`, `fillRect()`, `fillEllipse()`, etc.

**Complete customization guide:**
- See `src/sprites/README.md` for detailed instructions
- Includes graphics API reference and color formatting
- Examples for common modifications

**Tips:**
- Start with color changes (easiest)
- Then modify shapes and proportions
- Use the reference images in `pics/` for inspiration
- The game uses programmatic graphics (no image files needed)

## Reference Materials

- `pics/` - Contains reference images of Izzy for character design and game asset creation
