export enum CubeColor { White, Orange, Purple, Teal }

export interface Cube {
    id: number;
    color: CubeColor;
    x: number;
    y: number;
    startFadeDelay?: number;
    fadeDelay?: number;
}