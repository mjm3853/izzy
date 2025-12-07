import Phaser from 'phaser';
import { GAME_CONFIG, PLAYER_CONFIG, COLORS, SCORE_CONFIG, LEVEL_CONFIG, PLATFORM_CONFIG } from '../config.js';
import { AssetManager } from '../utils/AssetManager.js';
import { Player } from '../entities/Player.js';
import { Treat } from '../entities/Treat.js';
import { Obstacle } from '../entities/Obstacle.js';
import { Bed } from '../entities/Bed.js';

/**
 * Main game scene
 */
export class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });

        this.player = null;
        this.platforms = null;
        this.treats = null;
        this.obstacles = null;
        this.bed = null;
        this.cursors = null;
        this.score = 0;
        this.scoreText = null;
        this.gameWon = false;
        this.clouds = [];
        this.platformData = [];  // Store generated platform positions
    }

    preload() {
        // Assets are created programmatically
    }

    create() {
        // Reset game state
        this.score = 0;
        this.gameWon = false;
        this.platformData = [];  // Clear platform data on restart

        // Create all textures
        AssetManager.createAllTextures(this);

        // Generate platforms first to calculate world size
        this.createPlatforms();

        // Calculate world width based on platforms
        const lastPlatform = this.platformData[this.platformData.length - 1];
        const bedX = lastPlatform.x + PLATFORM_CONFIG.bedOffsetX;
        this.worldWidth = Math.max(GAME_CONFIG.width, bedX + 300);

        // Add ground platform now that we know worldWidth
        const ground = this.add.rectangle(
            this.worldWidth / 2,
            GAME_CONFIG.height - 20,
            this.worldWidth,
            40,
            COLORS.floorWood
        );
        this.platforms.add(ground);

        // Create environment with calculated width
        this.createBackground();

        // Create game objects
        this.player = new Player(this, PLAYER_CONFIG.startX, PLAYER_CONFIG.startY);

        this.treats = [];
        this.createTreats();

        this.obstacles = [];
        this.createObstacles();

        // Place bed relative to last platform (already calculated above)
        this.bed = new Bed(
            this,
            lastPlatform.x + PLATFORM_CONFIG.bedOffsetX,
            lastPlatform.y + PLATFORM_CONFIG.bedOffsetY
        );

        // Setup collisions
        this.setupCollisions();

        // Create UI
        this.createUI();

        // Input
        this.cursors = this.input.keyboard.createCursorKeys();

        // Camera and physics world - use calculated world width for scrolling
        this.physics.world.setBounds(0, 0, this.worldWidth, GAME_CONFIG.height);
        this.cameras.main.setBounds(0, 0, this.worldWidth, GAME_CONFIG.height);
        this.cameras.main.startFollow(this.player, true, 0.1, 0.1);

        // Add decorative elements
        this.createDecorations();
    }

    update() {
        if (this.gameWon) {
            return;
        }

        // Update player
        this.player.update(this.cursors);

        // Update bed
        this.bed.update();
    }

    /**
     * Create layered nighttime bedroom background
     */
    createBackground() {
        // Dark bedroom wall gradient - extend to full world width
        const graphics = this.add.graphics();
        graphics.setDepth(-10);  // Put background behind everything
        graphics.fillGradientStyle(
            COLORS.nightSky, COLORS.nightSky,
            COLORS.darkWall, COLORS.darkWall,
            1
        );
        graphics.fillRect(0, 0, this.worldWidth, GAME_CONFIG.height);

        // Window with moonlight
        const windowX = 200;
        const windowY = 150;

        // Window frame
        this.add.rectangle(windowX, windowY, 140, 180, 0x2a2a2a).setDepth(-9);

        // Window panes (night sky visible)
        this.add.rectangle(windowX - 35, windowY - 45, 60, 80, COLORS.nightSky).setDepth(-9);
        this.add.rectangle(windowX + 35, windowY - 45, 60, 80, COLORS.nightSky).setDepth(-9);
        this.add.rectangle(windowX - 35, windowY + 45, 60, 80, COLORS.nightSky).setDepth(-9);
        this.add.rectangle(windowX + 35, windowY + 45, 60, 80, COLORS.nightSky).setDepth(-9);

        // Moon visible through window
        const moon = this.add.circle(windowX + 25, windowY - 30, 20, COLORS.moonlight);
        moon.setAlpha(0.9);
        moon.setDepth(-9);

        // Moon glow
        const moonGlow = this.add.circle(windowX + 25, windowY - 30, 30, COLORS.moonlight);
        moonGlow.setAlpha(0.2);
        moonGlow.setDepth(-9);

        // Stars through window
        for (let i = 0; i < 15; i++) {
            const star = this.add.circle(
                windowX + Phaser.Math.Between(-60, 60),
                windowY + Phaser.Math.Between(-80, 80),
                Phaser.Math.Between(1, 2),
                COLORS.starYellow
            );
            star.setAlpha(Phaser.Math.FloatBetween(0.5, 1));
            star.setDepth(-9);

            // Twinkling effect
            this.tweens.add({
                targets: star,
                alpha: Phaser.Math.FloatBetween(0.2, 1),
                duration: Phaser.Math.Between(1000, 3000),
                yoyo: true,
                repeat: -1,
                ease: 'Sine.easeInOut'
            });
        }

        // Moonlight beam coming through window
        const lightBeam = this.add.graphics();
        lightBeam.setDepth(-8);
        lightBeam.fillStyle(COLORS.moonlight, 0.08);
        lightBeam.fillTriangle(
            windowX - 40, windowY + 90,
            windowX + 40, windowY + 90,
            windowX + 100, GAME_CONFIG.height - 40
        );

        // Wooden floor - extend to full world width
        const floor = this.add.rectangle(
            this.worldWidth / 2,
            GAME_CONFIG.height - 20,
            this.worldWidth,
            40,
            COLORS.floorWood
        );
        floor.setDepth(-7);

        // Floor planks detail
        const floorDetail = this.add.graphics();
        floorDetail.setDepth(-6);
        floorDetail.lineStyle(2, COLORS.darkWood, 0.5);
        for (let i = 0; i < this.worldWidth; i += 100) {
            floorDetail.lineBetween(i, GAME_CONFIG.height - 40, i, GAME_CONFIG.height);
        }

        // Long carpet/rug across the bedroom floor
        this.add.rectangle(this.worldWidth / 2, GAME_CONFIG.height - 60, this.worldWidth - 200, 80, COLORS.carpet).setDepth(-5);
        this.add.rectangle(this.worldWidth / 2, GAME_CONFIG.height - 60, this.worldWidth - 220, 76, COLORS.carpet).setAlpha(0.7).setDepth(-5);
    }

    /**
     * Create bedroom furniture platforms - dynamically generated
     */
    createPlatforms() {
        this.platforms = this.physics.add.staticGroup();

        // Generate platforms procedurally first
        this.platformData = this.generatePlatformLayout();

        // Ground platform will be created in createBackground after worldWidth is calculated
        // (temporarily create a wide ground that will be replaced)

        // Create the platforms
        this.platformData.forEach(data => {
            this.createFurniturePlatform(data.x, data.y, data.width, data.height);
        });
    }

    /**
     * Procedurally generate platform layout
     * @returns {Array} Array of platform data objects
     */
    generatePlatformLayout() {
        const platforms = [];
        let currentX = PLATFORM_CONFIG.startX;
        let currentY = PLATFORM_CONFIG.startY;

        for (let i = 0; i < PLATFORM_CONFIG.count; i++) {
            // Random platform dimensions
            const width = Phaser.Math.Between(PLATFORM_CONFIG.minWidth, PLATFORM_CONFIG.maxWidth);
            const height = Phaser.Math.Between(PLATFORM_CONFIG.minHeight, PLATFORM_CONFIG.maxHeight);

            // Add the platform
            platforms.push({ x: currentX, y: currentY, width, height });

            // Calculate next platform position
            // Horizontal spacing
            const spacing = Phaser.Math.Between(PLATFORM_CONFIG.minSpacing, PLATFORM_CONFIG.maxSpacing);
            currentX += spacing;

            // Vertical variation (but ensure it's reachable with jump)
            const yChange = Phaser.Math.Between(-PLATFORM_CONFIG.maxYChange, PLATFORM_CONFIG.maxYChange);
            currentY = Phaser.Math.Clamp(
                currentY + yChange,
                PLATFORM_CONFIG.minY,
                PLATFORM_CONFIG.maxY
            );
        }

        return platforms;
    }

    /**
     * Create a furniture-style platform
     */
    createFurniturePlatform(x, y, width, height) {
        // Main furniture surface
        const platform = this.add.rectangle(x, y, width, height, COLORS.dresserWood);
        platform.setStrokeStyle(2, COLORS.darkBrown);
        this.platforms.add(platform);

        // Wood grain texture
        const graphics = this.add.graphics();
        graphics.lineStyle(1, COLORS.darkBrown, 0.2);
        for (let i = 0; i < 4; i++) {
            const lineY = y - height / 2 + (i * height / 3);
            graphics.beginPath();
            graphics.moveTo(x - width / 2 + 5, lineY);
            graphics.lineTo(x + width / 2 - 5, lineY);
            graphics.strokePath();
        }

        // Add highlight for 3D effect
        const highlight = this.add.rectangle(x, y - height / 2 - 2, width - 10, 4, COLORS.darkWood);
        highlight.setAlpha(0.5);
    }

    /**
     * Create treats based on generated platforms
     */
    createTreats() {
        // Place a treat above most platforms (skip some randomly for variety)
        this.platformData.forEach((platform, index) => {
            // 70% chance to place a treat on each platform
            if (Math.random() < 0.7) {
                const treat = new Treat(
                    this,
                    platform.x,
                    platform.y - 50  // 50 pixels above platform
                );
                this.treats.push(treat);
            }
        });

        // Add a few bonus treats in harder-to-reach spots
        const bonusCount = 2;
        for (let i = 0; i < bonusCount; i++) {
            const platformIndex = Phaser.Math.Between(1, this.platformData.length - 2);
            const platform = this.platformData[platformIndex];
            const treat = new Treat(
                this,
                platform.x + Phaser.Math.Between(-80, 80),
                platform.y - Phaser.Math.Between(80, 120)
            );
            this.treats.push(treat);
        }
    }

    /**
     * Create obstacles based on generated platforms
     */
    createObstacles() {
        // Add ground obstacles between platforms
        for (let i = 0; i < this.platformData.length - 1; i++) {
            const currentPlatform = this.platformData[i];
            const nextPlatform = this.platformData[i + 1];

            // 40% chance to place obstacle on ground between platforms
            if (Math.random() < 0.4) {
                const obstacleX = (currentPlatform.x + nextPlatform.x) / 2;
                const obstacle = new Obstacle(
                    this,
                    obstacleX,
                    GAME_CONFIG.height - 45,  // On the ground
                    Phaser.Math.Between(35, 45),
                    20
                );
                this.obstacles.push(obstacle);
            }
        }

        // Occasionally place obstacles on platforms (lower chance)
        this.platformData.forEach((platform, index) => {
            // Skip first and last platforms, 20% chance otherwise
            if (index > 0 && index < this.platformData.length - 1 && Math.random() < 0.2) {
                const obstacle = new Obstacle(
                    this,
                    platform.x + Phaser.Math.Between(-40, 40),
                    platform.y - 20,
                    35,
                    18
                );
                this.obstacles.push(obstacle);
            }
        });
    }

    /**
     * Setup collision handlers
     */
    setupCollisions() {
        this.physics.add.collider(this.player, this.platforms);

        // Setup overlap for each treat
        this.treats.forEach(treat => {
            this.physics.add.overlap(
                this.player,
                treat,
                this.collectTreat,
                null,
                this
            );
        });

        // Setup overlap for each obstacle
        this.obstacles.forEach(obstacle => {
            this.physics.add.overlap(
                this.player,
                obstacle,
                this.hitObstacle,
                null,
                this
            );
        });

        this.physics.add.overlap(
            this.player,
            this.bed,
            this.reachBed,
            null,
            this
        );
    }

    /**
     * Create UI elements
     */
    createUI() {
        // Score display
        this.scoreText = this.add.text(20, 20, 'Treats: 0', {
            fontSize: SCORE_CONFIG.fontSize,
            fill: '#fff',
            fontFamily: SCORE_CONFIG.fontFamily,
            fontStyle: 'bold',
            stroke: '#000',
            strokeThickness: 4,
            shadow: {
                offsetX: 2,
                offsetY: 2,
                color: '#000',
                blur: 4,
                fill: true
            }
        });
        this.scoreText.setScrollFactor(0);

        // Instructions
        const instructions = this.add.text(
            GAME_CONFIG.width / 2,
            60,
            '🌙 Izzy needs to get to bed! 🛏️',
            {
                fontSize: '24px',
                fill: '#E6F2FF',
                fontStyle: 'bold',
                stroke: '#1a1a2e',
                strokeThickness: 4,
                shadow: {
                    offsetX: 2,
                    offsetY: 2,
                    color: '#000',
                    blur: 4,
                    fill: true
                }
            }
        ).setOrigin(0.5);
        instructions.setScrollFactor(0);

        // Controls hint
        const controls = this.add.text(
            GAME_CONFIG.width / 2,
            GAME_CONFIG.height - 30,
            'Arrow Keys: Move • Space/Up: Jump',
            {
                fontSize: '18px',
                fill: '#E6F2FF',
                stroke: '#1a1a2e',
                strokeThickness: 3
            }
        ).setOrigin(0.5);
        controls.setScrollFactor(0);
        controls.setAlpha(0.9);
    }

    /**
     * Create bedroom decorative elements - spread horizontally
     */
    createDecorations() {
        // Night light (small lamp) - near the end
        const nightLight = this.add.circle(1400, 630, 8, 0xFFE4B5);
        nightLight.setAlpha(0.8);

        // Night light glow
        const glow = this.add.circle(1400, 630, 25, 0xFFE4B5);
        glow.setAlpha(0.15);
        this.tweens.add({
            targets: [nightLight, glow],
            alpha: nightLight.alpha * 0.7,
            duration: 2000,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });

        // Toys scattered on floor across the room
        this.add.circle(350, 675, 6, 0xFF6B6B);
        this.add.circle(650, 675, 5, 0x4ECDC4);
        this.add.circle(950, 675, 7, 0xFFE66D);
        this.add.circle(1250, 675, 6, 0x9B59B6);

        // Picture frames on wall - spread out
        this.add.rectangle(600, 200, 80, 60, 0x333333);
        this.add.rectangle(600, 200, 70, 50, 0x555577);

        this.add.rectangle(1100, 200, 80, 60, 0x333333);
        this.add.rectangle(1100, 200, 70, 50, 0x555577);

        // Wall decorations (posters/art)
        this.add.rectangle(400, 180, 60, 80, 0x444455).setAlpha(0.6);
        this.add.rectangle(900, 180, 60, 80, 0x444455).setAlpha(0.6);
        this.add.rectangle(1350, 180, 60, 80, 0x444455).setAlpha(0.6);
    }

    /**
     * Handle treat collection
     */
    collectTreat(player, treat) {
        const points = treat.collect();
        this.score += points;
        this.scoreText.setText('Treats: ' + this.score);
    }

    /**
     * Handle obstacle collision
     */
    hitObstacle(player, obstacle) {
        this.physics.pause();
        this.player.hurt();
        obstacle.hit();

        const gameOverText = this.add.text(
            GAME_CONFIG.width / 2,
            GAME_CONFIG.height / 2,
            'Ouch! Izzy needs to be more careful!',
            {
                fontSize: '42px',
                fill: '#fff',
                fontStyle: 'bold',
                stroke: '#000',
                strokeThickness: 6,
                shadow: {
                    offsetX: 3,
                    offsetY: 3,
                    color: '#000',
                    blur: 5,
                    fill: true
                }
            }
        ).setOrigin(0.5);
        gameOverText.setScrollFactor(0);

        this.time.delayedCall(LEVEL_CONFIG.loseDelay, () => {
            this.scene.restart();
        });
    }

    /**
     * Handle reaching the bed
     */
    reachBed(player, bed) {
        if (this.gameWon) return;

        this.gameWon = true;
        this.player.celebrate();
        this.bed.reached();

        const winText = this.add.text(
            GAME_CONFIG.width / 2,
            GAME_CONFIG.height / 2 - 50,
            '🎉 Izzy made it to her bed! 🛏️',
            {
                fontSize: '48px',
                fill: '#FFD700',
                fontStyle: 'bold',
                stroke: '#000',
                strokeThickness: 6,
                shadow: {
                    offsetX: 3,
                    offsetY: 3,
                    color: '#000',
                    blur: 5,
                    fill: true
                }
            }
        ).setOrigin(0.5);
        winText.setScrollFactor(0);

        const finalScore = this.add.text(
            GAME_CONFIG.width / 2,
            GAME_CONFIG.height / 2 + 30,
            `Treats collected: ${this.score}`,
            {
                fontSize: '32px',
                fill: '#fff',
                fontStyle: 'bold',
                stroke: '#000',
                strokeThickness: 5
            }
        ).setOrigin(0.5);
        finalScore.setScrollFactor(0);

        const restartText = this.add.text(
            GAME_CONFIG.width / 2,
            GAME_CONFIG.height / 2 + 80,
            'Sweet dreams, Izzy! 💤',
            {
                fontSize: '24px',
                fill: '#E6E6FA',
                fontStyle: 'italic',
                stroke: '#000',
                strokeThickness: 4
            }
        ).setOrigin(0.5);
        restartText.setScrollFactor(0);

        this.time.delayedCall(LEVEL_CONFIG.winDelay, () => {
            this.scene.restart();
        });
    }
}
