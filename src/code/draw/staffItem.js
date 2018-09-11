import style from "./../../style/_common.scss";

import {staffMetrics} from './staffMetrics.js';
import {game} from "../game";

const HIT_CHORD_NOTE_COLOR = "#70A070";
const SHADOW_COLOR = style.COLOR3;
const NOTE_TAIL_SIZE = 55;
const OFFSCREEN_IMG_WIDTH = 80;
const noteX = OFFSCREEN_IMG_WIDTH / 2;

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

    draw(ctx, item){
        const staffWidth = staffMetrics.rightScoreEnd - staffMetrics.leftScoreStart;
        const x = staffMetrics.rightScoreEnd - game.noteProgress * staffWidth;

        ctx.save();
            if (game.hitAnimation > 0){
                const shift = (1 - game.hitAnimation) * 150;
                const centerOfGravityY = this.calcCenterOfGravityY(item);
                ctx.translate(shift, -1 * shift);
                ctx.translate(x, centerOfGravityY);
                ctx.rotate((1 - game.hitAnimation) * Math.PI);
                ctx.translate(-1 * x, -1 * centerOfGravityY);
            }

            ctx.drawImage(item.image, x , 0);
        ctx.restore();
    },

    render(item){
        const offScreenCanvas = document.createElement('canvas');
        offScreenCanvas.height = staffMetrics.height;
        offScreenCanvas.width = OFFSCREEN_IMG_WIDTH;
        const ctx = offScreenCanvas.getContext("2d");
        // ctx.fillStyle = 'orange'; //set fill color
        // ctx.fillRect(0, 0, 80, 180);
        this.renderOfflineStaffItemImage(ctx, item);
        item.image = offScreenCanvas;
    },

    renderOfflineStaffItemImage(ctx, item) {
        ctx.save();
            ctx.shadowBlur = 5;
            ctx.shadowOffsetX = 3;
            ctx.shadowOffsetY = 3;
            ctx.shadowColor = SHADOW_COLOR;

            const noteColor = "#333";
            ctx.fillStyle = noteColor;
            ctx.strokeStyle = noteColor;

            this.drawTail(ctx, item, noteX);

            for (const note of item.notes){
                this.drawNote(ctx, note, noteX);
            }
        ctx.restore();
    },

    drawNote(ctx, note){
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
                // ctx.rotate(Math.PI / 8);
                ctx.beginPath();
                ctx.arc(noteX, noteY / yScale, 9, 0, Math.PI * 4, false);
                ctx.fill();
                ctx.stroke();
                ctx.closePath();
            ctx.restore();
        ctx.restore();

        if (note.accidental){
            ctx.save();
            ctx.font = `34px Oswald`;
            ctx.textAlign = "left";
            ctx.textBaseline = "middle";
            ctx.fillText(note.accidental, noteX - 34, noteY - staffMetrics.lineDistance / 2);
            ctx.restore();
        }
    },

    drawTail(ctx, item){
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

        const tailX = noteX - dir *  -8;
        ctx.save();
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(tailX, bottomY);
            ctx.lineTo(tailX, topY);
            ctx.closePath();
            ctx.stroke();
        ctx.restore();
    }
}