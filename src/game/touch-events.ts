import { Game } from "./Game";

let holdingDown = false;
let dispatchedAction = false;
let lastTouchTime: number | undefined;
let lastTouchCoords: [number, number] | undefined;

export function initTouchEvents(game: Game) {
    window.addEventListener('touchstart', (event: TouchEvent) => onTouchStart(event));
    window.addEventListener('touchmove', (event: TouchEvent) => onTouchMove(event, game));
    window.addEventListener('touchend', (event: TouchEvent) => onTouchEnd(event, game));
}

function onTouchStart(event: TouchEvent) {
    event.preventDefault();

    holdingDown = false;
    dispatchedAction = false;
    lastTouchTime = new Date().getTime();
    lastTouchCoords = [event.targetTouches[0].clientX, event.targetTouches[0].clientY];
}

function onTouchMove(event: TouchEvent, game: Game) {
    event.preventDefault();
    const touchDuration = new Date().getTime() - lastTouchTime!;
    const touchCoords: [number, number] = [event.targetTouches[0].clientX, event.targetTouches[0].clientY];

    const xDelta = lastTouchCoords![0] - touchCoords[0];
    const yDelta = lastTouchCoords![1] - touchCoords[1];
    
    const widthThreshold = window.innerWidth / 10;
    if (xDelta > widthThreshold && touchDuration > 100) {
        lastTouchTime = new Date().getTime();
        lastTouchCoords = touchCoords;
        dispatchedAction = true;
        
        game.dispatch({ type: "MoveLeft" });
    } else if (xDelta < -widthThreshold && touchDuration > 100) {
        lastTouchTime = new Date().getTime();
        lastTouchCoords = touchCoords;
        dispatchedAction = true;

        game.dispatch({ type: "MoveRight" });
    } else if (yDelta < -20) {
        holdingDown = true;
        dispatchedAction = true;
        
        game.dispatch({ type: "ToggleDown", toggle: true });
    }
}

function onTouchEnd(event: TouchEvent, game: Game) {
    event.preventDefault();
    const touchDuration = new Date().getTime() - lastTouchTime!;
    
    if (!dispatchedAction && touchDuration < 200) {
        game.dispatch({ type: "RotateRight" });
    }

    if (holdingDown) {
        game.dispatch({ type: "ToggleDown", toggle: false });
    }
}