import * as PIXI from 'pixi.js';
import InteractionEvent = PIXI.interaction.InteractionEvent;
import InteractionData = PIXI.interaction.InteractionData;
import { Letter } from './Letter';
import { getDistance } from '../../utils/getDistance';
import { Graphics } from 'pixi.js';
import { LettersPreview } from './LettersPreview';
import { gsap } from "gsap";
import { Words } from '../words/Words';
import { Circle } from './Circle';
import { IMove } from '../../types/IMove';
import { GAME_STATE } from '../../Main';

export class Move {

    private app: PIXI.Application;
    public dragging: boolean;
    public dragData: InteractionData | null;
    linesCon: PIXI.Container;
    line: PIXI.Graphics | null;
    startPoint: PIXI.IPoint | null;
    letters: PIXI.Container;
    curLetter: Letter | null;
    prevLetter: Letter | null;
    pickedLetters: Letter[];
    lettersPreview: LettersPreview;
    correctWords: string[];
    collectedWords: string[];
    WordsContainer: Words | null;
    WRAPPER: PIXI.Container;
    Circle: Circle;

    constructor(options: IMove) {


        this.app = options.app;

        this.WRAPPER = options.WRAPPER;

        this.dragging = false;
        this.dragData = null;

        this.Circle = options.Circle;

        this.WordsContainer = options.WordsContainer;

        this.letters = options.letters;

        this.line = null;
        this.curLetter = null;
        this.prevLetter = null;

        this.correctWords = options.correctWords;

        this.startPoint = null;

        this.linesCon = new PIXI.Container;
        this.Circle.addChild(this.linesCon);
        this.linesCon.name = 'lines con';

        this.pickedLetters = [];

        this.collectedWords = [];

        if(GAME_STATE.words.length) {
            this.collectedWords = [...GAME_STATE.words];
            // GAME_STATE.words = [];
        }

        // console.log(this.collectedWords);

        this.lettersPreview = new LettersPreview(this.WRAPPER, this);

        this.addEvents();

        // this.createLine();

    }

    addEvents() {

        this.app.stage.on('pointermove', (e: InteractionEvent) => {
            if (this.dragging && this.dragData) {

                this.dragData = e.data;

                // const pos = this.dragData.getLocalPosition(this.line.parent);

                this.updateLine(e.data);
                if(this.curLetter) this.findNearestLetter(e.data);

            }
        });

        this.app.stage.on('pointerup', () => {
            if(this.dragging) {
                // console.log('Drag ended');
                this.dragging = false;
                this.dragData = null;

                this.reset();
            }
        });

        this.app.stage.on('pointerupoutside', () => {
            if(this.dragging) {
                this.dragging = false;
                this.dragData = null;

                this.reset();

            }
        });
    }

    createLine() {
        this.line = new PIXI.Graphics();

        this.Circle.addChild(this.linesCon);

        this.linesCon.addChild(this.line);

    }

    updateLine(data: InteractionData | Letter, line: Graphics | null = this.line) {

        let mouse;

        if(data instanceof Letter) {
            mouse = this.linesCon.parent.toLocal(data.toGlobal(new PIXI.Point(0, 0)));
        } else {
            mouse = this.linesCon.toLocal(data.global);
        }

        const radius = 0.5;

        const startPoint = this.startPoint ? this.startPoint : {x: 0, y: 0};

        const color = 0x638EC4;

        if(line) {
            line.clear();
            line.lineStyle(22, color, 1, 0.5);
            line.moveTo(startPoint.x, startPoint.y);
            line.lineTo(mouse.x, mouse.y);

            line.beginFill(color);
            line.drawCircle(mouse.x, mouse.y, radius);
            line.endFill();

            line.beginFill(color);
            line.drawCircle(startPoint.x, startPoint.y, radius);
            line.endFill();

        }

    }

    findNearestLetter(pointerData: InteractionData) {
        const mousePos = pointerData.global;
        const stopDist = 25;

        for (let i = 0; i < this.letters.children.length; i++) {
            const letter = this.letters.getChildAt(i);

            if(letter instanceof Letter) {

                // if(letter === this.curLetter || (letter !== this.prevLetter && letter.isPicked)) continue

                const letterPos = letter.toGlobal(new PIXI.Point(0, 0));

                const dist = getDistance(letterPos, mousePos);

                if(dist <= stopDist) {
                    // console.log(dist);

                    if(this.pickedLetters.length > 1) {

                        const prevLetter = this.pickedLetters[this.pickedLetters.length - 2];

                        if(letter.id === prevLetter.id) {

                            this.removePrevLetter(letter);

                            break;
                        }

                    }

                    if(letter.id === this.curLetter?.id || letter.isPicked) continue;

                    this.setNewLine(letter);

                    break;
                }
            }
        }
    }

    reset() {
        for (let i = 0; i < this.letters.children.length; i++) {
            const letter = this.letters.getChildAt(i);

            if(letter instanceof Letter) {
                letter.isPicked = false;

                letter.setInactiveFrame();
            }

        }

        this.linesCon.removeChildren();

        this.checkCorrectWord();

        this.pickedLetters.length = 0;
    }

    removePrevLetter(letter: Letter) {

        if(this.curLetter) {
            this.curLetter.isPicked = false;
            this.curLetter.setInactiveFrame();

            this.pickedLetters.pop();

            this.line?.destroy();
            this.linesCon.removeChildAt(this.linesCon.children.length-1)

            letter.setCurLetter(true);
            // this.pickedLetters.pop();
        }

    }

    setNewLine(letter: Letter) {

        this.updateLine(letter);

        letter.setCurLetter();

    }

    checkCorrectWord() {

        const pickedWord = this.pickedLetters.map(letter => letter.textContent.toLowerCase()).join('');

        if(this.correctWords.indexOf(pickedWord) !== -1) {

            if(this.collectedWords.indexOf(pickedWord) === -1) {

                this.collectedWords.push(pickedWord);
                this.lettersPreview.correct();

                GAME_STATE.words.push(pickedWord);

                if(this.WordsContainer) this.WordsContainer.correct(pickedWord);

            } else {
                this.lettersPreview.correctRepeat();

                if(this.WordsContainer) this.WordsContainer.repeat(pickedWord);
            }

        } else {
            this.lettersPreview.incorrect();
        }
    }
}