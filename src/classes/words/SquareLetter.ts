import * as PIXI from 'pixi.js';
import { IColors } from '../../interfaces/Color';
import { gsap } from 'gsap';

export class SquareLetter extends PIXI.Container {

    wrapper: PIXI.Container;
    whiteSquare: PIXI.Sprite | null;
    greenSquare: PIXI.Sprite | null;
    textCon: PIXI.Text | null;
    textContent: string;
    color: IColors

    constructor(wrapper: PIXI.Container, textContent: string) {
        super();

        this.textContent = textContent.toUpperCase();

        this.wrapper = wrapper;

        this.color = {
            default: 0x4D4D4D,
            incorrect: 0xea575b,
            correct: 0xFFFFFF,
            repeat: 0xe39957
        }

        this.whiteSquare = null;
        this.greenSquare = null;
        this.textCon = null;

        this.build();

    }

    private build() {
        this.wrapper.addChild(this);

        this.whiteSquare = new PIXI.Sprite(PIXI.Texture.from('white-rect.png'));
        this.whiteSquare.anchor.set(0.5);
        this.addChild(this.whiteSquare);

        this.greenSquare = new PIXI.Sprite(PIXI.Texture.from('green-rect.png'));
        this.greenSquare.anchor.set(0.5);
        this.greenSquare.alpha = 0;
        this.addChild(this.greenSquare);

        this.textCon = new PIXI.Text(this.textContent, {
            fontFamily: 'Vag-World',
            fontSize: "45px",
            fill: this.color.correct
        })
        this.textCon.anchor.set(0.5);
        this.addChild(this.textCon);

    }

    repeatAnim() {

        if(this.whiteSquare) this.whiteSquare.tint = this.color.repeat;

        let count = 0;

        const tl = gsap.timeline({
            onComplete: () => {
                count++;
                if(count === 1) {
                    if(this.whiteSquare) this.whiteSquare.tint = this.color.correct;
                }
            }
        });

        tl
            .to(this.scale, {x: 1.1, y: 1.1, duration: 0.15}, 0)
            .to(this.scale, {x: 1, y: 1, duration: 0.15}, ">")
            .fromTo(this.greenSquare, {alpha: 1}, {alpha: 0, duration: 0.15}, 0)
            .fromTo(this.greenSquare, {alpha: 0}, {alpha: 1, duration: 0.15}, ">=0.2")

    }

    correctAnim() {

        const tl = gsap.timeline({});

        tl
            .to(this.scale, {x: 1.1, y: 1.1, duration: 0.2}, 0)
            .to(this.scale, {x: 1, y: 1, duration: 0.2}, ">")
            .fromTo(this.greenSquare, {alpha: 0},{alpha: 1, duration: 0.3}, 0)

    }

}