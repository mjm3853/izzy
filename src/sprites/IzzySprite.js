import { COLORS } from '../config.js';

/**
 * IzzySprite - Creates the Izzy (player) sprite texture
 * A simplified, standing hound dog with lanky legs, snout, and floppy ears.
 */
export class IzzySprite {
    /**
     * Create the Izzy sprite texture
     * @param {Phaser.Scene} scene - The scene to create the texture in
     * @returns {string} The texture key ('izzy')
     */
    static create(scene) {
        if (scene.textures.exists('izzy')) {
            return 'izzy';
        }

        const graphics = scene.add.graphics();
        const textureWidth = 80;
        const textureHeight = 60;

        // A simple color palette for the dog
        const palette = {
            furMain: 0xc89F6B,   // Tan color for the body
            furDark: 0x9E754C,   // Darker tan for shading and ears
            white: 0xF2F3F3,     // White for chest and paws
            black: 0x332E2E      // For eyes and nose
        };

        // Center the drawing for easier positioning
        const cx = textureWidth / 2;
        const cy = textureHeight / 2;

        // --- Draw the Dog ---

        // Far-side legs (darker)
        graphics.fillStyle(palette.furDark);
        graphics.fillRoundedRect(cx - 12, cy, 6, 22, 3); // Back leg
        graphics.fillRoundedRect(cx + 8, cy, 6, 22, 3);  // Front leg

        // Body (torso)
        graphics.fillStyle(palette.furMain);
        graphics.fillEllipse(cx, cy, 40, 15);

        // Near-side legs (lighter)
        graphics.fillStyle(palette.furMain);
        graphics.fillRoundedRect(cx - 8, cy + 2, 6, 22, 3); // Back leg
        graphics.fillRoundedRect(cx + 12, cy + 2, 6, 22, 3); // Front leg

        // Paws (white socks)
        graphics.fillStyle(palette.white);
        graphics.fillRect(cx - 8, cy + 20, 6, 4);
        graphics.fillRect(cx + 12, cy + 20, 6, 4);
        // Darker paws for back legs
        graphics.fillStyle(palette.furDark);
        graphics.fillRect(cx - 12, cy + 18, 6, 4);
        graphics.fillRect(cx + 8, cy + 18, 6, 4);

        // Neck
        graphics.fillStyle(palette.furMain);
        graphics.fillRect(cx + 10, cy - 12, 10, 12);

        // White chest marking
        graphics.fillStyle(palette.white);
        graphics.fillEllipse(cx + 12, cy, 12, 18);

        // Head
        graphics.fillStyle(palette.furMain);
        graphics.fillEllipse(cx + 25, cy - 15, 18, 16);

        // Lanky Snout
        graphics.fillRoundedRect(cx + 32, cy - 13, 20, 8, 4);

        // Nose
        graphics.fillStyle(palette.black);
        graphics.fillCircle(cx + 51, cy - 9, 3);

        // Eye
        graphics.fillCircle(cx + 28, cy - 16, 3);

        // Floppy Ear
        graphics.fillStyle(palette.furDark);
        graphics.fillEllipse(cx + 22, cy - 20, 12, 18);

        // Tail
        graphics.fillStyle(palette.furMain);
        graphics.fillRoundedRect(cx - 28, cy - 12, 18, 5, 2.5);

        // Generate the texture and clean up
        graphics.generateTexture('izzy', textureWidth, textureHeight);
        graphics.destroy();

        return 'izzy';
    }

    /**
     * Get sprite dimensions
     * @returns {{width: number, height: number}}
     */
    static getDimensions() {
        return { width: 80, height: 60 };
    }
}