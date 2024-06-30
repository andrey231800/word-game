import * as PIXI from 'pixi.js'
import { SquareLetter } from './SquareLetter';
import { updatePivot } from '../../utils/updatePivot';
import { Container, Text } from 'pixi.js';
import { Word } from './Word';
import W = PIXI.groupD8.W;
import { NextLevel } from '../NextLevel';
import { GAME_STATE } from '../../Main';

export class Words extends PIXI.Container {

    // app: PIXI.Application;
    words: string[];
    step: {x: number, y: number}
    CURRENT_LEVEL: number;
    WRAPPER: PIXI.Container;
    NextLevel: NextLevel;
    COLLECTED_WORDS: string[];

    constructor(WRAPPER: PIXI.Container, words: string[], CURRENT_LEVEL: number, NextLevel: NextLevel) {
        super();

        // this.app = app;
        this.words = words;

        this.WRAPPER = WRAPPER;

        this.CURRENT_LEVEL = CURRENT_LEVEL;

        this.NextLevel = NextLevel;

        this.step = {
            x: 78,
            y: 78
        };

        this.COLLECTED_WORDS = [];

        if(GAME_STATE.words.length) {
            this.COLLECTED_WORDS = [...GAME_STATE.words];
        }

        // console.log(this.COLLECTED_WORDS);

        const levelText = new Text(`Уровень ${this.CURRENT_LEVEL}`, {
            fontFamily: 'Vag-World',
            fontSize: "35px",
            fill: 0xffffff
        })
        levelText.anchor.set(0.5);
        levelText.y = -100;
        this.addChild(levelText);

        this.build();

        // this.levelText.anchor.set(0.5);

        // this.addChild(this.levelText);


    }

    private build() {

        this.WRAPPER.addChild(this);

        this.y = -423;

        if(this.words.length >= 8) {
            this.y = -558 + 50;
            this.scale.set(0.85);
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

        // if(this.getChildAt(0) instanceof Word) return this.getChildAt(0);


    }

    checkIfAllWordsCollect() {
        if(this.COLLECTED_WORDS.length >= this.words.length) {
            setTimeout(() => {
                this.WRAPPER.visible = false;
                this.WRAPPER.destroy();
                this.NextLevel.show();
            }, 300)
        }
    }
}