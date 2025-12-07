import Phaser from 'phaser';
import { COLORS, SCORE_CONFIG } from '../config.js';

/**
 * Treat class representing collectible bones
 */
export class Treat extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, 'treat');

        // Add to scene
        scene.add.existing(this);
        scene.physics.add.existing(this, true); // Static body

        // Add floating animation
        this.startY = y;
        scene.tweens.add({
            targets: this,
            y: y - 10,
            duration: 1000,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });

        // Add rotation
        scene.tweens.add({
            targets: this,
            angle: 360,
            duration: 4000,
            repeat: -1,
            ease: 'Linear'
        });

        // Add sparkle effect
        this.sparkleTimer = scene.time.addEvent({
            delay: 2000,
            callback: () => this.createSparkle(),
            callbackScope: this,
            loop: true
        });
    }

    /**
     * Create sparkle effect
     */
    createSparkle() {
        const sparkle = this.scene.add.circle(
            this.x + Phaser.Math.Between(-10, 10),
            this.y + Phaser.Math.Between(-10, 10),
            3,
            COLORS.yellow,
            0.8
        );

        this.scene.tweens.add({
            targets: sparkle,
            alpha: 0,
            scale: 2,
            duration: 500,
            onComplete: () => sparkle.destroy()
        });
    }

    /**
     * Collect this treat
     * @returns {number} The score value
     */
    collect() {
        // Create collection particles
        const particles = this.scene.add.particles(this.x, this.y, 'treat', {
            speed: { min: 100, max: 200 },
            angle: { min: 0, max: 360 },
            scale: { start: 0.4, end: 0 },
            lifespan: 600,
            quantity: 10,
            tint: [COLORS.gold, COLORS.yellow, COLORS.treatColor],
            alpha: { start: 1, end: 0 }
        });

        // Floating score text
        const scoreText = this.scene.add.text(this.x, this.y, `+${SCORE_CONFIG.treatValue}`, {
            fontSize: '24px',
            fill: '#FFD700',
            fontStyle: 'bold',
            stroke: '#000',
            strokeThickness: 3
        }).setOrigin(0.5);

        this.scene.tweens.add({
            targets: scoreText,
            y: this.y - 50,
            alpha: 0,
            duration: 1000,
            ease: 'Power2',
            onComplete: () => scoreText.destroy()
        });

        // Clean up and remove
        this.scene.time.delayedCall(600, () => {
            particles.destroy();
        });

        if (this.sparkleTimer) {
            this.sparkleTimer.remove();
        }

        this.disableBody(true, true);

        return SCORE_CONFIG.treatValue;
    }
}
