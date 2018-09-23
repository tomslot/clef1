import {Note} from "../theory/noteBase";

const ACTIVE_BLACK_KEY_DARK = '#555';
const ACTIVE_WHITE_KEY_LIGHT = '#fff';

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
    3: 6,
    4: 8,
    5: 10
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
        this.redraw();
    }

    redraw() {
        const width = this.canvas.width;
        const height = this.canvas.height;

        const keyWidth = parseInt(width / 7);

        const ctx = this.canvas.getContext("2d");

        ctx.clearRect(0, 0, width, height);

        const FILL_ACTIVE_WHITE = ctx.createLinearGradient(0, 0, keyWidth, height);
        FILL_ACTIVE_WHITE.addColorStop(0, ACTIVE_WHITE_KEY_LIGHT);
        FILL_ACTIVE_WHITE.addColorStop(1, '#eee');

        const FILL_INACTIVE = '#BBB';

        ctx.strokeStyle = '#333';
        for (let i = 0; i < 7; i++) {
            const x = i * keyWidth;
            const noteValue =  WHITE_TO_MIDI[i];
            const active = this.activeNotes.has(noteValue);
            ctx.fillStyle = active ? FILL_ACTIVE_WHITE : FILL_INACTIVE;
            ctx.fillRect(x, 0, keyWidth, height);
            ctx.beginPath();
            ctx.rect(x, 1, keyWidth, height - 2);
            ctx.stroke();

            if (active){
                this.drawKeyLabel(ctx, noteValue, keyWidth, height, x, ACTIVE_BLACK_KEY_DARK);
            }
        }

        const blackKeyHeight = 0.6 * height;
        const blackKeyWidth = parseInt(0.65 * keyWidth);

        const FILL_ACTIVE_BLACK = ctx.createLinearGradient(0, 0, keyWidth, height);
        FILL_ACTIVE_BLACK.addColorStop(0, ACTIVE_BLACK_KEY_DARK);
        FILL_ACTIVE_BLACK.addColorStop(1, '#222');

        for (let i = 1; i < 7; i++) {
            if (i === 3) {
                continue;
            }
            const noteValue =  BLACK_TO_MIDI[i - 1];
            const active = this.activeNotes.has(noteValue);
            ctx.fillStyle = active ? FILL_ACTIVE_BLACK : FILL_INACTIVE;

            const x = i * keyWidth - blackKeyWidth / 2;
            ctx.fillRect(x, 0, blackKeyWidth, blackKeyHeight);
            ctx.beginPath();
            ctx.rect(x, 0, blackKeyWidth, blackKeyHeight);
            ctx.stroke();

            if (active){
                this.drawKeyLabel(ctx, noteValue, blackKeyWidth, blackKeyHeight, x, ACTIVE_WHITE_KEY_LIGHT);
            }
        }
    }

    drawKeyLabel(ctx, noteValue, keyWidth, keyHeight, x, fillStyle){
        ctx.fillStyle = fillStyle;
        ctx.textAlign = "center";
        ctx.font = `14px Oswald`;
        ctx.textBaseline = "middle";
        const noteName = Note.noteToSymbol(noteValue, this.sharpVsFlat);
        const labelY = keyHeight * 0.75;
        ctx.fillText(noteName, x + keyWidth / 2, labelY);
    }
}