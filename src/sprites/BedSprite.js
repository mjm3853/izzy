import { COLORS } from '../config.js';

/**
 * BedSprite - Creates the bed (goal) sprite texture
 * A round, fluffy, and cozy dog bed.
 */
export class BedSprite {
    /**
     * Create the bed sprite texture
     * @param {Phaser.Scene} scene - The scene to create the texture in
     * @returns {string} The texture key ('bed')
     */
    static create(scene) {
        if (scene.textures.exists('bed')) {
            return 'bed';
        }

        const graphics = scene.add.graphics();
        const width = 90;
        const height = 60;
        const centerX = width / 2;
        const centerY = height / 2;

        // Define a cozy color palette for the bed
        const bedColor = COLORS.beddingLavender || 0xBDB4D8; // Main color for the bed
        const bedShadow = COLORS.darkBrown || 0x8A7FAD;    // Darker shade for depth
        const bedHighlight = COLORS.white || 0xE6E0F3;     // Lighter shade for highlights

        // 1. Ground shadow to make the bed feel grounded
        graphics.fillStyle(0x000000, 0.2);
        graphics.fillEllipse(centerX, centerY + 20, 85, 15); // Soft shadow underneath

        // 2. The outer ring/bolster of the bed (the main shape)
        graphics.fillStyle(bedColor, 1);
        graphics.fillEllipse(centerX, centerY + 5, 88, 50);

        // 3. The inner shadow to create a sunken, cushioned effect
        graphics.fillStyle(bedShadow, 1);
        graphics.fillEllipse(centerX, centerY + 5, 65, 35);

        // 4. The lighter, fluffy inner cushion
        graphics.fillStyle(bedColor, 1);
        graphics.fillEllipse(centerX, centerY + 2, 68, 35);

        // 5. A soft highlight on the front rim to enhance the "fluffy" look
        graphics.fillStyle(bedHighlight, 0.5);
        graphics.fillEllipse(centerX, centerY - 1, 65, 25);

        // Generate the texture from the drawn graphics
        graphics.generateTexture('bed', width, height);
        graphics.destroy();

        return 'bed';
    }

    /**
     * Get sprite dimensions
     * @returns {{width: number, height: number}}
     */
    static getDimensions() {
        // Updated dimensions to match the new sprite
        return { width: 90, height: 60 };
    }
}