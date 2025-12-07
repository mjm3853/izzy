import { COLORS } from '../config.js';

/**
 * GrassSprite - Creates a grass decoration sprite texture
 * Small grass blades for platform decorations
 */
export class GrassSprite {
    /**
     * Create the grass sprite texture
     * @param {Phaser.Scene} scene - The scene to create the texture in
     * @returns {string} The texture key ('grass')
     */
    static create(scene) {
        if (scene.textures.exists('grass')) {
            return 'grass';
        }

        const graphics = scene.add.graphics();
        graphics.lineStyle(2, COLORS.darkGreen, 1);

        // Multiple grass blades
        for (let i = 0; i < 5; i++) {
            const x = i * 5;
            graphics.beginPath();
            graphics.moveTo(x, 10);
            graphics.lineTo(x - 2, 5);
            graphics.lineTo(x, 0);
            graphics.strokePath();
        }

        graphics.generateTexture('grass', 25, 12);
        graphics.destroy();

        return 'grass';
    }

    /**
     * Get sprite dimensions
     * @returns {{width: number, height: number}}
     */
    static getDimensions() {
        return { width: 25, height: 12 };
    }
}
