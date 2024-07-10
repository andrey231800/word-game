import * as PIXI from 'pixi.js';
import { Application, Container, Loader, Sprite, Spritesheet, Texture } from 'pixi.js';
import { Letter } from './Letter';
import { MoveController } from './MoveController';
import { Words } from './Words';
import { NextLevel } from './NextLevel';
import { App } from '../system/App';

interface WordsObject {
    words: string[];
}

export class Circle extends Container {
    letters: Container;
    levelWords: string[];
    lettersVariants: string[];
    CURRENT_LEVEL: number;
    WordsContainer: Words | null;
    NextLevel: NextLevel;

    constructor(NextLevel: NextLevel, level: number = 1) {
        super();

        this.letters = new Container();

        this.NextLevel = NextLevel;

        this.WordsContainer = null;

        this.levelWords = ['привет'];

        this.CURRENT_LEVEL = level;
        this.lettersVariants = [];

        App.State.level = this.CURRENT_LEVEL;

        const circleImage = new PIXI.Sprite(PIXI.Texture.from('circle-frame.png'));
        circleImage.anchor.set(0.5);

        this.addChild(circleImage);
        this.addChild(this.letters);

        const levelsData = App.levelsData[this.CURRENT_LEVEL-1];

        if(levelsData) {
            this.levelWords = levelsData.words;
            this.lettersVariants = levelsData.variants;
        }

        const levelOptions = App.Config.levelsOptions[level.toString()];

        this.position.copyFrom(new PIXI.Point(levelOptions.position.x, levelOptions.position.y));
        this.scale.set(levelOptions.scale);

        this.build();

    }

    createLetters(moveController: MoveController) {

        const angleStep = (2 * Math.PI) / this.lettersVariants.length;
        const radius = 133;

        for (let i = 0; i < this.lettersVariants.length; i++) {
            const letterText = this.lettersVariants[i];

            const letterCon = new Letter(
                letterText,
                moveController,
                i
            );

            const angle = i * angleStep - Math.PI/2;
            const x = radius * Math.cos(angle);
            const y = radius * Math.sin(angle);

            letterCon.position.set(x, y);
            this.letters.addChild(letterCon);
        }

    }

    private build() {


    }
}
