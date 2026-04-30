import { Enemy } from "../entities/Enemy.js";
import { enemyData } from "../data/enemyData.js";
import { ObjectPooler } from "../utils/ObjectPooler.js";
import { BehaviourFactory } from "../entities/behaviours/BehaviourFactory.js";

export class EnemyManager {
    constructor() {
        this.pools = {};
        const ENEMY_POOL_SIZE = 10;

        // Create a pool of each enemy type using ObjectPooler
        for (const type in enemyData) {
            this.pools[type] = new ObjectPooler(() => {
                const data = enemyData[type];
                const behaviour = BehaviourFactory.create(data.behaviourType);
                return new Enemy(data, behaviour);
            }, ENEMY_POOL_SIZE);
        }
    }

    spawn(type, x, y) {
        const pool = this.pools[type];
        if (!pool) {
            console.warn(`Unknown enemy type: ${type}`);
            return null;
        }

        const enemy = pool.get();
        enemy.spawn(x, y);
        return enemy;
    }

    getActiveEnemies() {
        let enemies = [];
        for (const type in this.pools) {
            enemies.push(...this.pools[type].active)
        }
        return enemies;
    }

    update(dt, player) {
        for (const type in this.pools) {
            this.pools[type].updateAll(dt, player);
        }
    }

    reset() {
        for (const type in this.pools) {
            this.pools[type].releaseAll();
        }
    }
}
