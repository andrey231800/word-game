import * as PIXI from 'pixi.js'
import { SquareLetter } from './SquareLetter';
import { updatePivot } from '../../utils/updatePivot';
import { Container } from 'pixi.js';

export class Word extends PIXI.Container {

    app: PIXI.Application;
    step: number;
    textContent: string

    constructor(app: PIXI.Application, textContent: string, wrapper: PIXI.Container) {
        super();

        this.app = app;

        wrapper.addChild(this);

        this.textContent = textContent;

        this.step = 78

        this.build();

    }

    build() {

        const splitWord = this.textContent.split('');

        for (let i = 0; i < splitWord.length; i++) {
            const letter = splitWord[i];

            const letterCon = new SquareLetter(this, letter);

            letterCon.x = this.step * i;
        }

        updatePivot(this);
    }

    public correctAnim() {
        for (let i = 0; i < this.children.length; i++) {

            const letter = this.getChildAt(i);

            if(letter instanceof SquareLetter) {

                setTimeout(() => {
                    letter.correctAnim();
                }, i*50)
            }

        }
    }

    public repeatAnim() {
        for (let i = 0; i < this.children.length; i++) {

            const letter = this.getChildAt(i);

            if(letter instanceof SquareLetter) {

                letter.repeatAnim();
            }

        }
    }
}