import PIXI from 'pixi.js';
import { Words } from '../classes/words/Words';
import { Circle } from '../classes/controls/Circle';

export interface IMove {
    WRAPPER: PIXI.Container,
    letters: PIXI.Container,
    correctWords: string[],
    WordsContainer: Words | null,
    app: PIXI.Application,
    Circle: Circle
}