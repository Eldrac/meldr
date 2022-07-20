import { getHeightMap } from "../state/get-height-map";
import { GameState } from "../types/GameState";
import { BOARD_HEIGHT, BOARD_WIDTH } from "../utils/constants";

export function rotateRightReducer(state: GameState): GameState {
    const { activeCubes } = state;
    if (activeCubes.length < 3) {
        return state;
    }

    const isVertical = activeCubes[0].x === activeCubes[1].x;

    if (isVertical && (activeCubes[1].x === 0 || activeCubes[1].x === BOARD_WIDTH - 1)) {
        return state;
    }

    // Still at top of board...
    if (activeCubes[1].y >= BOARD_HEIGHT) {
        if (isVertical) {
            return {
                ...state,
                activeCubes: [{
                    ...activeCubes[2],
                    y: BOARD_HEIGHT,
                    x: activeCubes[2].x - 1
                }, {
                    ...activeCubes[1],
                    y: BOARD_HEIGHT
                }, {
                    ...activeCubes[0],
                    y: BOARD_HEIGHT,
                    x: activeCubes[0].x + 1
                }]
            };
        }
        return {
            ...state,
            activeCubes: [{
                ...activeCubes[0],
                y: BOARD_HEIGHT + 2,
                x: activeCubes[1].x
            }, {
                ...activeCubes[1],
                y: BOARD_HEIGHT + 1
            }, {
                ...activeCubes[2],
                y: BOARD_HEIGHT,
                x: activeCubes[1].x
            }]
        };
    }


    const heights = getHeightMap(state, true);
    if (isVertical) {
        if (heights[activeCubes[1].x - 1] >= activeCubes[1].y ||
            heights[activeCubes[1].x + 1] >= activeCubes[1].y) {
            return state;
        }

        return {
            ...state,
            activeCubes: [{
                ...activeCubes[2],
                y: activeCubes[1].y,
                x: activeCubes[1].x - 1
            }, {
                ...activeCubes[1]
            }, {
                ...activeCubes[0],
                y: activeCubes[1].y,
                x: activeCubes[1].x + 1
            }]
        }
    }


    if (heights[activeCubes[1].x] >= activeCubes[1].y - 1) {
        return state;
    }

    return {
        ...state,
        activeCubes: [{
            ...activeCubes[0],
            y: activeCubes[1].y + 1,
            x: activeCubes[1].x
        },{
            ...activeCubes[1]
        },{
            ...activeCubes[2],
            y: activeCubes[1].y - 1,
            x: activeCubes[1].x
        }]
    }
}