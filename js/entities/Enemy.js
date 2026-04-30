import { GAME_WIDTH, GAME_HEIGHT, ENEMY_DESPAWN_MARGIN } from "../core/constants.js";

export class Enemy {
    constructor(data, behaviour) {
        this.data = data;
        this.behaviour = behaviour;

        // Position and dimensions
        this.x = 0;
        this.y = 0;
        this.width = data.width;
        this.height = data.height;

        // Stats
        this.speed = data.speed;
        this.health = data.health;
        this.damage = data.damage;
        this.collisionRadius = data.collisionRadius;

        this.active = false;
    }

    spawn(x, y) {
        this.x = x;
        this.y = y;
        this.health = this.data.health;
        this.active = true;
    }

    reset() {
        this.active = false;
        this.health = this.data.health;

        if (this.behaviour.reset) {
            this.behaviour.reset();
        }
    }

    update(dt, player) {
        if (!this.active) return;

        // Despawn if out of bounds
        if (this.x < -ENEMY_DESPAWN_MARGIN ||
            this.x > GAME_WIDTH + ENEMY_DESPAWN_MARGIN ||
            this.y < -ENEMY_DESPAWN_MARGIN ||
            this.y > GAME_HEIGHT + ENEMY_DESPAWN_MARGIN
        ) {
            this.active = false;
            return;
        }

        this.behaviour.update(this, dt, player);
    }
}