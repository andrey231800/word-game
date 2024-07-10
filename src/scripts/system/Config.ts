import { IConfig } from '../types/IConfig';
import { Loader } from './Loader';
import { Game } from '../game/Game';
import { App } from './App';

//Game configuration

export const Config:IConfig = {
    loader: {
        atlases: ['src/assets/images/spritesheet.json'],
        fonts: ['src/assets/fonts/Vag-World.woff2']
    },
    maxLevel: 3,
    levelsOptions: {
        "1": {
            scale: 1,
            position: {x: 0, y: 300}
        },
        "2": {
            scale: 0.9,
            position: {x: 0, y: 397}
        },
        "3": {
            scale: 1,
            position: {x: 0, y: 300}
        }
    }
}