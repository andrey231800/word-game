import * as PIXI from 'pixi.js';
import { gsap } from 'gsap';
import { Texture } from 'pixi.js';
import { Back } from 'gsap/gsap-core';
import { GAME_STATE, Main } from '../Main';
import InteractionEvent = PIXI.interaction.InteractionEvent;
import { NextLevel } from './NextLevel';

export class TwoTabs extends PIXI.Container {

    app: PIXI.Application;
    overlay: PIXI.Graphics;
    modal: PIXI.Container;
    button: PIXI.Sprite;
    main: Main;
    buttonDown: boolean;
    isButtonAvailable: boolean;
    nextLevel: NextLevel;

    constructor(app: PIXI.Application, main: Main, nextLevel: NextLevel) {
        super();

        this.app = app;

        this.visible = false;

        this.app.stage.addChild(this);
        this.main = main;

        this.nextLevel = nextLevel;

        this.buttonDown = false;
        this.isButtonAvailable = false;

        this.overlay = new PIXI.Graphics;

        const overlaySize = 3000;
        this.overlay.beginFill(0x000000, 0.5);
        this.overlay.drawRect(-overlaySize/2, -overlaySize/2, overlaySize, overlaySize);
        this.overlay.endFill();
        this.overlay.alpha = 0;

        this.addChild(this.overlay);

        this.modal = new PIXI.Container();
        this.addChild(this.modal);

        const modalImg = new PIXI.Sprite(PIXI.Texture.from('popup-rect.png'));
        modalImg.anchor.set(0.5);

        const modalText = `Похоже, игра открыта в\nнескольких вкладках браузера.\nЧтобы продолжить играть в\nэтой вкладке, обновите\nстраницу.`
        const modalTextCon = new PIXI.Text(modalText, {
            align: 'center',
            fontFamily: 'Vag-World',
            fontSize: "31px",
            fill: 0x4D4D4D
        })
        modalTextCon.anchor.set(0.5);
        modalTextCon.y = -6;
        this.modal.addChild(modalImg, modalTextCon);

        const topBar = new PIXI.Sprite(PIXI.Texture.from('popup_ribbon.png'));
        topBar.anchor.set(0.5);

        const topText = new PIXI.Text("Две вкладки\nс игрой?", {
            align: 'center',
            fontFamily: 'Vag-World',
            fontSize: "38px",
            fill: 0xFFFFFF
        })
        topText.y = -10;
        topText.anchor.set(0.5);
        topBar.addChild(topText);

        topBar.y = -176;

        this.modal.addChild(topBar);

        this.button = new PIXI.Sprite(PIXI.Texture.from('update_button.png'));
        this.button.anchor.set(0.5);

        const buttonText = new PIXI.Text('Обновить', {
            fontFamily: 'Vag-World',
            fontSize: "43px",
            fill: 0xFFFFFF
        })
        buttonText.anchor.set(0.5);
        buttonText.y = -4;
        this.button.addChild(buttonText);
        this.button.y = 155;
        this.button.buttonMode = true;
        this.button.interactive = true;

        this.modal.addChild(this.button);
        this.modal.alpha = 0;

        // this.show();

        this.setEvents();
    }

    setEvents() {

        this.button.on('pointerdown', (e: InteractionEvent) => {

            if(!this.buttonDown && this.isButtonAvailable) {
                this.buttonDown = true;
                this.isButtonAvailable = false;

                gsap.to(this.button.scale, {x: 0.9, y: 0.9, duration: 0.1})

            }
        });

        this.app.renderer.plugins.interaction.on('pointerup', () => {
            if(this.buttonDown) {
                this.buttonDown = false;

                this.hide();

                this.main.setPageOpenStatus(true)

                gsap.to(this.button.scale, {x: 1, y: 1, duration: 0.1})
            }
        })
    }

    show() {

        this.app.stage.addChild(this);

        this.visible = true;


        gsap.fromTo(this.overlay, {alpha: 0}, {alpha: 0.5, duration: 0.6});

        const tl = gsap.timeline({
            onComplete: () => {
                this.isButtonAvailable = true;
            }
        });


        tl
            .set(this.modal, {alpha: 1})
            .fromTo(this.modal, {y: -1500}, {y: 0, duration: 0.6, ease: "back.out"})
    }

    hide() {

        gsap.fromTo(this.overlay, {alpha: 0.5}, {alpha: 0, duration: 0.6});

        const tl = gsap.timeline({
            onComplete: () => {
                this.modal.alpha = 0;
                this.visible = false;

                this.updateLevel();
            }
        });

        tl
            .fromTo(this.modal, {y: 0}, {y: -1500, duration: 0.6, ease: "back.in"})
    }

    updateLevel() {

        const savedState = localStorage.getItem('gameState');

        if(savedState) {

            const data = JSON.parse(savedState)

            GAME_STATE.level = data.level;
            GAME_STATE.words = data.words;

            this.nextLevel.CURRENT_LEVEL = data.level;
            this.main.CURRENT_LEVEL = data.level;

            this.main.deleteLevel();
            this.main.addLevel();
        }
    }
}