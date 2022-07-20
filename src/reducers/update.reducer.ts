import { BOARD_HEIGHT, DEFAULT_FALL_SPEED } from "../utils/constants";
import { detectClusters } from "../state/detect-clusters";
import { Cube } from "../types/Cube";
import { UpdateEvent } from "../types/GameEvent";
import { GameState } from "../types/GameState";
import { createActiveCubes } from "../state/create-active-cubes";
import { getHeightMap } from "../state/get-height-map";
import { getFadeDelay, getFallDelay, getFallSpeed } from "../utils/timers";

export function updateReducer(state: GameState, event: UpdateEvent): GameState {
    if (state.gameOver) {
        return state;
    }

    let newState = updateScore(state, event);
    newState = updateActiveCubes(newState, event);
    newState = updateFallingCubes(newState, event);
    newState = updateCubeFading(newState, event);

    return newState;
}

function updateScore(state: GameState, { ellapsedMs }: UpdateEvent): GameState  {
    if (!state.holdingDown) {
        return state;
    }

    return {
        ...state,
        score: state.score + ellapsedMs / 100
    };
}

function updateActiveCubes(state: GameState, { ellapsedMs }: UpdateEvent): GameState  {
    if (!state.activeCubes.length && !state.fallingCubes.length) {
        return {
            ...state,
            fallDelay: getFallDelay(state.deletions),
            activeCubes: createActiveCubes()
        };
    }


    if (state.fallDelay > 0 && !state.holdingDown) {
        return {
            ...state,
            fallDelay: state.fallDelay - ellapsedMs
        };
    }

    const heights = getHeightMap(state);

    let activeCubes: Cube[] = [];
    const fallingCubes = [...state.fallingCubes];
    const stableCubes = [...state.stableCubes];

    let stabalized = false;
    
    for (const cube of state.activeCubes) {
        const speed = state.holdingDown ? DEFAULT_FALL_SPEED : getFallSpeed(state.deletions);
        const y = cube.y - (ellapsedMs / speed);

        const colMax = heights[cube.x];
        if (y <= colMax) {
            if (y >= BOARD_HEIGHT - 1) {
                return {
                    ...state,
                    gameOver: true
                };
            }

            stabalized = true;
            stableCubes.push({
                ...cube,
                y: colMax
            });
        } else {
            activeCubes.push({
                ...cube,
                y
            });
        }
    }

    if (stabalized) {
        fallingCubes.push(...activeCubes);
        activeCubes = [];
    }

    return {
        ...state,
        fallDelay: 0,
        activeCubes,
        fallingCubes,
        stableCubes
    };
}

function updateFallingCubes(state: GameState, { ellapsedMs }: UpdateEvent): GameState  {

    const heights = getHeightMap(state);
    const stableCubes: Cube[] = [...state.stableCubes];
    const fallingCubes: Cube[] = [];

    for (const cube of state.fallingCubes) {
        const y = cube.y - ellapsedMs / DEFAULT_FALL_SPEED;
        const colMax = heights[cube.x];
        if (y <= colMax) {
            stableCubes.push({
                ...cube,
                y: colMax
            });
        } else {
            fallingCubes.push({
                ...cube,
                y
            });
        }
    }

    return {
        ...state,
        fallingCubes,
        stableCubes
    };
}

function updateCubeFading(state: GameState, { ellapsedMs }: UpdateEvent): GameState  {
    const clusters = detectClusters(state);

    const cubes = [] as Cube[];
    const faded = [] as Cube[];
    let score = state.score;
    for (const cluster of clusters) {
        const fading = cluster.length > 3;
        const refreshTimer = fading && cluster.some(cube => cube.startFadeDelay === undefined);

        let clusterFaded = false;
        for (const cube of cluster) {
            let startFadeDelay = cube.startFadeDelay;
            let fadeDelay = cube.fadeDelay;

            if (refreshTimer) {
                startFadeDelay = getFadeDelay(cluster.length);
                fadeDelay = startFadeDelay;
            } else if (!fading) {
                startFadeDelay = undefined;
                fadeDelay = undefined;
            } else if (fadeDelay) {
                fadeDelay -= ellapsedMs;
            }

            if (fadeDelay === undefined || fadeDelay > 0) {
                cubes.push({
                    ...cube,
                    startFadeDelay,
                    fadeDelay
                });
            } else {
                clusterFaded = true;
                faded.push(cube);
            }
        }
        if (clusterFaded) {
            score += 100 * Math.pow((4 / 3), cluster.length - 4);
        }
    }

    const stableCubes: Cube[] = [];
    const fallingCubes = [...state.fallingCubes];

    for (const cube of cubes) {
        if (faded.some(fadedCube => fadedCube.x === cube.x && fadedCube.y < cube.y)) {
            fallingCubes.push({
                ...cube,
                startFadeDelay: undefined,
                fadeDelay: undefined
            });
        } else {
            stableCubes.push(cube);
        }
    }

    const deletions = state.deletions + faded.length;

    return {
        ...state,
        deletions,
        score,
        stableCubes,
        fallingCubes
    };
}
