import * as PIXI from 'pixi.js';

export function updatePivot(container: PIXI.Container) {

    let minX = Infinity;
    let maxX = -Infinity;

    container.children.forEach(child => {
        if (child.x < minX) {
            minX = child.x;
        }
        if (child.x > maxX) {
            maxX = child.x;
        }
    });

    container.pivot.x = (minX + maxX) / 2;
}