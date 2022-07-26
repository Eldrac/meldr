import { BOARD_HEIGHT, DEFAULT_FALL_SPEED, FALL_DELAY_BUFFER } from "../utils/constants";
import { detectClusters } from "../state/detect-clusters";
import { Cube } from "../types/Cube";
import { UpdateEvent } from "../types/GameEvent";
import { GameState } from "../types/GameState";
import { createActiveCubes } from "../state/create-active-cubes";
import { getHeightMap } from "../state/get-height-map";
import { getFadeDelay, getFallDelay, getFallSpeed } from "../utils/timers";
import { getMeldScore } from "../utils/score";

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

function updateActiveCubes(state: GameState, { ellapsedMs }: UpdateEvent): GameState {
    const baseFallDelay = getFallDelay(state.deletions);
    if (!state.activeCubes.length && !state.fallingCubes.length) {
        return {
            ...state,
            fallDelay: baseFallDelay,
            activeCubes: createActiveCubes()
        };
    }

    if (state.fallDelay > 0 && (!state.holdingDown || baseFallDelay - state.fallDelay < FALL_DELAY_BUFFER)) {
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
    
    const calculatedSpeed = getFallSpeed(state.deletions);
    const speed = state.holdingDown ? Math.min(DEFAULT_FALL_SPEED, calculatedSpeed) : calculatedSpeed;
    for (const cube of state.activeCubes) {
        const y = cube.y - (ellapsedMs / speed);

        const colMax = heights[cube.x];

        if (y <= colMax) {
            if (colMax > BOARD_HEIGHT - 1) {
                return {
                    ...state,
                    gameOver: true
                };
            }

            stabalized = true;
            heights[cube.x] = colMax + 1;

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
        // Vertical cubes with not enough space above
        if (activeCubes.some(cube => cube.y >= BOARD_HEIGHT - 1)) {
            return {
                ...state,
                gameOver: true
            };
        }

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

    const speed = Math.min(DEFAULT_FALL_SPEED, getFallSpeed(state.deletions));
    for (const cube of state.fallingCubes) {
        const y = cube.y - ellapsedMs / speed;
        const colMax = heights[cube.x];
        if (y <= colMax) {
            heights[cube.x] = heights[cube.x] + 1;
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
            score += getMeldScore(cluster.length);
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
