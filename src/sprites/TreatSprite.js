import { COLORS } from '../config.js';

/**
 * TreatSprite - Creates the treat (bone) sprite texture
 * A classic, cartoon-style dog bone shape for collectibles.
 */
export class TreatSprite {
    /**
     * Create the treat sprite texture
     * @param {Phaser.Scene} scene - The scene to create the texture in
     * @returns {string} The texture key ('treat')
     */
    static create(scene) {
        if (scene.textures.exists('treat')) {
            return 'treat';
        }

        const graphics = scene.add.graphics();
        const width = 32;
        const height = 32;
        const centerX = width / 2;
        const centerY = height / 2;

        // Define colors for clarity
        const boneColor = COLORS.treatColor || 0xE7D2B4; // Default to a beige color if not in config
        const shadowColor = 0x000000;
        const highlightColor = 0xFFFFFF;

        // 1. Shadow for depth (drawn first to be underneath)
        graphics.fillStyle(shadowColor, 0.2);
        graphics.fillEllipse(centerX, centerY + 8, 28, 8);

        // 2. Main bone shape constructed from simple shapes
        graphics.fillStyle(boneColor, 1);

        // Central shaft of the bone
        const shaftWidth = 16;
        const shaftHeight = 7;
        graphics.fillRect(centerX - shaftWidth / 2, centerY - shaftHeight / 2, shaftWidth, shaftHeight);

        // Knobs at the ends, created with circles
        const knobRadius = 6;
        const knobOffsetX = 9;  // How far from the center the knobs are
        const knobOffsetY = 5;  // How far up/down the knobs are from the shaft's center

        // Left end
        graphics.fillCircle(centerX - knobOffsetX, centerY - knobOffsetY, knobRadius); // Top-left
        graphics.fillCircle(centerX - knobOffsetX, centerY + knobOffsetY, knobRadius); // Bottom-left

        // Right end
        graphics.fillCircle(centerX + knobOffsetX, centerY - knobOffsetY, knobRadius); // Top-right
        graphics.fillCircle(centerX + knobOffsetX, centerY + knobOffsetY, knobRadius); // Bottom-right

        // 3. Simple highlight for a subtle 3D effect
        graphics.fillStyle(highlightColor, 0.7);
        graphics.fillEllipse(centerX, centerY - 2, 20, 3); // A soft shine along the top

        // Generate the texture and destroy the graphics object
        graphics.generateTexture('treat', width, height);
        graphics.destroy();

        return 'treat';
    }

    /**
     * Get sprite dimensions
     * @returns {{width: number, height: number}}
     */
    static getDimensions() {
        return { width: 32, height: 32 };
    }
}