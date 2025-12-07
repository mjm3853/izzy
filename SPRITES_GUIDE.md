# Sprite Customization Quick Start

All game sprites have been extracted into separate, easy-to-edit components!

## 📁 Where to Find Sprites

All sprites are in the `src/sprites/` directory:

```
src/sprites/
├── IzzySprite.js       # The player (Izzy the dog)
├── TreatSprite.js      # Collectible bones
├── BedSprite.js        # Goal (the cozy bed)
├── CloudSprite.js      # Background clouds
├── GrassSprite.js      # Platform decorations
└── README.md           # Detailed customization guide
```

## 🎨 How to Customize a Sprite

### Example: Change Izzy's Colors

1. **Open** `src/sprites/IzzySprite.js`

2. **Find the color definitions** (around line 20):
   ```javascript
   const tan = COLORS.tan;        // 0xD2B48C
   const lightTan = COLORS.lightTan;  // 0xE6D5B8
   const darkTan = COLORS.darkTan;    // 0xB89968
   ```

3. **Change the colors** using hex format (`0xRRGGBB`):
   ```javascript
   const tan = 0xFF6B6B;        // Make Izzy red
   const lightTan = 0xFF9999;   // Lighter red
   const darkTan = 0xCC5555;    // Darker red
   ```

4. **Save the file** - The game will automatically reload with your changes!

### Example: Make the Bone Bigger

1. **Open** `src/sprites/TreatSprite.js`

2. **Find the bone drawing code** (around line 20-30)

3. **Increase the circle sizes**:
   ```javascript
   // Change from:
   graphics.fillCircle(-10, 0, 7);
   // To:
   graphics.fillCircle(-10, 0, 10);  // Bigger circles
   ```

4. **Update the texture size** at the end:
   ```javascript
   // Change from:
   graphics.generateTexture('treat', 28, 28);
   // To:
   graphics.generateTexture('treat', 40, 40);  // Bigger texture
   ```

5. **Save** and see the larger treats!

## 🎨 Color Reference

Colors are in hexadecimal format: `0xRRGGBB`

**Common colors:**
- Red: `0xFF0000`
- Green: `0x00FF00`
- Blue: `0x0000FF`
- Yellow: `0xFFFF00`
- Purple: `0x800080`
- Orange: `0xFFA500`
- Pink: `0xFFC0CB`
- White: `0xFFFFFF`
- Black: `0x000000`
- Gray: `0x808080`

**You can also use colors from config:**
```javascript
import { COLORS } from '../config.js';
// Then use: COLORS.tan, COLORS.white, etc.
```

## 🔧 Graphics API Cheat Sheet

Common commands used in sprite files:

### Shapes
```javascript
graphics.fillCircle(x, y, radius)
graphics.fillRect(x, y, width, height)
graphics.fillRoundedRect(x, y, width, height, cornerRadius)
graphics.fillEllipse(x, y, width, height)
```

### Styling
```javascript
graphics.fillStyle(color, alpha)  // alpha is 0-1 (0=transparent, 1=opaque)
graphics.lineStyle(width, color, alpha)
```

### Example: Draw a simple house shape
```javascript
graphics.fillStyle(0x8B4513, 1);  // Brown
graphics.fillRect(0, 0, 50, 40);  // House body

graphics.fillStyle(0xFF0000, 1);  // Red
graphics.fillTriangle(25, -20, 0, 0, 50, 0);  // Roof
```

## 📚 More Information

For a complete guide including:
- All graphics commands
- How to add new sprites
- Tips for sprite design
- Detailed examples

**See:** `src/sprites/README.md`

## 💡 Tips

1. **Start simple** - Change colors first, then try shapes
2. **Save often** - The game reloads automatically on save
3. **Use reference images** - Check `pics/` for inspiration
4. **Experiment** - It's easy to undo changes (Ctrl+Z / Cmd+Z)
5. **Check dimensions** - Sprite size affects gameplay (bigger = easier to hit)

## 🚀 Advanced: Create Your Own Sprite

Want to add a new game object? Here's the template:

1. **Create** `src/sprites/MyNewSprite.js`:
```javascript
import { COLORS } from '../config.js';

export class MyNewSprite {
    static create(scene) {
        if (scene.textures.exists('mynewsprite')) {
            return 'mynewsprite';
        }

        const graphics = scene.add.graphics();

        // Your drawing code here!
        graphics.fillStyle(0xFF00FF, 1);  // Magenta
        graphics.fillCircle(0, 0, 20);

        graphics.generateTexture('mynewsprite', 50, 50);
        graphics.destroy();

        return 'mynewsprite';
    }

    static getDimensions() {
        return { width: 50, height: 50 };
    }
}
```

2. **Register in** `src/utils/AssetManager.js`:
```javascript
import { MyNewSprite } from '../sprites/MyNewSprite.js';

// Add to createAllTextures():
MyNewSprite.create(scene);
```

3. **Use in your game scenes!**

## 🎮 Have Fun!

The game is designed to be easily customizable. Don't be afraid to experiment - you can always undo changes or ask for help!

The game runs at: **http://localhost:5173/**
