import * as PIXI from 'pixi.js';
import { IConfig } from '../types/IConfig';
import { getFontFileName } from '../utils/getFontFileName';
const FontFaceObserver = require('fontfaceobserver');

export class Loader {

    private loader: PIXI.Loader;
    private config: IConfig;

    constructor(config: IConfig) {
        this.loader = new PIXI.Loader();
        this.config = config;

        const atlases = this.config.loader.atlases;

        atlases.forEach(atlasPath => this.loader.add(atlasPath));
    }

    public loadAssets(): Promise<void> {

        return new Promise((resolve, reject) => {
            this.loadFonts()
                .then(() => {
                    this.loader.load((loader, resources) => {
                        if (resources) {
                            resolve();
                        } else {
                            reject(new Error('Failed to load resources'));
                        }
                    })
                })
                .catch(err => {
                    reject(err);
                });
        })

    }

    private loadFonts(): Promise<void[]> {

        const fonts = this.config.loader.fonts;

        const fontPromises = fonts.map(url => {

            const fontName: string = getFontFileName(url);

            this.addFontFace(fontName, url);

            const font = new FontFaceObserver(fontName);
            font.load();

        })

        return Promise.all(fontPromises);

    }

    private addFontFace(fontName: string, url: string) {
        const style = document.createElement('style');
        style.innerHTML = `
            @font-face {
                font-family: '${fontName}';
                src: url('${url}');
            }
        `;
        document.head.appendChild(style);
    }

}