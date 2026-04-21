import { GAME_WIDTH, GAME_HEIGHT } from "./constants.js";
import { RenderSystem } from "../systems/RenderSystem.js";
import { Player } from "../entities/Player.js";
import { ImageManager } from "../managers/ImageManager.js";
import { AudioManager } from "../managers/AudioManager.js";
import { UIManager } from "../managers/UIManager.js";

export class Game {
    constructor() {
        this.canvas = document.getElementById("gameCanvas");

        this.imageManager = new ImageManager();
        this.audioManager = new AudioManager();
        this.uiManager = new UIManager(this);

        this.renderSystem = new RenderSystem(this.canvas, this.imageManager);
        this.player = new Player();
        this.keys = {};
        this.lastTime = 0;
        this.time = 0;
        this.state = "menu";

        this.init();
    }

    async init() {
        await Promise.all([
            this.imageManager.loadAll(),
            this.audioManager.loadAll(),
        ]);

        // showPanel: first hides all panels(will hide loading panel), then shows mainMenu
        this.uiManager.showPanel("mainMenu");

        this.resizeCanvas();
        window.addEventListener("resize", () => this.resizeCanvas());
        this.setupInput();

        // start game loop
        this.lastTime = performance.now();
        requestAnimationFrame((t) => this.gameLoop(t));
    }

    gameLoop(timestamp) {
        if (this.lastTime === 0) {
            this.lastTime = timestamp;
        }
        // cap dt to prevent big jumps
        const dt = Math.min((timestamp - this.lastTime) / 1000, 0.1);
        this.lastTime = timestamp;

        if (this.state === "playing") {
            this.time += dt;
            this.uiManager.updateTimer(this.time);
        }

        this.update(dt);
        this.renderSystem.render(this.state, this.player);
        requestAnimationFrame((t) => this.gameLoop(t));
    }

    update(dt) {
        if (this.state !== "playing") return;

        this.player.update(dt, this.keys);
    }

    setupInput() {
        // key down
        window.addEventListener("keydown", (e) => {
            this.keys[e.key.toLowerCase()] = true;

            // toggle pause on Escape
            if (e.key === "Escape") {
                if (this.state === "playing") {
                    this.pause();
                } else if (this.state === "paused") {
                    this.resume();
                }
            }
        });

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

    startGame() {
        this.state = "playing";
        this.uiManager.hideAllPanels();
        this.uiManager.showTimer();
        this.audioManager.play("button_click");

        // Reset
        this.player.reset();
        this.lastTime = performance.now();
        this.time = 0;
    }

    pause() {
        this.state = "paused";
        this.uiManager.showPanel("pauseMenu");
        this.audioManager.play("pause");
    }

    resume() {
        this.state = "playing";
        this.uiManager.hideAllPanels();
        this.audioManager.play("unpause");
    }

    returnToMenu() {
        this.state = "menu";
        this.uiManager.showPanel("mainMenu");
        this.uiManager.hideTimer();
        this.audioManager.play("button_click");
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
