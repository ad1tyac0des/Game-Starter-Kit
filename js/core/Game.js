import { GAME_WIDTH, GAME_HEIGHT } from "./constants.js";
import { RenderSystem } from "../systems/RenderSystem.js";
import { Player } from "../entities/Player.js";
import { ImageManager } from "../managers/ImageManager.js";

export class Game {
    constructor() {
        this.canvas = document.getElementById("gameCanvas");
        this.ctx = this.canvas.getContext("2d");

        this.imageManager = new ImageManager();
        this.imageManager.loadAll();

        this.renderSystem = new RenderSystem(this.canvas, this.imageManager);
        this.player = new Player();
        this.keys = {};
        this.lastTime = 0;
        this.state = "menu";

        this.init();
    }

    init() {
        this.resizeCanvas();
        window.addEventListener("resize", () => this.resizeCanvas());
        this.setupInput();
        this.setupUI();

        // start game loop
        this.lastTime = performance.now();
        requestAnimationFrame((t) => this.gameLoop(t));
    }

    gameLoop(timestamp) {
        // cap dt to prevent big jumps
        const dt = Math.min((timestamp - this.lastTime) / 1000, 0.1);
        // console.log(dt);
        this.lastTime = timestamp;

        this.update(dt);
        this.render();
        requestAnimationFrame((t) => this.gameLoop(t));
    }

    update(dt) {
        if (this.state !== "playing") return;

        this.player.update(dt, this.keys);
    }

    render() {
        if (this.state === "menu") {
            this.ctx.fillStyle = "#fffbed";
            this.ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT)
        } else {
            this.renderSystem.render(this.player);
        }
    }

    setupInput() {
        // key down
        window.addEventListener(
            "keydown",
            (e) => (this.keys[e.key.toLowerCase()] = true),
        );

        // key up
        window.addEventListener(
            "keyup",
            (e) => (this.keys[e.key.toLowerCase()] = false),
        );

        // clear all keys when context menu appears
        window.addEventListener("contextmenu", () => (this.keys = {}));

        // clear all keys when when window loses focus
        window.addEventListener("blur", () => (this.keys = {}));
    }

    setupUI() {
        document.getElementById("playBtn").onclick = () => this.startGame();
    }

    hideAllPanels() {
        document.querySelectorAll(".ui-panel").forEach(p => p.classList.remove("active"));
    }

    startGame() {
        this.state = "playing";
        this.hideAllPanels();
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
}
