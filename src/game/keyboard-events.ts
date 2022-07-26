import { Game } from "./Game";
import { GameEvent } from "../types/GameEvent";

const Keybinds = {
    UP: "ArrowUp" as const,
    DOWN: "ArrowDown" as const,
    RIGHT: "ArrowRight" as const,
    LEFT: "ArrowLeft" as const,
    W: "w" as const,
    A: "a" as const,
    S: "s" as const,
    D: "d" as const,
    RESET: " " as const
};

export function initKeyboardEvents(game: Game) {
    window.addEventListener("keydown", (event) => onKeyDown(event.key, game));
    window.addEventListener("keyup", (event) => onKeyUp(event.key, game));
}

function onKeyDown(key: string, game: Game) {
    const keybindToEvent: { [key: string]: GameEvent } = {
        [Keybinds.DOWN]: { type: "ToggleDown", toggle: true },
        [Keybinds.RIGHT]: { type: "MoveRight" },
        [Keybinds.LEFT]: { type: "MoveLeft" },
        [Keybinds.UP]: { type: "RotateRight" },
        [Keybinds.RESET]: { type: "Reset" },
        [Keybinds.W]: { type: "RotateRight" },
        [Keybinds.A]: { type: "MoveLeft" },
        [Keybinds.S]: { type: "ToggleDown", toggle: true },
        [Keybinds.D]: { type: "MoveRight" },
    };

    if (key in keybindToEvent) {
        game.dispatch(keybindToEvent[key]);
    }
}

function onKeyUp(key: string, game: Game) {
    if (key === Keybinds.DOWN || key == Keybinds.S) {
        game.dispatch({
            type: "ToggleDown",
            toggle: false
        });
    }
}