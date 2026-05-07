import { GAME_WIDTH, GAME_HEIGHT, GRID_SIZE, GAME_STATES } from "../core/constants.js";

export class RenderSystem {
    constructor(canvas, imageManager) {
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");
        this.ctx.imageSmoothingEnabled = false;
        this.imageManager = imageManager;
    }

    render(state, player, enemies = []) {
        if (state === GAME_STATES.MENU) {
            this.renderMenuBackground();
        } else {
            this.ctx.fillStyle = "#114483";
            this.ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

            this.renderGrid();
            this.renderEnemies(enemies);
            this.renderPlayer(player);
        }
    }

    renderGrid() {
        this.ctx.strokeStyle = "rgba(255, 255, 255, .2)";
        this.ctx.lineWidth = 1;
        this.ctx.beginPath();

        // Vertical lines
        for (let i = 0; i < GAME_WIDTH; i += GRID_SIZE) {
            this.ctx.moveTo(i, 0);
            this.ctx.lineTo(i, GAME_HEIGHT);
        }

        // Horizontal lines
        for (let i = 0; i < GAME_HEIGHT; i += GRID_SIZE) {
            this.ctx.moveTo(0, i);
            this.ctx.lineTo(GAME_WIDTH, i);
        }
        this.ctx.stroke();
    }

    renderEnemies(enemies) {
        for (const enemy of enemies) {
            const enemyImage = this.imageManager.get(enemy.data.image);
            
            if (enemyImage) {
                this.ctx.save();
                if (enemy.facingLeft) {
                    this.ctx.translate(enemy.x + enemy.width, enemy.y);
                    this.ctx.scale(-1, 1);
                    this.ctx.drawImage(enemyImage, 0, 0, enemy.width, enemy.height);
                } else {
                    this.ctx.drawImage(enemyImage, enemy.x, enemy.y, enemy.width, enemy.height);
                }
                this.ctx.restore();
            } else {
                // fallback
                this.ctx.fillStyle = enemy.data.color;
                this.ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
            }
        }
    }

    renderPlayer(player) {
        const playerImage = this.imageManager.get("player");

        if (playerImage) {
            this.ctx.save();
            if (player.facingLeft) {
                this.ctx.translate(player.x + player.width, player.y);
                this.ctx.scale(-1, 1);
                this.ctx.drawImage(playerImage, 0, 0, player.width, player.height);
            } else {
                this.ctx.drawImage(playerImage, player.x, player.y, player.width, player.height);
            }
            this.ctx.restore();
        } else {
            // fallback
            this.ctx.fillStyle = "#1a1a2e";
            this.ctx.fillRect(player.x, player.y, player.width, player.height);
            this.ctx.strokeStyle = "white";
            this.ctx.lineWidth = 2;
            this.ctx.strokeRect(player.x, player.y, player.width, player.height);
        }
    }

    renderMenuBackground() {
        this.ctx.fillStyle = "#fffbed";
        this.ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
    }
}
