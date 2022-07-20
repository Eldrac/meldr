import { GameEvent } from "../types/GameEvent";
import { GameState } from "../types/GameState";
import { moveLeftReducer, moveRightReducer } from "./move.reducer";
import { resetReducer } from "./reset.reducer";
import { rotateLeftReducer, rotateRightReducer } from "./rotate.reducer";
import { toggleDownReducer } from "./toggle-down.reducer";
import { updateReducer } from "./update.reducer";

export function gameReducer(state: GameState, event: GameEvent): GameState {
    switch (event.type) {
        case "Update":
            return updateReducer(state, event);
        case "ToggleDown":
            return toggleDownReducer(state, event);
        case "MoveRight":
            return moveRightReducer(state);
        case "MoveLeft":
            return moveLeftReducer(state);
        case "RotateRight":
            return rotateRightReducer(state);
        case "RotateLeft":
            return rotateLeftReducer(state);
        case "Reset":
            return resetReducer(state);
    }
}