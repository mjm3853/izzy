import Phaser from 'phaser';
import { COLORS } from '../config.js';

/**
 * Bed class representing the goal
 */
export class Bed extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, 'bed');

        // Add to scene
        scene.add.existing(this);
        scene.physics.add.existing(this, true); // Static body

        // Add gentle bobbing animation
        this.startY = y;
        scene.tweens.add({
            targets: this,
            y: y - 5,
            duration: 2000,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });

        // Add "Z" particles to show it's for sleeping
        this.zzParticleTimer = scene.time.addEvent({
            delay: 1500,
            callback: () => this.createSleepParticle(),
            callbackScope: this,
            loop: true
        });

        // Add glow effect
        this.glow = scene.add.circle(this.x, this.y, 50, COLORS.beddingLavender, 0.2);
        scene.tweens.add({
            targets: this.glow,
            scale: 1.2,
            alpha: 0.1,
            duration: 1500,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });
    }

    /**
     * Update bed position
     */
    update() {
        // Update glow position to follow bed
        if (this.glow) {
            this.glow.setPosition(this.x, this.y);
        }
    }

    /**
     * Create sleeping "Z" particle
     */
    createSleepParticle() {
        const zText = this.scene.add.text(
            this.x + 20,
            this.y - 20,
            'Z',
            {
                fontSize: '20px',
                fill: '#ffffff',
                fontStyle: 'bold',
                stroke: '#000',
                strokeThickness: 2
            }
        );

        this.scene.tweens.add({
            targets: zText,
            y: this.y - 60,
            x: this.x + 40,
            alpha: 0,
            scale: 1.5,
            duration: 2000,
            ease: 'Power1',
            onComplete: () => zText.destroy()
        });
    }

    /**
     * Trigger reached animation
     */
    reached() {
        // Stop Z particles
        if (this.zzParticleTimer) {
            this.zzParticleTimer.remove();
        }

        // Bounce the bed
        this.scene.tweens.add({
            targets: this,
            scaleX: 1.1,
            scaleY: 0.9,
            duration: 150,
            yoyo: true,
            repeat: 2,
            ease: 'Power2'
        });

        // Create heart particles
        const hearts = ['❤️', '💤', '⭐'];
        for (let i = 0; i < 10; i++) {
            this.scene.time.delayedCall(i * 100, () => {
                const heart = this.scene.add.text(
                    this.x + Phaser.Math.Between(-30, 30),
                    this.y,
                    Phaser.Utils.Array.GetRandom(hearts),
                    {
                        fontSize: '24px'
                    }
                );

                this.scene.tweens.add({
                    targets: heart,
                    y: heart.y - Phaser.Math.Between(50, 100),
                    alpha: 0,
                    duration: 1500,
                    ease: 'Power2',
                    onComplete: () => heart.destroy()
                });
            });
        }

        // Create sparkle burst
        const particles = this.scene.add.particles(this.x, this.y, 'treat', {
            speed: { min: 100, max: 200 },
            angle: { min: 0, max: 360 },
            scale: { start: 0.4, end: 0 },
            lifespan: 1000,
            quantity: 30,
            tint: [COLORS.gold, COLORS.beddingLavender, COLORS.pink, COLORS.white],
            alpha: { start: 1, end: 0 }
        });

        this.scene.time.delayedCall(1000, () => {
            particles.destroy();
        });
    }

    /**
     * Clean up when destroyed
     */
    destroy() {
        if (this.zzParticleTimer) {
            this.zzParticleTimer.remove();
        }
        if (this.glow) {
            this.glow.destroy();
        }
        super.destroy();
    }
}
