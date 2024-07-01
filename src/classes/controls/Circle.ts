import * as PIXI from 'pixi.js';
import { Application, Container, Loader, Sprite, Spritesheet, Texture } from 'pixi.js';
import { Letter } from './Letter';
import { getLevelFromJSON } from '../../utils/getLevelFromJSON';
import { Move } from './Move';
import { Words } from '../words/Words';
import { NextLevel } from '../NextLevel';
import { GAME_STATE, Main } from '../../Main';

interface WordsObject {
    words: string[];
}

export class Circle extends Container {
    app: Application;
    letters: Container;
    levelWords: string[];
    lettersVariants: string[];
    CURRENT_LEVEL: number;
    move: Move | null;
    WordsContainer: Words | null;
    WRAPPER: PIXI.Container;
    NextLevel: NextLevel;
    main: Main

    constructor(app: Application, NextLevel: NextLevel, level: number = 1, main: Main) {
        super();

        this.app = app;
        this.letters = new Container();
        // this.update = this.update.bind(this);

        this.WRAPPER = new PIXI.Container();
        this.WRAPPER.addChild(this);

        this.NextLevel = NextLevel;
        this.main = main;

        this.WordsContainer = null;

        this.levelWords = ['привет'];

        this.CURRENT_LEVEL = level;
        this.lettersVariants = [];

        GAME_STATE.level = this.CURRENT_LEVEL;

        this.move = null;

        this.app.stage.addChild(this.WRAPPER);

        const circleImage = new PIXI.Sprite(PIXI.Texture.from('circle-frame.png'));
        circleImage.anchor.set(0.5);

        this.y = 300;

        this.addChild(circleImage);
        this.addChild(this.letters);

        const levelsData = this.main.levelsData[this.CURRENT_LEVEL-1];

        if(levelsData) {
            this.levelWords = levelsData.words;
            this.lettersVariants = levelsData.variants;
        }


        this.build();

        // this.getLevel();

        // this.createLetters();

    }

    createLetters() {

        if(!this.move) return

        const angleStep = (2 * Math.PI) / this.lettersVariants.length;
        const radius = 133;

        for (let i = 0; i < this.lettersVariants.length; i++) {
            const letterText = this.lettersVariants[i];

            const letterCon = new Letter(
                this.app,
                letterText,
                this.move,
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

        this.WordsContainer = new Words(this.WRAPPER, this.levelWords, this.CURRENT_LEVEL, this.NextLevel);

        this.move = new Move({
            WRAPPER: this.WRAPPER,
            letters: this.letters,
            correctWords: this.levelWords,
            WordsContainer: this.WordsContainer,
            app: this.app,
            Circle: this
        });

        // this.pickLettersFromTheWords();
        this.createLetters();

        this.app.stage.addChild(this.move.linesCon);

        if(this.levelWords.length >= 8) {

            this.y = 377 + 20;
            this.scale.set(0.9);
        }
    }
}
