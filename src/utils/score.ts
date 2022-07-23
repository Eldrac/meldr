export const getMeldScore = (size: number) => 25 * size * size - 175 * size + 400;

export const getHighScore = () => Number(localStorage.getItem("high-score") ?? 0);

export const setHighScore = (score: number) => localStorage.setItem("high-score", score.toString());