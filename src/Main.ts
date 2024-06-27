import * as PIXI from 'pixi.js';
import { Circle } from './classes/controls/Circle';
// import FontFaceObserver from 'fontfaceobserver';
const FontFaceObserver = require('fontfaceobserver');

export class Main {

    public app: PIXI.Application;
    public loader: PIXI.Loader;

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

        this.app.stage.interactive = true;

        document.body.appendChild(this.app.view);

        this.loader = PIXI.Loader.shared;

        this.build();

    }

    private async build() {

        this.setStyles();

        window.addEventListener('resize', this.onResize.bind(this));
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

    private onResize() {

        this.app.renderer.resize(window.innerWidth, window.innerHeight);

        this.recalculateStagePivot();
    }

    private recalculateStagePivot() {

        // const scaleFactor = window.devicePixelRatio || 1;
        //
        // this.app.stage.scale.set(scaleFactor, scaleFactor);

        this.app.stage.pivot.set(-this.app.renderer.width / 2, -this.app.renderer.height / 2)
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
        this.addFontFace('Vag-World', 'assets/fonts/Vag-World.ttf');

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
       const circleControls = new Circle(this.app);
    }

    start() {

    }

}