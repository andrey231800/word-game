import * as PIXI from 'pixi.js';
import InteractionEvent = PIXI.interaction.InteractionEvent;
import InteractionData = PIXI.interaction.InteractionData;
import { MoveController } from './MoveController';
import { gsap } from "gsap";

export class Letter extends PIXI.Container {

    text: PIXI.Text;
    readonly textContent: string
    readonly activeFrame: PIXI.Sprite;
    readonly inactiveFrame: PIXI.Sprite;
    private moveController: MoveController;
    isPicked: boolean;
    activeTextColor: string;
    inactiveTextColor: string;
    id: number;

    constructor(textContent: string, move: MoveController, id: number) {
        super();

        this.textContent = textContent;

        this.moveController = move;

        this.isPicked = false;
        this.id = id;

        this.activeFrame = new PIXI.Sprite(PIXI.Texture.from('pink-circle.png'));
        this.activeFrame.anchor.set(0.5);
        this.addChild(this.activeFrame);
        this.activeFrame.alpha = 0;

        this.inactiveFrame = new PIXI.Sprite(PIXI.Texture.from('white-circle.png'));
        this.inactiveFrame.anchor.set(0.5);
        this.addChild(this.inactiveFrame);

        this.activeTextColor = '0xFFFFFF';
        this.inactiveTextColor = '0x4D4D4D';

        this.text = new PIXI.Text(this.textContent, {
            fontFamily: 'Vag-World',
            fontSize: "55px",
            fill: this.inactiveTextColor
        });

        this.text.anchor.set(0.5);

        this.addChild(this.text);

        this.interactive = true;
        this.buttonMode = true;

        this.setEvents();
    }

    private setEvents() {
        this.on('pointerdown', (e: InteractionEvent) => {
            if(!this.moveController.dragging && !this.isPicked) {
                // console.log('Drag started');
                this.moveController.dragging = true;
                this.moveController.dragData = e.data;

                this.setCurLetter()
            }
        });
    }

    setCurLetter(isRemove: boolean = false) {

        if(this.moveController.lettersPreview.animation) {
            this.moveController.lettersPreview.stopAnimation();
            this.moveController.lettersPreview.clearLetters();
        }

        this.moveController.createLine();

        this.setActiveFrame();

        this.moveController.startPoint = this.moveController.linesCon.toLocal(this.toGlobal(new PIXI.Point(0, 0)));
        this.moveController.curLetter = this;
        this.isPicked = true;

        if(!isRemove) this.moveController.pickedLetters.push(this);

        this.moveController.lettersPreview.createLetters();
    }

    setActiveFrame() {
        this.activeFrame.alpha = 1;
        this.inactiveFrame.alpha = 0;

        gsap.to(this.scale, {x: 1.07, y: 1.07, duration: 0.1})

        this.text.style.fill = this.activeTextColor;
    }

    setInactiveFrame() {
        this.activeFrame.alpha = 0;
        this.inactiveFrame.alpha = 1;

        gsap.to(this.scale, {x: 1, y: 1, duration: 0.1})

        this.text.style.fill = this.inactiveTextColor;
    }
}