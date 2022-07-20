import { GameState } from "../types/GameState";
import { getFallDelay } from "../utils/timers";
import { createActiveCubes } from "./create-active-cubes";

export function getInitialState(): GameState {
    return {
        deletions: 0,
        score: 0,

        activeCubes: createActiveCubes(),
        fallingCubes: [],
        stableCubes: [],

        gameOver: false,
        holdingDown: false,
        fallDelay: getFallDelay(0)
    };
}
