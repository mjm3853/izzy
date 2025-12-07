import Phaser from 'phaser';
import { PLAYER_CONFIG, COLORS } from '../config.js';

/**
 * Player class representing Izzy the hound dog
 */
export class Player extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, 'izzy');

        // Add to scene
        scene.add.existing(this);
        scene.physics.add.existing(this);

        // Configure physics
        this.setBounce(PLAYER_CONFIG.bounce);
        this.setCollideWorldBounds(true);
        this.setScale(PLAYER_CONFIG.scale);

        // Player state
        this.isJumping = false;
        this.lastGroundedTime = 0;  // For coyote time
        this.coyoteTime = 150;  // 150ms grace period for jumping after leaving platform

        // Create particle emitter for running dust
        this.dustEmitter = scene.add.particles(0, 0, 'treat', {
            speed: { min: 20, max: 50 },
            angle: { min: 160, max: 200 },
            scale: { start: 0.1, end: 0 },
            lifespan: 300,
            frequency: 100,
            tint: COLORS.darkBrown,
            alpha: { start: 0.4, end: 0 }
        });
        this.dustEmitter.stop();
        this.dustEmitter.startFollow(this, 0, 10);
    }

    /**
     * Update player state each frame
     * @param {Phaser.Input.Keyboard.CursorKeys} cursors
     */
    update(cursors) {
        const onGround = this.body.touching.down;
        const currentTime = this.scene.time.now;

        // Track when we were last on ground for coyote time
        if (onGround) {
            this.isJumping = false;
            this.lastGroundedTime = currentTime;
        }

        // Check if we're in coyote time (brief window after leaving platform)
        const canCoyoteJump = (currentTime - this.lastGroundedTime) < this.coyoteTime;

        // Horizontal movement
        if (cursors.left.isDown) {
            this.setVelocityX(-PLAYER_CONFIG.speed);
            this.setFlipX(true);

            // Emit dust particles when moving on ground
            if (onGround) {
                this.dustEmitter.start();
            }
        } else if (cursors.right.isDown) {
            this.setVelocityX(PLAYER_CONFIG.speed);
            this.setFlipX(false);

            // Emit dust particles when moving on ground
            if (onGround) {
                this.dustEmitter.start();
            }
        } else {
            this.setVelocityX(0);
            this.dustEmitter.stop();
        }

        // Jump with coyote time - can jump if on ground OR recently left ground
        if ((Phaser.Input.Keyboard.JustDown(cursors.space) || Phaser.Input.Keyboard.JustDown(cursors.up))) {
            if ((onGround || canCoyoteJump) && !this.isJumping) {
                this.jump();
            }
        }

        // Visual feedback for jumping/falling
        if (!onGround) {
            if (this.body.velocity.y < 0) {
                // Jumping up - slight squash
                this.setScale(PLAYER_CONFIG.scale * 0.95, PLAYER_CONFIG.scale * 1.05);
            } else {
                // Falling down - slight stretch
                this.setScale(PLAYER_CONFIG.scale * 1.05, PLAYER_CONFIG.scale * 0.95);
            }
        } else {
            // On ground - normal scale with subtle bounce
            const bounce = Math.sin(this.scene.time.now / 100) * 0.02;
            this.setScale(PLAYER_CONFIG.scale, PLAYER_CONFIG.scale + bounce);
        }
    }

    /**
     * Make the player jump
     */
    jump() {
        this.setVelocityY(PLAYER_CONFIG.jumpVelocity);
        this.isJumping = true;
        this.createJumpParticles();
    }

    /**
     * Create particle effect when jumping
     */
    createJumpParticles() {
        const particles = this.scene.add.particles(this.x, this.y + 20, 'treat', {
            speed: { min: 50, max: 100 },
            angle: { min: 45, max: 135 },
            scale: { start: 0.2, end: 0 },
            lifespan: 400,
            quantity: 5,
            tint: COLORS.cloudWhite,
            alpha: { start: 0.6, end: 0 }
        });

        this.scene.time.delayedCall(400, () => {
            particles.destroy();
        });
    }

    /**
     * Play hurt animation
     */
    hurt() {
        this.setTint(0xff0000);

        // Flash effect
        this.scene.tweens.add({
            targets: this,
            alpha: 0.5,
            duration: 100,
            yoyo: true,
            repeat: 3,
            onComplete: () => {
                this.alpha = 1;
            }
        });
    }

    /**
     * Play celebration animation when reaching the bed
     */
    celebrate() {
        this.setVelocityX(0);

        // Bounce with joy
        this.scene.tweens.add({
            targets: this,
            y: this.y - 30,
            duration: 300,
            yoyo: true,
            repeat: 2,
            ease: 'Bounce.easeOut'
        });

        // Create celebration particles
        const particles = this.scene.add.particles(this.x, this.y, 'treat', {
            speed: { min: 100, max: 200 },
            angle: { min: 0, max: 360 },
            scale: { start: 0.3, end: 0 },
            lifespan: 1000,
            frequency: 50,
            tint: [COLORS.gold, COLORS.yellow, COLORS.pink],
            alpha: { start: 1, end: 0 }
        });

        this.scene.time.delayedCall(1000, () => {
            particles.destroy();
        });
    }

    /**
     * Clean up when player is destroyed
     */
    destroy() {
        if (this.dustEmitter) {
            this.dustEmitter.destroy();
        }
        super.destroy();
    }
}
