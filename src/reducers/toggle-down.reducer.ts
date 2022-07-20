import { ToggleDownEvent } from "../types/GameEvent";
import { GameState } from "../types/GameState";

export function toggleDownReducer(state: GameState, event: ToggleDownEvent): GameState {
    const { toggle } = event;
    
    return {
        ...state,
        holdingDown: toggle
    };
}
