import { GAME_HEIGHT, GAME_WIDTH } from "../core/constants.js";

export class Player {
    constructor() {
        this.width = 64;
        this.height = 170;
        this.x = (GAME_WIDTH - this.width) / 2;
        this.y = (GAME_HEIGHT - this.height) / 2;
        this.speed = 300;

        // Multipliers (for upgrades)
        this.speedMultiplier = 1;
    }

    reset() {
        this.x = (GAME_WIDTH - this.width) / 2;
        this.y = (GAME_HEIGHT - this.height) / 2;
        this.speedMultiplier = 1;
    }

    update(dt, keys) {
        let dx = 0,
            dy = 0;

        if (keys["w"] || keys["arrowup"]) dy -= 1;
        if (keys["s"] || keys["arrowdown"]) dy += 1;
        if (keys["a"] || keys["arrowleft"]) dx -= 1;
        if (keys["d"] || keys["arrowright"]) dx += 1;

        if (dx || dy) {
            // normalize diagonal vector
            const len = Math.sqrt(dx * dx + dy * dy);
            dx /= len;
            dy /= len;

            this.x += dx * this.speed * this.speedMultiplier * dt;
            this.y += dy * this.speed * this.speedMultiplier * dt;
        }

        // keep player in bounds
        this.x = Math.max(0, Math.min(GAME_WIDTH - this.width, this.x));
        this.y = Math.max(0, Math.min(GAME_HEIGHT - this.height, this.y));
    }
}
