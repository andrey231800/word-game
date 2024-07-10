import * as PIXI from 'pixi.js';
import { IState } from '../types/IState';
import { IApp } from '../types/IApp';
import {LevelData} from '../types/LevelData';
import { Loader } from './Loader';
import { Config } from './Config';
import { IConfig } from '../types/IConfig';
import { LocalStorageManager } from './LocalStorageManager';
import { Levels } from './Levels';
import { Game } from '../game/Game';

class Application implements IApp{

    public app: PIXI.Application;
    MAX_LEVEL: number;
    CURRENT_LEVEL: number;
    levelsData: LevelData[];
    Stage: PIXI.Container;
    Renderer: PIXI.Renderer;
    Loader!: Loader;
    Config: IConfig;
    State: IState;
    localStorageManager!: LocalStorageManager;
    Game!: Game;

    constructor() {

        this.app = new PIXI.Application({
            width: window.innerWidth,
            height: window.innerHeight,
            backgroundColor: 0x2B344B,
            resizeTo: window,
            antialias: true,
            // resolution: window.devicePixelRatio || 1
        });

        document.body.appendChild(this.app.view);
        (globalThis as any).__PIXI_APP__ = this.app;

        this.Stage = this.app.stage;
        this.Stage.interactive = true;

        this.Renderer = this.app.renderer;
        this.Config = Config;
        this.State = {
            words: [],
            level: 1
        }

        this.MAX_LEVEL = this.Config.maxLevel;

        this.levelsData = [];

        this.CURRENT_LEVEL = 1;

    }

    public run() {

        this.localStorageManager = new LocalStorageManager();

        this.Game = new Game();

        this.Loader = new Loader(this.Config);
        this.Loader.loadAssets().then(() => this.setup());

        this.setStyles();

        window.addEventListener('resize', this.onResize.bind(this));
        this.onResize();

        this.levelsData = Levels.get(this.MAX_LEVEL);

    }

    setStyles() {
        document.body.style.overflow = 'hidden';
        document.body.style.margin = '0 auto';
        document.body.style.backgroundColor = "#2B344B";
        this.Renderer.view.style.position = 'absolute';
        this.Renderer.view.style.display = 'block';
    }

    private onResize() {

        this.resizeStage();

        this.recalculateStagePivot();
    }

    private resizeStage() {

        const canvasWidth = window.innerWidth;
        const canvasHeight = window.innerHeight;

        const gameWidth = 300;
        const gameHeight = 1200;

        const scaleX = canvasWidth / gameWidth;
        const scaleY = canvasHeight / gameHeight;
        const scale = Math.min(scaleX, scaleY);

        this.Renderer.resize(window.innerWidth, window.innerHeight);

        this.Stage.scale.set(scale, scale);

    }

    private recalculateStagePivot() {

        this.Stage.pivot.set(-this.Renderer.width / 2 /this.Stage.scale.x, -this.Renderer.height / 2/this.Stage.scale.y)
    }


    private setup() {

        this.Game.initialize();
        this.Game.addScene(this.CURRENT_LEVEL);

    }

}

export const App = new Application();