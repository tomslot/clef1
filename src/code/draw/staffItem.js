import style from "./../../style/_common.scss";

import {staffMetrics} from './staffMetrics.js';

const HIT_CHORD_NOTE_COLOR = "#70A070";
const SHADOW_COLOR = style.COLOR3;
const NOTE_TAIL_SIZE = 55;

export const staffItem = {

    calcCenterOfGravityY(item){
        if (item.centreOfGravityY){
            return item.centreOfGravityY;
        }

        const firstNote = item.notes[0];
        const lastNote = item.notes[item.notes.length - 1];

        const firstY = staffMetrics.calcNoteY(firstNote);
        const lastY = staffMetrics.calcNoteY(lastNote);
        item.centreOfGravityY = (firstY + lastY) / 2;
        return item.centreOfGravityY;
    },

    draw(ctx, item) {
        const staffWidth = staffMetrics.rightScoreEnd - staffMetrics.leftScoreStart;
        const noteX = staffMetrics.rightScoreEnd - game.noteProgress * staffWidth;
        ctx.save();
            ctx.shadowBlur = 5;
            ctx.shadowOffsetX = 3;
            ctx.shadowOffsetY = 3;
            ctx.shadowColor = SHADOW_COLOR;

            const redAmount = parseInt(Math.pow(game.noteProgress, 2) * 255);
            const noteColor = `rgb(${redAmount}, 0, 0)`;
            ctx.fillStyle = noteColor;
            ctx.strokeStyle = noteColor;

            if (game.hitAnimation > 0){
                const shift = (1 - game.hitAnimation) * 150;
                const centerOfGravityY = this.calcCenterOfGravityY(item);
                ctx.translate(shift, -1 * shift);
                ctx.translate(noteX, centerOfGravityY);
                ctx.rotate((1 - game.hitAnimation) * Math.PI);
                ctx.translate(-1 * noteX, -1 * centerOfGravityY);
            }

            this.drawTail(ctx, item, noteX);

            for (const note of item.notes){
                this.drawNote(ctx, note, noteX);
            }
        ctx.restore();
    },

    drawNote(ctx, note, noteX){
        const noteY = staffMetrics.calcNoteY(note);

        ctx.save();
            if (note.hit){
                ctx.fillStyle = HIT_CHORD_NOTE_COLOR;
            }

            if (note.distanceFromMidG === -4 || note.distanceFromMidG === 8) {
                ctx.beginPath();
                ctx.moveTo(noteX - 16, noteY);
                ctx.lineTo(noteX + 16, noteY);
                ctx.stroke();
                ctx.closePath();
            }

            ctx.save();
                let yScale = 0.6;
                ctx.scale(1, yScale);
                ctx.beginPath();
                ctx.arc(noteX, noteY / yScale, 9, 0, Math.PI * 4, false);
                ctx.fill();
                ctx.stroke();
                ctx.closePath();
            ctx.restore();
        ctx.restore();

        if (note.accidental){
            ctx.save();
            ctx.font = `38px Oswald`;
            ctx.textAlign = "left";
            ctx.textBaseline = "middle";
            ctx.fillText(note.accidental, noteX - 34, noteY - staffMetrics.lineDistance / 2);
            ctx.restore();
        }
    },

    drawTail(ctx, item, noteX){
        const bottomNote = item.notes[0];
        const topNote = item.notes[item.notes.length - 1];
        const dir = topNote.distanceFromMidG > 4 ? -1 : 1;

        let bottomY;
        let topY;

        if (dir > 0){
            bottomY = staffMetrics.calcNoteY(bottomNote);
            topY = staffMetrics.calcNoteY(topNote) - NOTE_TAIL_SIZE;
        } else {
            bottomY = staffMetrics.calcNoteY(topNote);
            topY = staffMetrics.calcNoteY(bottomNote) + NOTE_TAIL_SIZE;
        }

        ctx.save();
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.moveTo(noteX + 8, bottomY);
            ctx.lineTo(noteX + 7, topY);
            ctx.closePath();
            ctx.stroke();
        ctx.restore();
    }
}