import { IzzySprite } from '../sprites/IzzySprite.js';
import { TreatSprite } from '../sprites/TreatSprite.js';
import { BedSprite } from '../sprites/BedSprite.js';
import { CloudSprite } from '../sprites/CloudSprite.js';
import { GrassSprite } from '../sprites/GrassSprite.js';

/**
 * AssetManager - Manages creation of game textures and assets
 *
 * All sprites are now in separate files under src/sprites/
 * This makes it easy to update individual sprite designs.
 */
export class AssetManager {
    /**
     * Create all essential game textures
     * @param {Phaser.Scene} scene - The scene to create textures in
     */
    static createAllTextures(scene) {
        IzzySprite.create(scene);
        TreatSprite.create(scene);
        BedSprite.create(scene);
    }

    /**
     * Create optional decoration textures
     * @param {Phaser.Scene} scene - The scene to create textures in
     */
    static createDecorationTextures(scene) {
        CloudSprite.create(scene);
        GrassSprite.create(scene);
    }

    /**
     * Create all available textures including decorations
     * @param {Phaser.Scene} scene - The scene to create textures in
     */
    static createAllAvailableTextures(scene) {
        AssetManager.createAllTextures(scene);
        AssetManager.createDecorationTextures(scene);
    }
}
