import { getInitialState } from "../state/get-initial-state";
import { GameRenderer } from "./GameRenderer";
import { initKeyboardEvents } from "./keyboard-events";
import { gameReducer } from "../reducers/game.reducer";
import { GameEvent } from "../types/GameEvent";
import { GameState } from "../types/GameState";
import { getHighScore, setHighScore } from "../utils/score";

export class Game {
    state: GameState;
    renderer: GameRenderer;
    lastTimestamp: number;
    scoreContainer: HTMLElement;
    highScore: number;

    constructor() {
        this.state = getInitialState();
        this.renderer = new GameRenderer();
        this.lastTimestamp = 0;
        this.highScore = getHighScore();

        this.scoreContainer = document.createElement("div");
        this.scoreContainer.id = "bottom-text";
        document.body.appendChild(this.scoreContainer);
    }

    start() {
        initKeyboardEvents(this);
        requestAnimationFrame(this.update.bind(this));
    }

    dispatch(event: GameEvent) {
        this.state = gameReducer(this.state, event);
    }

    private update(timestamp: number) {
        requestAnimationFrame(this.update.bind(this));
        const ellapsedMs = timestamp - this.lastTimestamp;

        this.lastTimestamp = timestamp;

        this.dispatch({
            type: "Update",
            ellapsedMs
        });
        this.renderer.render(this.state);

        this.updateHighScore();
        this.updateBottomText();
    }

    private updateHighScore() {
        if (this.state.gameOver && this.state.score > this.highScore) {
            this.highScore = Math.floor(this.state.score);
            setHighScore(this.highScore);
        }
    }

    private updateBottomText() {
        const text = `Cubes: ${this.state.deletions}\tScore: ${Math.floor(this.state.score)}\tHigh Score: ${this.highScore}`;
        this.scoreContainer.innerHTML = text;
    }
}