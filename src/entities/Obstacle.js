import Phaser from 'phaser';
import { COLORS } from '../config.js';

/**
 * Obstacle class representing hazards
 */
export class Obstacle extends Phaser.GameObjects.Container {
    constructor(scene, x, y, width = 40, height = 20) {
        super(scene, x, y);

        this.width = width;
        this.height = height;

        // Create spike triangles
        const numSpikes = Math.floor(width / 10);
        for (let i = 0; i < numSpikes; i++) {
            const spikeX = (i * (width / numSpikes)) - width / 2 + (width / numSpikes / 2);
            const spike = scene.add.triangle(
                spikeX,
                0,
                0, height,
                width / numSpikes / 2, 0,
                width / numSpikes, height,
                COLORS.obstacleRed
            );
            spike.setStrokeStyle(2, 0x8B0000);
            this.add(spike);
        }

        // Add glow effect
        const glowCircle = scene.add.circle(0, -5, width / 2, COLORS.obstacleRed, 0.3);
        this.add(glowCircle);

        scene.tweens.add({
            targets: glowCircle,
            alpha: 0.1,
            duration: 1000,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });

        // Add to scene
        scene.add.existing(this);
        scene.physics.add.existing(this, true); // Static body

        // Set body size - reduced hitbox for more forgiving collision
        // Make it narrower (50% width) and shorter (40% height) than visual
        const hitboxWidth = width * 0.5;
        const hitboxHeight = height * 0.4;
        this.body.setSize(hitboxWidth, hitboxHeight);
        // Offset to align hitbox with spike tips (top portion)
        this.body.setOffset(-hitboxWidth / 2, -hitboxHeight / 2);
    }

    /**
     * Trigger obstacle hit effect
     */
    hit() {
        // Flash effect
        this.iterate((child) => {
            if (child instanceof Phaser.GameObjects.Triangle) {
                this.scene.tweens.add({
                    targets: child,
                    alpha: 0.3,
                    duration: 100,
                    yoyo: true,
                    repeat: 2,
                    onComplete: () => {
                        child.alpha = 1;
                    }
                });
            }
        });

        // Create impact particles
        const particles = this.scene.add.particles(this.x, this.y, 'treat', {
            speed: { min: 50, max: 100 },
            angle: { min: 200, max: 340 },
            scale: { start: 0.2, end: 0 },
            lifespan: 400,
            quantity: 8,
            tint: COLORS.obstacleRed,
            alpha: { start: 0.8, end: 0 }
        });

        this.scene.time.delayedCall(400, () => {
            particles.destroy();
        });
    }
}
