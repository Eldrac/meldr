// Time in ms before active blocks automatically start falling
export const getFallDelay = (deletions: number) => Math.max(3000 - deletions / 2, 750);

// Time in ms it should take to fall a single row
export const getFallSpeed = (deletions: number) => 
    deletions < 500 ? 500 - 3 * deletions / 5 :
    Math.max(250 - deletions / 10, 1);

// Time in ms before a cluster of cubes should fade
export const getFadeDelay = (clusterSize: number) => Math.max(5000 - clusterSize * 250, 1000);