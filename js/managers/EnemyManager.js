import { Enemy } from "../entities/Enemy.js";
import { enemyData } from "../data/enemyData.js";
import { ObjectPooler } from "../utils/ObjectPooler.js";

export class EnemyManager {
    constructor() {
        const ENEMY_POOL_SIZE = 10;

        // Create a pool of enemies using ObjectPooler
        this.pool = new ObjectPooler(() => {
            return new Enemy(enemyData.drifter);
        }, ENEMY_POOL_SIZE);
    }

    spawn(x, y) {
        const enemy = this.pool.get();
        enemy.spawn(x, y);
        return enemy;
    }

    getActiveEnemies() {
        return this.pool.active;
    }

    update(dt, player) {
        this.pool.updateAll(dt, player);
    }

    reset() {
        this.pool.releaseAll();
    }
}
