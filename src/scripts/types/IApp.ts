import PIXI from 'pixi.js';
import { TwoTabs } from '../game/TwoTabs';
import { NextLevel } from '../game/NextLevel';
import { Circle } from '../game/Circle';
import { LevelData } from './LevelData';
import { Loader } from '../system/Loader';
import { IConfig } from './IConfig';
import { IState } from './IState';
import { LocalStorageManager } from '../system/LocalStorageManager';
import { Game } from '../game/Game';

export interface IApp {
    app: PIXI.Application;
    MAX_LEVEL: number;
    CURRENT_LEVEL: number;
    levelsData: LevelData[];
    Stage: PIXI.Container;
    Renderer: PIXI.Renderer;
    Loader: Loader;
    Config: IConfig;
    State: IState;
    localStorageManager: LocalStorageManager;
    Game: Game
}