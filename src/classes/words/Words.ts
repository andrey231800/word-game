import * as PIXI from 'pixi.js'
import { SquareLetter } from './SquareLetter';
import { updatePivot } from '../../utils/updatePivot';
import { Container } from 'pixi.js';
import { Word } from './Word';
import W = PIXI.groupD8.W;

export class Words extends PIXI.Container {

    app: PIXI.Application;
    words: string[];
    step: {x: number, y: number}

    constructor(app: PIXI.Application, words: string[]) {
        super();

        this.app = app;
        this.words = words;

        this.step = {
            x: 78,
            y: 78
        };

        this.build();

    }

    private build() {
        this.app.stage.addChild(this);
        this.y = -482;

        this.createWords();
    }

    private createWords() {

        const sortedWords = this.words.sort((a, b) => a.length - b.length);

        for (let i = 0; i < sortedWords.length; i++) {

            const word = sortedWords[i];

            const wordCon = new Word(this.app, word, this)
            wordCon.y = i * this.step.y;

        }
    }

    correct(word: string) {
        const wordCon = this.getWordCon(word);

        if(wordCon) wordCon.correctAnim();
    }

    repeat(word: string) {
        const wordCon = this.getWordCon(word);

        if(wordCon) wordCon.repeatAnim();
    }

    getWordCon(word: string) {
        for (let i = 0; i < this.children.length; i++) {
            const wordCon = this.getChildAt(i);

            if(wordCon instanceof Word) {
                if(wordCon.textContent === word) return wordCon
            }
        }

        // if(this.getChildAt(0) instanceof Word) return this.getChildAt(0);


    }
}