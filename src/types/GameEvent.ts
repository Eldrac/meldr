export type GameEvent =
    MoveRightEvent |
    MoveLeftEvent |
    RotateRightEvent |
    ResetEvent |
    ToggleDownEvent |
    UpdateEvent;

export interface UpdateEvent {
    type: "Update";
    ellapsedMs: number;
}

export interface MoveRightEvent {
    type: "MoveRight";
}

export interface MoveLeftEvent {
    type: "MoveLeft";
}

export interface RotateRightEvent {
    type: "RotateRight";
}

export interface ToggleDownEvent {
    type: "ToggleDown";
    toggle: boolean;
}

export interface ResetEvent {
    type: "Reset";
}