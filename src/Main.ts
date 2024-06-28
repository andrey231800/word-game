import * as PIXI from 'pixi.js';
import { Circle } from './classes/controls/Circle';
import { NextLevel } from './classes/NextLevel';
import { IState } from './interfaces/IState';
import { TwoTabs } from './classes/TwoTabs';
// import FontFaceObserver from 'fontfaceobserver';
const FontFaceObserver = require('fontfaceobserver');

export const GAME_STATE: IState = {
    words: [],
    level: 1
}

export class Main {

    public app: PIXI.Application;
    public loader: PIXI.Loader;
    MAX_LEVEL: number;
    CURRENT_LEVEL: number;
    storageKey: string;
    twoTabs: TwoTabs | null;

    constructor() {
        this.app = new PIXI.Application({
            width: window.innerWidth,
            height: window.innerHeight,
            backgroundColor: 0x2B344B,
            resizeTo: window,
            antialias: true,
            // resolution: window.devicePixelRatio || 1
        });

        // console.log(window.devicePixelRatio);

        this.CURRENT_LEVEL = 1;

        this.twoTabs = null;


        this.storageKey = 'page-opened';

        this.MAX_LEVEL = 7;

        this.app.stage.interactive = true;

        document.body.appendChild(this.app.view);

        this.localStorageEvents();

        this.setPageOpenStatus(true);

        // if(this.checkPageOpenStatus()) {
        //     console.log('Страница уже открыта в другой вкладке!');
        // }

        this.loader = PIXI.Loader.shared;

        this.build();

    }

    private async build() {

        this.setStyles();

        window.addEventListener('resize', this.onResize.bind(this));
        this.resizeStage();
        this.recalculateStagePivot();

        await this.loadAssets();

        (globalThis as any).__PIXI_APP__ = this.app;

        // this.loadAssets();
    }

    setStyles() {
        document.body.style.overflow = 'hidden';
        document.body.style.margin = '0 auto';
        document.body.style.backgroundColor = "#2B344B";
        this.app.renderer.view.style.position = 'absolute';
        this.app.renderer.view.style.display = 'block';
    }

    private localStorageEvents() {
        window.addEventListener('beforeunload', () => {
            // console.log('unload');

            localStorage.setItem('gameState', JSON.stringify(GAME_STATE));

            this.setPageOpenStatus(false);

        });

        window.addEventListener('load', () => {

            this.setGameState();
        });

        window.addEventListener('storage', (event) => {
            if(event.newValue) {
                if (event.key === this.storageKey) {
                    const pageStatus = JSON.parse(event.newValue);
                    if (pageStatus.status) {
                        console.log('Страница открыта в другой вкладке!');

                        if(this.twoTabs instanceof TwoTabs) {
                            this.twoTabs.show();
                        }
                    }
                }
            }

        });
    }

    private setGameState() {
        const savedState = localStorage.getItem('gameState');

        if(savedState) {
            const data = JSON.parse(savedState);

            GAME_STATE.level = data.level;
            GAME_STATE.words = data.words;

        }

        this.CURRENT_LEVEL = GAME_STATE.level;
    }

    public setPageOpenStatus(status: boolean) {
        localStorage.setItem(this.storageKey, JSON.stringify({
            status: status,
            timestamp: new Date().getTime()
        }));
    }

    private checkPageOpenStatus() {
        const item = localStorage.getItem(this.storageKey);

        if(item) {
            const pageStatus = JSON.parse(item);
            return pageStatus && pageStatus.status;
        }
    }

    private onResize() {

        this.app.renderer.resize(window.innerWidth, window.innerHeight);

        this.resizeStage();

        this.recalculateStagePivot();
    }

    private resizeStage() {

        const proportions = window.innerWidth / window.innerHeight;

        if(proportions > 1) {

            //Landscape

            this.app.stage.scale.set(0.7);

        } else {
            //Portrait

            this.app.stage.scale.set(1);
        }


    }

    private recalculateStagePivot() {

        // const scaleFactor = window.devicePixelRatio || 1;
        //
        // this.app.stage.scale.set(scaleFactor, scaleFactor);

        this.app.stage.pivot.set(-this.app.renderer.width / 2 /this.app.stage.scale.x, -this.app.renderer.height / 2/this.app.stage.scale.y)
    }

    private loadAssets() {

        this.loadFont();

        this.app.loader
            .add('spritesheet', 'assets/images/spritesheet.json')
            // .add('Vag-World', 'assets/fonts/Vag-World.ttf')
            .load((loader, resources) => {
                this.setup();

                // console.log(resources);
            });
    }

    private loadFont() {
        this.addFontFace('Vag-World', 'assets/fonts/Vag-World.woff2');

        const ff = new FontFaceObserver('Vag-World');
        ff.load().then(function () {
            // console.log('Font has loaded');
        });
    }

    private addFontFace(fontName: string, url: string) {
        const style = document.createElement('style');
        // style.type = 'text/css';
        style.innerHTML = `
            @font-face {
                font-family: '${fontName}';
                src: url('${url}');
            }
        `;
        document.head.appendChild(style);
    }


    private setup() {

        this.buildLayout();

    }

    buildLayout() {
       // circleControls.WRAPPER.visible = false;

        const nextLevel: NextLevel = new NextLevel(this.app, this.MAX_LEVEL, this.CURRENT_LEVEL);
        const circleControls = new Circle(this.app, nextLevel, this.CURRENT_LEVEL);

        this.twoTabs = new TwoTabs(this.app, this);

    }

    start() {

    }

}