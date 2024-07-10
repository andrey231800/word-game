import * as PIXI from 'pixi.js';
import { gsap } from 'gsap';
import InteractionEvent = PIXI.interaction.InteractionEvent;
import { Circle } from './Circle';
import { IApp } from '../types/IApp';
import { App } from '../system/App';

//Screen for transfer to the next level

export class NextLevel extends PIXI.Container {

    CURRENT_LEVEL: number;
    MAX_LEVEL: number;
    button: PIXI.Container;
    buttonText: PIXI.Text;
    textContainer: PIXI.Container;
    topText: PIXI.Text;
    buttonDown: boolean;
    isButtonAvailable: boolean;

    constructor() {
        super();

        this.CURRENT_LEVEL = App.CURRENT_LEVEL;
        this.MAX_LEVEL = App.MAX_LEVEL;

        this.isButtonAvailable = false;
        this.alpha = 0;
        this.visible = false;

        App.Stage.addChild(this);

        this.buttonDown = false;

        this.button = new PIXI.Container();
        const buttonImage = new PIXI.Sprite(PIXI.Texture.from('bt_green.png'));

        buttonImage.anchor.set(0.5);

        this.buttonText = new PIXI.Text(``, {
            fontFamily: 'Vag-World',
            fontSize: "45px",
            fill: 0xffffff
        })
        this.buttonText.anchor.set(0.5);
        this.button.addChild(buttonImage, this.buttonText)
        this.button.y = 228;

        this.textContainer = new PIXI.Container();

        this.textContainer.y = -200;

        this.topText = new PIXI.Text(``, {
            fontFamily: 'Vag-World',
            fontSize: "45px",
            fill: 0xffffff
        })
        this.topText.anchor.set(0.5);
        this.topText.y = -68;
        const bottomText = new PIXI.Text(`Изумительно!`, {
            fontFamily: 'Vag-World',
            fontSize: "65px",
            fill: 0xffffff
        })
        bottomText.anchor.set(0.5);
        this.textContainer.addChild(this.topText, bottomText);

        this.button.buttonMode = true;
        this.button.interactive = true;

        this.addChild(this.textContainer, this.button)

        this.button.on('pointerdown', (e: InteractionEvent) => {

            if(!this.buttonDown && this.isButtonAvailable) {
                this.buttonDown = true;
                this.isButtonAvailable = false;

                gsap.to(this.button.scale, {x: 0.9, y: 0.9, duration: 0.1})

            }
        });

        App.Renderer.plugins.interaction.on('pointerup', () => {
            if(this.buttonDown) {
                this.buttonDown = false;

                this.hide();

                gsap.to(this.button.scale, {x: 1, y: 1, duration: 0.1})
            }
        })

    }

    setButtonText() {

        this.isButtonAvailable = true;

        this.buttonText.text = `Уровень ${this.CURRENT_LEVEL}`;
    }

    setTopText() {
        this.topText.text = `Уровень ${this.CURRENT_LEVEL - 1} пройден`;
    }

    show(wrapper: PIXI.Container | null) {
        this.visible = true;
        gsap.fromTo(this, {alpha: 0}, {alpha: 1, duration: 0.2});

        App.Game.deleteScene();

        this.CURRENT_LEVEL++;

        App.State.words = [];
        App.State.level = this.CURRENT_LEVEL;

        App.Stage.addChild(this);

        if(this.CURRENT_LEVEL >= this.MAX_LEVEL + 1) {
            this.setTopText();
            this.button.visible = false;
        } else {
            this.setButtonText();
            this.setTopText();
        }

    }

    hide() {

        gsap.fromTo(this, {alpha: 1}, {alpha: 0, duration: 0.2})

        setTimeout(() => {
            this.visible = false;
            // new Circle(this, this.CURRENT_LEVEL);

            App.Game.addScene(this.CURRENT_LEVEL);
        }, 300);

    }
}