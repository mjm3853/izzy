import { COLORS } from '../config.js';

/**
 * CloudSprite - Creates a cloud sprite texture
 * Fluffy cloud shape for background decorations
 */
export class CloudSprite {
    /**
     * Create the cloud sprite texture
     * @param {Phaser.Scene} scene - The scene to create the texture in
     * @returns {string} The texture key ('cloud')
     */
    static create(scene) {
        if (scene.textures.exists('cloud')) {
            return 'cloud';
        }

        const graphics = scene.add.graphics();
        graphics.fillStyle(COLORS.cloudWhite, 0.7);

        graphics.fillCircle(0, 0, 20);
        graphics.fillCircle(20, -5, 25);
        graphics.fillCircle(40, 0, 20);
        graphics.fillCircle(25, 10, 18);

        graphics.generateTexture('cloud', 70, 40);
        graphics.destroy();

        return 'cloud';
    }

    /**
     * Get sprite dimensions
     * @returns {{width: number, height: number}}
     */
    static getDimensions() {
        return { width: 70, height: 40 };
    }
}
