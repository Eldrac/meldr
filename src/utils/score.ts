export const getHighScore = () => Number(localStorage.getItem("high-score") ?? 0);

export const setHighScore = (score: number) => localStorage.setItem("high-score", score.toString());