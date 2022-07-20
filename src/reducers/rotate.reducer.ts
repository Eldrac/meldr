import { GameState } from "../types/GameState";

export function rotateRightReducer(state: GameState) {
    return {
        ...state,
        activeCubes: state.activeCubes.map((cube, i, cubes) => ({
            ...cube,
            color: cubes[(i + cubes.length - 1) % cubes.length].color
        }))
    };
}

export function rotateLeftReducer(state: GameState) {
    return {
        ...state,
        activeCubes: state.activeCubes.map((cube, i, cubes) => ({
            ...cube,
            color: cubes[(i + 1) % cubes.length].color
        }))
    };
}