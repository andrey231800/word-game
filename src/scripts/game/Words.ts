import * as PIXI from 'pixi.js'
import { Text } from 'pixi.js';
import { Word } from './Word';
import { NextLevel } from './NextLevel';
import { App } from '../system/App';

export class Words extends PIXI.Container {

    // app: PIXI.Application;
    words: string[];
    step: {x: number, y: number}
    CURRENT_LEVEL: number;
    WRAPPER: PIXI.Container;
    NextLevel: NextLevel | null;
    COLLECTED_WORDS: string[];

    constructor(WRAPPER: PIXI.Container, words: string[], CURRENT_LEVEL: number) {
        super();

        this.words = words;

        this.WRAPPER = WRAPPER;

        this.CURRENT_LEVEL = CURRENT_LEVEL;

        this.NextLevel = App.Game.nextLevel;

        this.step = {
            x: 78,
            y: 78
        };

        this.COLLECTED_WORDS = [];

        if(App.State.words.length) {
            this.COLLECTED_WORDS = [...App.State.words];
        }

        const levelText = new Text(`Уровень ${this.CURRENT_LEVEL}`, {
            fontFamily: 'Vag-World',
            fontSize: "35px",
            fill: 0xffffff
        })
        levelText.anchor.set(0.5);
        levelText.y = -100;
        this.addChild(levelText);

        this.build();


    }

    private build() {

        this.WRAPPER.addChild(this);

        this.y = -423;

        if(this.words.length >= 8) {
            this.y = -558 + 80;
            this.scale.set(0.8);
        }

        this.createWords();
    }

    private createWords() {

        const sortedWords = this.words.sort((a, b) => a.length - b.length);

        for (let i = 0; i < sortedWords.length; i++) {

            const word = sortedWords[i];

            const wordCon = new Word(word, this)
            wordCon.y = i * this.step.y;

            if(this.COLLECTED_WORDS.length && this.COLLECTED_WORDS.indexOf(word) !== -1) {
                wordCon.showLettersStatic();
            }

        }
    }

    correct(word: string) {
        const wordCon = this.getWordCon(word);

        this.COLLECTED_WORDS.push(word);

        this.checkIfAllWordsCollect();

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

    }

    checkIfAllWordsCollect() {
        if(this.COLLECTED_WORDS.length >= this.words.length) {
            setTimeout(() => {
                this.WRAPPER.visible = false;
                this.WRAPPER.destroy();
                if(this.NextLevel) this.NextLevel.show(this.WRAPPER);
            }, 300)
        }
    }
}