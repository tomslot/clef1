import style from "./../../style/_common.scss";

import {staffMetrics} from './staffMetrics.js';

const HIT_CHORD_NOTE_COLOR = "#70A070";
const SHADOW_COLOR = style.COLOR3;

export const staffItem = {
    draw(ctx, staffItem) {
        for (const note of staffItem.notes){
            this.drawNote(ctx, note);
        }
    },

    drawNote(ctx, note){
        const staffWidth = staffMetrics.rightScoreEnd - staffMetrics.leftScoreStart;
        const noteX = staffMetrics.rightScoreEnd - game.noteProgress * staffWidth;
        const noteY = staffMetrics.calcNoteY(note);

        let noteColor = HIT_CHORD_NOTE_COLOR;

        if (!note.hit){
            const redAmount = parseInt(Math.pow(game.noteProgress, 2) * 255);
            noteColor = `rgb(${redAmount}, 0, 0)`;
        }

        ctx.save();

        if (game.hitAnimation > 0){
            const shift = (1 - game.hitAnimation) * 150;
            ctx.translate(shift, -1 * shift);
            ctx.translate(noteX, noteY);
            ctx.rotate((1 - game.hitAnimation) * Math.PI);
            ctx.translate(-1 * noteX, -1 * noteY);
        }

        ctx.shadowBlur = 5;
        ctx.shadowOffsetX = 3;
        ctx.shadowOffsetY = 3;
        ctx.shadowColor = SHADOW_COLOR;
        ctx.fillStyle = noteColor;
        ctx.strokeStyle = noteColor;
        ctx.save();
        let yScale = 0.75;
        ctx.scale(1, yScale);
        ctx.beginPath();
        ctx.arc(noteX, noteY / yScale, 9, 0, Math.PI * 4, false);
        ctx.fill();
        ctx.stroke();
        ctx.closePath();
        ctx.restore();
        ctx.save();
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(noteX + 8, noteY);
        let dir = note.distanceFromMidG > 4 ? -1 : 1;
        ctx.lineTo(noteX + 7, noteY - 55 * dir);
        ctx.closePath();
        ctx.stroke();
        ctx.restore();
        ctx.beginPath();

        if (note.distanceFromMidG === -4 || note.distanceFromMidG === 8) {
            ctx.moveTo(noteX - 20, noteY);
            ctx.lineTo(noteX + 20, noteY);
        }

        ctx.stroke();
        ctx.closePath();
        ctx.restore();
    },
}