import { Game } from '../game/Game';

type ILevelOptions = {
    scale: number,
    position: {x: number, y: number}
}

interface ILevel {
    [key: string]: ILevelOptions;
}

export interface IConfig {
    loader: {
        atlases: string[];
        fonts: string[]
    },
    maxLevel: number
    levelsOptions: ILevel
}