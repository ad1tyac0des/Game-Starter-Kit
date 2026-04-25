import { GAME_WIDTH, GAME_HEIGHT, ASPECT_RATIO, CANVAS_MARGIN, GAME_STATES } from "./constants.js";
import { RenderSystem } from "../systems/RenderSystem.js";
import { Player } from "../entities/Player.js";
import { ImageManager } from "../managers/ImageManager.js";
import { AudioManager } from "../managers/AudioManager.js";
import { UIManager } from "../managers/UIManager.js";
import { EnemyManager } from "../managers/EnemyManager.js";

export class Game {
    constructor() {
        this.canvas = document.getElementById("gameCanvas");

        this.imageManager = new ImageManager();
        this.audioManager = new AudioManager();
        this.uiManager = new UIManager(this);
        this.enemyManager = new EnemyManager();

        this.renderSystem = new RenderSystem(this.canvas, this.imageManager);
        this.player = new Player();
        this.keys = {};
        this.lastTime = 0;
        this.time = 0;
        this.state = GAME_STATES.MENU;

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
        // cap dt to prevent big jumps
        const dt = Math.min((timestamp - this.lastTime) / 1000, 0.1);
        this.lastTime = timestamp;

        if (this.state === GAME_STATES.PLAYING) {
            this.time += dt;
            this.uiManager.updateTimer(this.time);
        }

        this.update(dt);
        this.renderSystem.render(this.state, this.player, this.enemyManager.getActiveEnemies());
        requestAnimationFrame((t) => this.gameLoop(t));
    }

    update(dt) {
        if (this.state !== GAME_STATES.PLAYING) return;

        this.player.update(dt, this.keys);
        this.enemyManager.update(dt, this.player);
    }

    setupInput() {
        // key down
        window.addEventListener("keydown", (e) => {
            this.keys[e.key.toLowerCase()] = true;

            // toggle pause on Escape
            if (e.key === "Escape") {
                if (this.state === GAME_STATES.PLAYING) {
                    this.pause();
                } else if (this.state === GAME_STATES.PAUSED) {
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
        this.state = GAME_STATES.PLAYING;
        this.uiManager.hideAllPanels();
        this.uiManager.showTimer();
        this.playSound("button_click");

        // Reset
        this.player.reset();
        this.enemyManager.reset();
        this.lastTime = performance.now();
        this.time = 0;

        this.enemyManager.spawn(100, 100);
        this.enemyManager.spawn(900, 50);
        this.enemyManager.spawn(200, 150);
        this.enemyManager.spawn(1000, 600);
        this.enemyManager.spawn(700, 400);
    }

    pause() {
        this.state = GAME_STATES.PAUSED;
        this.uiManager.showPanel("pauseMenu");
        this.playSound("pause");
    }

    resume() {
        this.state = GAME_STATES.PLAYING;
        this.uiManager.hideAllPanels();
        this.playSound("unpause");
    }

    returnToMenu() {
        this.state = GAME_STATES.MENU;
        this.uiManager.showPanel("mainMenu");
        this.uiManager.hideTimer();
        this.playSound("button_click");
    }
    
    playSound(name) {
        this.audioManager.play(name);
    }

    resizeCanvas() {
        let w, h;

        const availableWidth = window.innerWidth - CANVAS_MARGIN * 2;
        const availableHeight = window.innerHeight - CANVAS_MARGIN * 2;

        if (availableWidth / availableHeight > ASPECT_RATIO) {
            h = availableHeight;
            w = h * ASPECT_RATIO;
        } else {
            w = availableWidth;
            h = w / ASPECT_RATIO;
        }

        this.canvas.width = GAME_WIDTH;
        this.canvas.height = GAME_HEIGHT;

        this.canvas.style.width = `${w}px`;
        this.canvas.style.height = `${h}px`;
        this.canvas.style.margin = `${CANVAS_MARGIN}px`;
    }
}
