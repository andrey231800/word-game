import { NextLevel } from './NextLevel';
import { TwoTabs } from './TwoTabs';
import { App } from '../system/App';
import * as PIXI from 'pixi.js';
import { Circle } from './Circle';
import { Words } from './Words';
import { MoveController } from './MoveController';

export class Game {

    public nextLevel!: NextLevel;
    public twoTabs!: TwoTabs;
    private currentScene!: PIXI.Container;

    constructor() {

    }

    initialize() {
        this.nextLevel = new NextLevel();

        this.twoTabs = new TwoTabs();

        App.localStorageManager.twoTabs = this.twoTabs
    }

    deleteScene() {
        if(this.currentScene) {
            App.Stage.removeChild(this.currentScene);
            this.currentScene.destroy();
        }
    }

    addScene(level: number) {

        const WRAPPER = new PIXI.Container();

        this.currentScene = WRAPPER;

        App.Stage.addChild(WRAPPER);

        const circle = new Circle(this.nextLevel, level);
        WRAPPER.addChild(circle);

        const WordsContainer = new Words(WRAPPER, circle.levelWords, level);

        const moveController = new MoveController({
            WRAPPER: WRAPPER,
            letters: circle.letters,
            correctWords: circle.levelWords,
            WordsContainer: WordsContainer,
            Circle: circle
        });

        circle.createLetters(moveController);

    }
}