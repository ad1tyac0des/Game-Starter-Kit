export class UIManager {
    constructor(game) {
        this.game = game;

        this.setupEventListeners();
    }

    setupEventListeners() {
        document.getElementById("playBtn").addEventListener("click", () => {
            this.game.startGame();
        });

        document.getElementById("resumeBtn").addEventListener("click", () => {
            this.game.resume();
        });

        document.getElementById("quitBtn").addEventListener("click", () => {
            this.game.returnToMenu();
        });

        document.querySelectorAll("button").forEach((btn) => {
            btn.addEventListener("mouseenter", () => {
                this.game.audioManager.play("button_hover");
            });
        });
    }

    hideAllPanels() {
        document
            .querySelectorAll(".ui-panel")
            .forEach((p) => p.classList.remove("active"));
    }

    showPanel(panelId){
        this.hideAllPanels();
        document.getElementById(panelId).classList.add("active");
    }
}
