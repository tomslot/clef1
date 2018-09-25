import {Note} from "../theory/noteBase";

const ACTIVE_BLACK_KEY_DARK = '#555';
const ACTIVE_WHITE_KEY_LIGHT = '#fff';

const inactiveBgImage = new Image();
// inactiveBgImage.src = require("../../gfx/inactive_key_bg.png");

const WHITE_TO_MIDI = {
    0: 0,
    1: 2,
    2: 4,
    3: 5,
    4: 7,
    5: 9,
    6: 11
};

const BLACK_TO_MIDI = {
    0: 1,
    1: 3,
    2: 6,
    3: 8,
    4: 10
};

export class KeyboardGlymph {
    constructor(canvas, scale) {
        this.canvas = canvas;
        this.activeNotes = new Set();
        this.sharpVsFlat = true;

        if (scale){
            this.setScale(scale);
        }

        this.redraw();
    }

    setScale(scale){
        this.scale = scale;
        this.sharpVsFlat = scale.sharpVsFlat;
    }

    setActiveNotes(activeNotes) {
        this.activeNotes = new Set(activeNotes);

        let previousNote = activeNotes[0];
        const exactNotes = [];
        let nextOctave = false;

        for (let note of activeNotes){
            if (!nextOctave && previousNote > note){
                nextOctave = true;
            }

            const exactNote = nextOctave ? note + 12 : note;
            exactNotes.push(exactNote);
        }

        this.exactActiveNotes = new Set(exactNotes);
        this.redraw();
    }

    redraw() {
        const octaveCount = 2;
        const whiteKeysInOctaveCount = 7;
        const totalWhiteKeysCount = octaveCount * whiteKeysInOctaveCount;
        const blackKeysInOctaveCount = 5;
        const totalBlackKeysCount = octaveCount * blackKeysInOctaveCount;
        const width = this.canvas.width;
        const height = this.canvas.height;

        const keyWidth = parseInt(width / totalWhiteKeysCount);

        const ctx = this.canvas.getContext("2d");

        ctx.clearRect(0, 0, width, height);

        const FILL_WHITE_DIRECT_MATCH = ctx.createLinearGradient(0, 0, keyWidth, height);
        FILL_WHITE_DIRECT_MATCH.addColorStop(0, ACTIVE_WHITE_KEY_LIGHT);
        FILL_WHITE_DIRECT_MATCH.addColorStop(1, '#eee');

        const FILL_WHITE_WEAK_MATCH = '#eee';
        const FILL_BLACK_WEAK_MATCH = '#777';
        const FILL_INACTIVE = ctx.createPattern(inactiveBgImage, "repeat") || '#e8f4f7';

        ctx.strokeStyle = '#333';
        for (let i = 0; i < totalWhiteKeysCount; i++) {
            const x = i * keyWidth;
            const noteValue =  WHITE_TO_MIDI[i % whiteKeysInOctaveCount] + Math.floor(i / whiteKeysInOctaveCount) * 12;
            const weakMatch = this.activeNotes.has(noteValue % 12);
            const directMatch = weakMatch && this.exactActiveNotes.has(noteValue);
            ctx.fillStyle = directMatch ? FILL_WHITE_DIRECT_MATCH : weakMatch ? FILL_WHITE_WEAK_MATCH : FILL_INACTIVE;
            ctx.fillRect(x, 0, keyWidth, height);
            ctx.beginPath();
            ctx.rect(x, 1, keyWidth, height - 2);
            ctx.stroke();

            if (directMatch){
                this.drawKeyLabel(ctx, noteValue, keyWidth, height, x, ACTIVE_BLACK_KEY_DARK);
            }
        }

        const blackKeyHeight = 0.6 * height;
        const blackKeyWidth = parseInt(0.65 * keyWidth);

        const FILL_BLACK_DIRECT_MATCH = ctx.createLinearGradient(0, 0, keyWidth, height);
        FILL_BLACK_DIRECT_MATCH.addColorStop(0, ACTIVE_BLACK_KEY_DARK);
        FILL_BLACK_DIRECT_MATCH.addColorStop(1, '#222');

        for (let i = 0; i < totalBlackKeysCount; i++) {
            const noteValue =  BLACK_TO_MIDI[i % blackKeysInOctaveCount] + + Math.floor(i / blackKeysInOctaveCount) * 12;;
            const weakMatch = this.activeNotes.has(noteValue % 12);
            const directMatch = weakMatch && this.exactActiveNotes.has(noteValue);
            ctx.fillStyle = directMatch ? FILL_BLACK_DIRECT_MATCH : weakMatch ? FILL_BLACK_WEAK_MATCH : FILL_INACTIVE;

            let s = i + 1;

            if (i > 1){
                s ++;
            }
            if (i > 4){
                s ++;
            }
            if (i > 6){
                s ++;
            }

            const x = s * keyWidth - blackKeyWidth / 2;
            ctx.fillRect(x, 0, blackKeyWidth, blackKeyHeight);
            ctx.beginPath();
            ctx.rect(x, 0, blackKeyWidth, blackKeyHeight);
            ctx.stroke();

            if (directMatch){
                this.drawKeyLabel(ctx, noteValue, blackKeyWidth, blackKeyHeight, x, ACTIVE_WHITE_KEY_LIGHT);
            }
        }
    }

    drawKeyLabel(ctx, noteValue, keyWidth, keyHeight, x, fillStyle){
        ctx.fillStyle = fillStyle;
        ctx.textAlign = "center";
        ctx.font = `bold 14px Oswald`;
        ctx.textBaseline = "middle";
        const noteName = Note.noteToSymbol(noteValue, this.sharpVsFlat);
        const labelY = keyHeight * 0.75;
        ctx.fillText(noteName, x + keyWidth / 2, labelY);
    }
}