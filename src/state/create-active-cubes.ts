import { ACTIVE_CUBE_COUNT, BOARD_HEIGHT, COLOR_COUNT } from "../utils/constants";
import { Cube } from "../types/Cube";

let lastCubeId = 0;

export function createActiveCubes() {
    const cubes: Cube[] = [];
    for (let i = 0; i < ACTIVE_CUBE_COUNT; i++) {
        cubes.push({
            id: lastCubeId++,
            x: i + 2,
            y: BOARD_HEIGHT,
            color: Math.floor(Math.random() * COLOR_COUNT)
        });
    }

    return cubes;
}