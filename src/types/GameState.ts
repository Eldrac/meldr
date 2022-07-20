import { Cube } from "./Cube";

export interface GameState {
    score: number,
    deletions: number,

    activeCubes: Cube[], // Player controlled cubes (either waiting above board or falling)
    fallingCubes: Cube[], // Falling cubes which player does not have control over
    stableCubes: Cube[], // Cubes which are not moving

    gameOver: boolean;
    fallDelay: number;
    holdingDown: boolean;
}