import style from "./../../style/_common.scss";

import {game} from '../game';
import {Note, noteBase} from '../noteBase';
import {staffMetrics} from './staffMetrics'
import {staffItem} from './staffItem';

const DEFAULT_COLOR = style.COLOR3;
const HINT_COLOR = style.COLOR3;
const PAUSE_COLOR =  "#E11347";
const MISS_LABEL_COLOR = "#E11347";

export const staff = {
    gClefImage: null,

    drawLine(ctx, height) {
        ctx.beginPath();
        ctx.moveTo(staffMetrics.leftScoreStart, height);
        ctx.lineTo(staffMetrics.rightScoreEnd, height);
        ctx.stroke();
        ctx.closePath();
    },

    drawClef(ctx) {
        ctx.drawImage(this.gClefImage, 0, 10);
    },

    drawHint(ctx, opacity, hint, color = HINT_COLOR){
        ctx.save();
            ctx.font = `bold 32px Oswald`;
            ctx.fillStyle = color;
            ctx.globalAlpha = opacity;
            ctx.textAlign = "center";
            ctx.textBaseline = "bottom";

            ctx.fillText(hint, staffMetrics.clefSpace + (staffMetrics.width - staffMetrics.clefSpace) / 2,
                staffMetrics.height - staffMetrics.margin / 2);

        ctx.restore();
    },

    drawNextNoteHint(ctx) {
        let hint = game.getNextNote();
        const SHOW_HINT_AT = 0.5;
        let opacity = game.noteProgress > SHOW_HINT_AT ? Math.pow((game.noteProgress - SHOW_HINT_AT) / SHOW_HINT_AT, 2) : 0;
        this.drawHint(ctx, opacity, hint);
    },

    drawPaused(ctx) {
        this.drawHint(ctx, 1, 'II', PAUSE_COLOR);
    },

    drawShootFallout(ctx){
        if (game.proposedValue === -1){
            this.drawHint(ctx, game.shootFallout, 'MISS', MISS_LABEL_COLOR);
            return;
        }

        this.drawHint(ctx, game.shootFallout,  noteBase.noteToSymbol(game.proposedValue));

        ctx.save();      
            ctx.lineWidth = 4;
            ctx.globalAlpha = game.shootFallout * 0.4;

            let noteValue = noteBase.normalize(game.proposedValue);

            while (noteValue <= noteBase.VISIBLE_MIDI_CODE_MAX){
                if (noteValue >= noteBase.VISIBLE_MIDI_CODE_MIN){
                    ctx.strokeStyle = (noteValue === game.proposedValue) ? "#E11347": "#E4847D";
                    const note = new Note(noteValue);
                    const y = staffMetrics.calcNoteY(note);
                    this.drawLine(ctx, y);
                }

                noteValue += 12;
            }

        ctx.restore();
    },

    draw(ctx) {
        staffMetrics.resize();
        ctx.clearRect(0, 0, staffMetrics.width, staffMetrics.height);
        ctx.strokeStyle = DEFAULT_COLOR;
        ctx.fillStyle = DEFAULT_COLOR;
        this.drawClef(ctx);

        for (let i = 0; i < staffMetrics.lineNumber; i++) {
            let y = staffMetrics.topLineY + i * staffMetrics.lineDistance;
            this.drawLine(ctx, y);
        }

        ctx.closePath();

        if (game.paused) {
            this.drawPaused(ctx);
        } else {
            staffItem.draw(ctx, game.currentStaffItem);

            if (game.shootFallout > 0){
                this.drawShootFallout(ctx);
            } else {
               this.drawNextNoteHint(ctx);
            }
        }

        ctx.closePath();
    }
}