# Sprites Directory

This directory contains all sprite components for the Izzy game. Each sprite is in its own file, making it easy to update individual designs without affecting other parts of the codebase.

## Available Sprites

### IzzySprite.js
The player character - a hound dog with long legs, snout, and floppy ears.

**Key features:**
- Tan body with white chest marking
- Long legs with joints and paws
- Long snout with nose
- Floppy ears
- Tail
- Expressive eyes

**Dimensions:** 80x60 pixels

### TreatSprite.js
Collectible bone treats that Izzy can pick up.

**Key features:**
- Bone shape with rounded ends
- Light tan color
- White highlights for depth
- Shadow for dimension

**Dimensions:** 28x28 pixels

### BedSprite.js
The goal object - Izzy's cozy bed.

**Key features:**
- Wooden bed frame with legs
- Lavender mattress with quilted pattern
- White pillow
- Purple blanket edge
- Shadow for depth

**Dimensions:** 95x50 pixels

### CloudSprite.js
Background decoration clouds (optional).

**Key features:**
- Fluffy cloud shape
- Multiple circles for volume
- Semi-transparent

**Dimensions:** 70x40 pixels

### GrassSprite.js
Small grass decoration for platforms (optional).

**Key features:**
- Multiple grass blades
- Green color
- Simple line-based design

**Dimensions:** 25x12 pixels

## How to Update a Sprite

1. **Open the sprite file** you want to modify (e.g., `IzzySprite.js`)

2. **Locate the `create()` method** - this contains all the drawing code

3. **Modify the graphics commands** to change the sprite appearance:
   - `fillStyle(color, alpha)` - Set fill color
   - `fillRect(x, y, width, height)` - Draw rectangle
   - `fillCircle(x, y, radius)` - Draw circle
   - `fillEllipse(x, y, width, height)` - Draw ellipse
   - `fillRoundedRect(x, y, width, height, radius)` - Draw rounded rectangle
   - `lineStyle(width, color, alpha)` - Set line style for strokes

4. **Adjust dimensions if needed** in the `getDimensions()` method

5. **Update the texture generation size** in `generateTexture()` call if you changed dimensions

6. **Save and test** - Vite will hot reload the changes automatically

## Example: Changing Izzy's Color

To make Izzy a different color, modify the color variables in `IzzySprite.js`:

```javascript
const tan = 0xFF6B6B;        // Change to red
const lightTan = 0xFF9999;   // Lighter red
const darkTan = 0xCC5555;    // Darker red
```

## Color Format

Colors use hexadecimal format: `0xRRGGBB`
- Red: `0xFF0000`
- Green: `0x00FF00`
- Blue: `0x0000FF`
- White: `0xFFFFFF`
- Black: `0x000000`

You can also use the colors from `config.js` via `COLORS.colorName`.

## Adding a New Sprite

1. Create a new file in this directory (e.g., `MySprite.js`)
2. Follow the pattern of existing sprites:
   ```javascript
   import { COLORS } from '../config.js';

   export class MySprite {
       static create(scene) {
           if (scene.textures.exists('mysprite')) {
               return 'mysprite';
           }

           const graphics = scene.add.graphics();
           // ... drawing code ...
           graphics.generateTexture('mysprite', width, height);
           graphics.destroy();

           return 'mysprite';
       }

       static getDimensions() {
           return { width: 50, height: 50 };
       }
   }
   ```
3. Import and register in `AssetManager.js`
4. Use in your game scenes

## Graphics API Reference

Common Phaser graphics commands:

- **Shapes:**
  - `fillCircle(x, y, radius)`
  - `fillRect(x, y, width, height)`
  - `fillRoundedRect(x, y, width, height, radius)`
  - `fillEllipse(x, y, width, height)`
  - `fillTriangle(x1, y1, x2, y2, x3, y3)`

- **Styling:**
  - `fillStyle(color, alpha)` - Set fill color
  - `lineStyle(width, color, alpha)` - Set stroke style

- **Paths:**
  - `beginPath()` - Start a new path
  - `moveTo(x, y)` - Move to point
  - `lineTo(x, y)` - Draw line to point
  - `closePath()` - Close the path
  - `strokePath()` - Stroke the current path
  - `fillPath()` - Fill the current path

## Tips

- Start with simple shapes and build complexity
- Use transparency (alpha values) for depth and shadows
- Layer shapes from back to front
- Center your sprite at (0, 0) for easier positioning
- Test different sizes to find what looks best in-game
- Use reference images for inspiration (see `pics/` directory)
