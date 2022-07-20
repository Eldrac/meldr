import { getInitialState } from "../state/get-initial-state";
import { GameState } from "../types/GameState";

export function resetReducer(state: GameState) {
    if (!state.gameOver) {
        return state;
    }
    
    return getInitialState();
}