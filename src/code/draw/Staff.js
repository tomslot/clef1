import style from "./../../style/_common.scss";

import {Interval, Note, noteBase} from '../theory/noteBase';
import {config} from "../config.js";
import {StaffItemRenderer} from "./StaffItemRenderer";

const DEFAULT_COLOR = "#444";
const HINT_COLOR = DEFAULT_COLOR;
const PAUSE_COLOR =  "#E11347";
const MISS_LABEL_COLOR = "#E11347";

export const STAFF_METRICS = {
    width: 640,
    height: 180,
    margin: 25,
    clefSpace: 80

}

STAFF_METRICS.emptySpace = 3 * STAFF_METRICS.margin + 2 * 5;
STAFF_METRICS.availableSpace = STAFF_METRICS.height - STAFF_METRICS.emptySpace;
STAFF_METRICS.lineDistance = STAFF_METRICS.availableSpace / 5;
STAFF_METRICS.topLineY = STAFF_METRICS.margin + STAFF_METRICS.lineDistance / 2;
STAFF_METRICS.leftScoreStart = STAFF_METRICS.clefSpace;
STAFF_METRICS.rightScoreEnd = STAFF_METRICS.width - STAFF_METRICS.margin;
STAFF_METRICS.midGPos = STAFF_METRICS.topLineY + 3 * STAFF_METRICS.lineDistance;

export class Staff {
    constructor(canvas, game){
        this.canvas = canvas;
        this.game = game;
        this.gClefImage = new Image();
        this.gClefImage.src = require("../../gfx/clefG_180.png");
    }

    static calcNoteY(note) {
        return STAFF_METRICS.midGPos - note.distanceFromMidG * STAFF_METRICS.lineDistance / 2;
    }

    drawLine(ctx, height) {
        ctx.beginPath();
        ctx.moveTo(STAFF_METRICS.leftScoreStart, height);
        ctx.lineTo(STAFF_METRICS.rightScoreEnd, height);
        ctx.stroke();
        ctx.closePath();
    }

    drawClef(ctx) {
        ctx.drawImage(this.gClefImage, 0, 10);
    }

    drawHint(ctx, opacity, hint, color = HINT_COLOR){
        ctx.save();
            ctx.font = `32px Oswald`;
            ctx.fillStyle = color;
            ctx.globalAlpha = opacity;
            ctx.textAlign = "center";
            ctx.textBaseline = "bottom";

            ctx.fillText(hint, STAFF_METRICS.clefSpace + (STAFF_METRICS.width - STAFF_METRICS.clefSpace) / 2,
                STAFF_METRICS.height - STAFF_METRICS.margin / 2);

        ctx.restore();
    }

    drawStaffItemHint(ctx) {
        let hint = game.currentStaffItem.label;
        const SHOW_HINT_AT = config.showStaffItemHintAt;
        let opacity = game.noteProgress > SHOW_HINT_AT ? Math.pow((this.game.noteProgress - SHOW_HINT_AT) / SHOW_HINT_AT, 2) : 0;
        this.drawHint(ctx, opacity, hint, '#566b73');
    }

    drawPaused(ctx) {
        this.drawHint(ctx, 1, 'II', PAUSE_COLOR);
    }

    drawShootFallout(ctx){
        if (this.game.proposedNote === null){
            this.drawHint(ctx, this.game.shootFallout, 'MISS', MISS_LABEL_COLOR);
            return;
        }

        const sharpVsFlat = game.scaleGenerator.current.sharpVsFlat;

        this.drawHint(ctx, game.shootFallout, game.proposedNote.symbol);

        ctx.save();      
            ctx.lineWidth = 4;
            ctx.globalAlpha = game.shootFallout * 0.4;

            let noteValue = game.proposedNote.normalized;

            while (noteValue <= noteBase.VISIBLE_MIDI_CODE_MAX){
                if (noteValue >= noteBase.VISIBLE_MIDI_CODE_MIN){
                    ctx.strokeStyle = (noteValue === this.game.proposedNote.midiValue) ? "#E11347": "#E4847D";
                    const note = new Note(noteValue, sharpVsFlat);
                    const y = Staff.calcNoteY(note);
                    this.drawLine(ctx, y);
                }

                noteValue = Interval.octaveUp(noteValue);
            }

        ctx.restore();
    }

    draw() {
        const ctx = this.canvas.getContext("2d");
        ctx.clearRect(0, 0, STAFF_METRICS.width, STAFF_METRICS.height);
        ctx.strokeStyle = DEFAULT_COLOR;
        ctx.fillStyle = DEFAULT_COLOR;
        this.drawClef(ctx);

        for (let i = 0; i < 5; i++) {
            let y = STAFF_METRICS.topLineY + i * STAFF_METRICS.lineDistance;
            this.drawLine(ctx, y);
        }

        ctx.closePath();

        if (this.game.paused) {
            this.drawPaused(ctx);
        } else {
            StaffItemRenderer.draw(ctx, this.game);
        
            if (this.game.shootFallout > 0){
                this.drawShootFallout(ctx);
            } else {
               this.drawStaffItemHint(ctx);
            }
        }

        ctx.closePath();
    }
}