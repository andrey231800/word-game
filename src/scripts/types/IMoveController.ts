import PIXI from 'pixi.js';
import { Words } from '../game/Words';
import { Circle } from '../game/Circle';

export interface IMoveController {
    WRAPPER: PIXI.Container,
    letters: PIXI.Container,
    correctWords: string[],
    WordsContainer: Words | null,
    Circle: Circle
}