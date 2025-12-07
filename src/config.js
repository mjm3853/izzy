/**
 * Game configuration and constants
 */

export const GAME_CONFIG = {
    width: 1600,  // Wider for more horizontal gameplay
    height: 700,
    gravity: 600,  // Reduced gravity for floatier, easier jumps
    debug: false
};

export const PLAYER_CONFIG = {
    speed: 280,  // Faster horizontal movement
    jumpVelocity: -350,  // Lower jump for easier platforming
    bounce: 0.05,  // Less bounce for more control
    scale: 1,
    startX: 80,
    startY: 600
};

export const COLORS = {
    // Nighttime bedroom environment
    nightSky: 0x1a1a2e,
    darkWall: 0x2d2d44,
    floorWood: 0x4a3728,
    darkWood: 0x3a2718,
    carpet: 0x5a4a3a,

    // Furniture colors
    platformBrown: 0x6b4423,
    darkBrown: 0x4a2f1a,
    dresserWood: 0x5a3a20,

    // Izzy colors
    tan: 0xD2B48C,
    lightTan: 0xE6D5B8,
    darkTan: 0xB89968,
    white: 0xFFFFFF,
    black: 0x000000,
    pink: 0xFFB6C1,

    // Game objects
    treatColor: 0xFFE4B5,
    obstacleRed: 0xFF0000,
    bedBrown: 0x8B4513,
    beddingLavender: 0xE6E6FA,

    // Nighttime effects
    moonlight: 0xE6F2FF,
    starYellow: 0xFFF9B0,
    softGlow: 0x4d5f8e,
    gold: 0xFFD700,

    // UI
    cloudWhite: 0xF0F0F0
};

export const SCORE_CONFIG = {
    treatValue: 10,
    fontSize: '28px',
    fontFamily: 'Arial, sans-serif'
};

export const LEVEL_CONFIG = {
    winDelay: 3000,
    loseDelay: 2000
};

export const PLATFORM_CONFIG = {
    // Number of platforms to generate
    count: 8,

    // Platform dimensions
    minWidth: 130,
    maxWidth: 180,
    minHeight: 25,
    maxHeight: 35,

    // Horizontal spacing between platforms
    minSpacing: 150,
    maxSpacing: 250,

    // Vertical positioning
    minY: 480,  // Highest platform can be
    maxY: 600,  // Lowest platform can be
    maxYChange: 60,  // Max vertical change between consecutive platforms

    // Start position for first platform
    startX: 200,
    startY: 600,

    // Bed position (relative to last platform)
    bedOffsetX: 180,
    bedOffsetY: -20
};
