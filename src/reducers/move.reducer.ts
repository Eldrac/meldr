import { BOARD_WIDTH } from "../utils/constants";
import { getHeightMap } from "../state/get-height-map";
import { Cube } from "../types/Cube";
import { GameState } from "../types/GameState";

export function moveRightReducer(state: GameState) {
    return moveReducer(state, x => x + 1);
}

export function moveLeftReducer(state: GameState) {
    return moveReducer(state, x => x - 1);
}

function moveReducer(state: GameState, updateX: (x:number) => number) {
    if (state.gameOver) {
        return state;
    }

    const heightMap = getHeightMap(state, true);
    const activeCubes = [] as Cube[];
    for (let cube of state.activeCubes) {
        const x = updateX(cube.x);
        if (x < 0 || x >= BOARD_WIDTH || cube.y < heightMap[x]) {
            return state;
        }

        activeCubes.push({
            ...cube,
            x
        });
    }

    return {
        ...state,
        activeCubes
    };
}