import { GAME_WIDTH, GAME_HEIGHT, ENEMY_SPAWN_MARGIN, ENEMY_SPAWN_INTERVAL } from "../core/constants.js";
import { enemyData } from "../data/enemyData.js";

export class EnemySpawner {
    constructor(enemyManager) {
        this.enemyManager = enemyManager;
        this.spawnTimer = 0;
        this.spawnInterval = ENEMY_SPAWN_INTERVAL;

        // Cache enemy types from data
        this.enemyTypes = [];
        for (const type in enemyData) {
            this.enemyTypes.push(type);
        }
    }

    update(dt) {
        this.spawnTimer += dt;
        if (this.spawnTimer >= this.spawnInterval) {
            this.spawnWave();
            this.spawnTimer = 0;
        }
    }

    spawnWave() {
        const type = this.enemyTypes[Math.floor(Math.random() * this.enemyTypes.length)];

        // randomly select an edge to spawn from
        const edge = Math.floor(Math.random() * 4);
        let x, y;
        switch(edge) {
            // TOP
            case 0: 
                x = Math.random() * GAME_WIDTH;
                y = -ENEMY_SPAWN_MARGIN; 
                break;
            // RIGHT
            case 1:
                x = GAME_WIDTH + ENEMY_SPAWN_MARGIN;
                y = Math.random() * GAME_HEIGHT;
                break;
            // BOTTOM
            case 2: 
                x = Math.random() * GAME_WIDTH;
                y = GAME_HEIGHT + ENEMY_SPAWN_MARGIN;
                break;
            // LEFT
            case 3:
                x = -ENEMY_SPAWN_MARGIN;
                y = Math.random() * GAME_HEIGHT;
                break;
        }

        this.enemyManager.spawn(type, x, y)
    }

    reset() {
        this.spawnTimer = 0;
    }
}