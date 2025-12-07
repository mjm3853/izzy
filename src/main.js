import Phaser from 'phaser';
import { GAME_CONFIG } from './config.js';
import { GameScene } from './scenes/GameScene.js';

/**
 * Izzy's Adventure - A sidescrolling platformer
 * Help Izzy the hound dog reach her cozy bed!
 */

// Game configuration
const config = {
    type: Phaser.AUTO,
    width: GAME_CONFIG.width,
    height: GAME_CONFIG.height,
    parent: 'game-container',
    backgroundColor: '#1a1a2e',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: GAME_CONFIG.gravity },
            debug: GAME_CONFIG.debug
        }
    },
    scene: [GameScene]
};

// Create game instance
const game = new Phaser.Game(config);

// Export game for debugging if needed
window.game = game;
