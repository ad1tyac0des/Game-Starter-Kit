import { GAME_WIDTH, GAME_HEIGHT } from "./constants.js";
import { RenderSystem } from "../systems/RenderSystem.js";
import { Player } from "../entities/Player.js";

export class Game {
    constructor() {
        this.canvas = document.getElementById("gameCanvas");
        this.ctx = this.canvas.getContext("2d");
        this.renderSystem = new RenderSystem(this.canvas);
        this.player = new Player();
        this.keys = {};

        this.init();
    }

    init() {
        this.resizeCanvas();
        window.addEventListener("resize", () => this.resizeCanvas());
        this.setupInput();

        // Start game loop
        requestAnimationFrame((t) => this.gameLoop(t));
    }

    update() {
        this.player.update(this.keys);
    }

    gameLoop(timestamp) {
        this.update();
        this.renderSystem.render(this.player);
        requestAnimationFrame((t) => this.gameLoop(t));
    }


    resizeCanvas() {
        const ratio = 16 / 9;
        let w, h;
        const margin = 15;

        const availableWidth = window.innerWidth - margin * 2;
        const availableHeight = window.innerHeight - margin * 2;

        if (availableWidth / availableHeight > ratio) {
            h = availableHeight;
            w = h * ratio;
        } else {
            w = availableWidth;
            h = w / ratio;
        }

        this.canvas.width = GAME_WIDTH;
        this.canvas.height = GAME_HEIGHT;

        this.canvas.style.width = `${w}px`;
        this.canvas.style.height = `${h}px`;
        this.canvas.style.margin = `${margin}px`;
    }

    setupInput() {
        // key down
        window.addEventListener("keydown", (e) => (this.keys[e.key.toLowerCase()] = true));

        // key up
        window.addEventListener("keyup", (e) => (this.keys[e.key.toLowerCase()] = false));
    }
}
