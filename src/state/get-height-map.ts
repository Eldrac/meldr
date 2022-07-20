import { GameState } from "../types/GameState";
import { BOARD_WIDTH } from "../utils/constants";

export function getHeightMap(state: GameState, includeFalling = false) {
    const heights = new Array(BOARD_WIDTH).fill(0);

    const cubes = [...state.stableCubes];
    if (includeFalling) {
        cubes.push(...state.fallingCubes);
    }

    for (const cube of cubes) {
        const y = cube.y + 1;

        if (heights[cube.x] < y) {
            heights[cube.x] = y;
        }
    }

    return heights;
}