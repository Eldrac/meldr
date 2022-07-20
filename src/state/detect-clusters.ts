import { Cube } from "../types/Cube";
import { GameState } from "../types/GameState";

export function detectClusters(state: GameState) {
    const cubes = state.stableCubes;
    const cubesByCoords = [] as (Cube | undefined)[][];
    const clusters = [] as Cube[][];

    for (const cube of cubes) {
        if (!cubesByCoords[cube.x]) {
            cubesByCoords[cube.x] = [];
        }
        cubesByCoords[cube.x][cube.y] = cube;
    }

    const findByCoords = (x: number, y: number) => cubesByCoords[x] ? cubesByCoords[x][y] : undefined;

    const visited = new Set<number>();

    for (const cube of cubes) {
        if (visited.has(cube.id)) {
            continue;
        }

        let currentCluster = [] as Cube[];
        let cubeQueue = [cube] as Cube[];
        visited.add(cube.id);

        while (cubeQueue.length) {
            const currentCube = cubeQueue.shift()!;

            currentCluster.push(currentCube);
            const { x, y, color } = currentCube;
            const validNeighbors = [
                findByCoords(x - 1, y),
                findByCoords(x + 1, y),
                findByCoords(x, y - 1),
                findByCoords(x, y + 1)
            ].filter(neighbor => neighbor?.color === color && !visited.has(neighbor.id)) as Cube[];

            validNeighbors.forEach(n => visited.add(n.id));
            cubeQueue.push(...validNeighbors);
        }
        clusters.push(currentCluster);
    }

    return clusters;
}