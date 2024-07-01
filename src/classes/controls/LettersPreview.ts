import * as PIXI from 'pixi.js';
import { Letter } from './Letter';
import { Move } from './Move';
import { Circle } from './Circle';
import { gsap as gsapLibrary } from "gsap";
import { PixiPlugin } from 'gsap/PixiPlugin';
import { Text } from 'pixi.js';
import Timeline = gsap.core.Timeline;
import { updatePivot } from '../../utils/updatePivot';
import { IColors } from '../../types/Color';

export class LettersPreview extends PIXI.Container {

    // app: PIXI.Application;
    pickedLetters: Letter[];
    move: Move;
    color: IColors;
    animation: Timeline | null;
    WRAPPER: PIXI.Container;

    constructor(WRAPPER: PIXI.Container, move: Move) {
        super();

        // this.app = app;
        this.WRAPPER = WRAPPER

        this.animation = null;

        const circle = this.WRAPPER.getChildAt(0);

        if(circle instanceof PIXI.Container) circle.addChild(this);

        this.move = move;

        this.pickedLetters = this.move.pickedLetters;

        this.color = {
            default: 0x4D4D4D,
            incorrect: 0xea575b,
            correct: 0xFFFFFF,
            repeat: 0xe39957
        }

        this.y = -258;
        this.scale.set(0.7);
    }

    clearLetters() {
        this.removeChildren();
    }

    createLetter(textContent: string) {

        const letterCon = new PIXI.Container();

        this.addChild(letterCon);

        const letterRect = new PIXI.Sprite(PIXI.Texture.from('white-rect.png'));
        letterRect.anchor.set(0.5);
        letterCon.addChild(letterRect);

        const letterText = new PIXI.Text(textContent, {
            fontFamily: 'Vag-World',
            fontSize: "50px",
            fill: this.color.default
        });
        letterText.anchor.set(0.5);
        letterCon.addChild(letterText);

        return letterCon;

    }

    createLetters() {

        const offsetX = 76;

        this.clearLetters();

        for (let i = 0; i < this.pickedLetters.length; i++) {

            const collectedLetter = this.pickedLetters[i];

            const letter = this.createLetter(collectedLetter.textContent);

            letter.x = offsetX * i;

        }

        updatePivot(this);
    }

    correct() {

        this.clearLetters();

    }

    correctRepeat() {

        for (let i = 0; i < this.children.length; i++) {
            const letter = this.getChildAt(i);

            if(letter instanceof PIXI.Container) {
                const letterSprite = letter.getChildAt(0);
                if(letterSprite instanceof PIXI.Sprite) {

                    letterSprite.tint = this.color.repeat;
                }

                const letterText = letter.getChildAt(1);
                if(letterText instanceof PIXI.Text) {

                    letterText.style.fill = this.color.correct;

                }

                setTimeout(() => {
                    this.clearLetters();
                }, 300);


            }
        }

    }

    incorrect() {

        // gsap.registerPlugin(PixiPlugin);
        // PixiPlugin.registerPIXI(PIXI);

        for (let i = 0; i < this.children.length; i++) {
            const letter = this.getChildAt(i);

            if(letter instanceof PIXI.Container) {
                const letterSprite = letter.getChildAt(0);
                if(letterSprite instanceof PIXI.Sprite) {

                    letterSprite.tint = this.color.incorrect;
                }

                const letterText = letter.getChildAt(1);
                if(letterText instanceof PIXI.Text) {

                    letterText.style.fill = this.color.correct;

                }

                this.incorrectAnim(letter);

            }
        }

    }

    incorrectAnim(letter: PIXI.Container) {

        const initPosX = letter.x;

        const tl = gsapLibrary.timeline({
            onComplete: () => {

                if(this.animation) this.clearLetters();

                this.stopAnimation();

            }
        });

        this.animation = tl;

        tl
            .to(letter, {duration: 0.1, x: '+=20', yoyo: true, repeat: 2, ease: 'sine.inOut'}, 0)
            .to(letter, {duration: 0.1, x: initPosX, ease: 'none'}, ">")
    }

    stopAnimation() {
        if(this.animation) this.animation.pause();

        this.animation = null;
    }
}