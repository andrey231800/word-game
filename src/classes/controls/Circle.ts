import * as PIXI from 'pixi.js';
import { Application, Container, Loader, Sprite, Spritesheet, Texture } from 'pixi.js';
import { Letter } from './Letter';
import { getLevelFromJSON } from '../../utils/getLevelFromJSON';
import { Move } from './Move';
import { Words } from '../words/Words';

interface WordsObject {
    words: string[];
}

export class Circle extends Container {
    app: Application;
    letters: Container;
    levelWords: string[];
    lettersVariants: string[];
    level: number;
    move: Move | null;
    WordsContainer: Words | null;

    constructor(app: Application, level: number = 1) {
        super();

        this.app = app;
        this.letters = new Container();
        // this.update = this.update.bind(this);

        this.WordsContainer = null;

        this.levelWords = ['привет'];

        this.level = level;
        this.lettersVariants = [];

        this.move = null;

        this.app.stage.addChild(this);

        const circleImage = new PIXI.Sprite(PIXI.Texture.from('circle-frame.png'));
        circleImage.anchor.set(0.5);

        this.addChild(circleImage);
        this.addChild(this.letters);

        this.getLevel();

        this.y = 300;

        // this.createLetters();

        // Handle update
        // app.ticker.add(this.update);
    }

    pickLettersFromTheWords() {

        for (let i = 0; i < this.levelWords.length; i++) {
            const splitWord = this.levelWords[i].split('');

            for (let j = 0; j < splitWord.length; j++) {
                const letter = splitWord[j];

                if(this.lettersVariants.indexOf(letter) === -1) this.lettersVariants.push(letter.toString());
            }

        }


        for (let i = 0; i < this.levelWords.length; i++) {

            let splitWord = this.levelWords[i].split('');

            let arr1 = [...splitWord];
            let arr2 = [...this.lettersVariants];

            let unpaired: string[] = [];

            for (let letter of arr1) {

                let index = arr2.indexOf(letter);

                if (index !== -1) {

                    arr2.splice(index, 1);

                } else {

                    unpaired.push(letter);

                }

            }

            for (let k = 0; k < unpaired.length; k++) {

                this.lettersVariants.push(unpaired[k]);

            }

        }

        this.lettersVariants = this.lettersVariants.map(letter => letter.toUpperCase());
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

    async getLevel() {

        try {
            const words= await getLevelFromJSON(this.level);

            this.levelWords = words.words;

        } catch (e) {
            if(e instanceof Error) throw e;
        }

        this.build();

    }

    private build() {

        this.WordsContainer = new Words(this.app, this.levelWords);

        this.move = new Move(this.app, this.letters, this.levelWords, this.WordsContainer);

        this.pickLettersFromTheWords();
        this.createLetters();

        this.app.stage.addChild(this.move.linesCon);
    }
}
