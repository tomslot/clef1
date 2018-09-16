import style from "./../../style/_common.scss";
import {Staff, STAFF_METRICS} from "./Staff";

const HIT_CHORD_NOTE_COLOR = "#70A070";
const NOTE_TAIL_SIZE = 55;
const OFFSCREEN_IMG_WIDTH = 80;
const noteX = OFFSCREEN_IMG_WIDTH / 2;

export class StaffItemRenderer {
    static calcCenterOfGravityY(item){
        if (item.centreOfGravityY){
            return item.centreOfGravityY;
        }

        const firstNote = item.notes[0];
        const lastNote = item.notes[item.notes.length - 1];

        const firstY = Staff.calcNoteY(firstNote);
        const lastY = Staff.calcNoteY(lastNote);
        item.centreOfGravityY = (firstY + lastY) / 2;
        return item.centreOfGravityY;
    }

    static draw(ctx, game){
        const item = game.currentStaffItem;
        const staffWidth = STAFF_METRICS.rightScoreEnd;
        const x = STAFF_METRICS.rightScoreEnd - game.noteProgress * staffWidth;
        let y = 0;

        ctx.save();
            if (game.hitAnimation > 0){
                const shift = (1 - game.hitAnimation) * 150;
                const centerOfGravityY = this.calcCenterOfGravityY(item);
                ctx.translate(shift, -1 * shift);
                ctx.translate(x, centerOfGravityY);
                ctx.rotate((1 - game.hitAnimation) * Math.PI);
                ctx.translate(-1 * x, -1 * centerOfGravityY);
            }

            if (game.noteProgress > 0.9){
                y = (game.noteProgress - 0.9) * 10 * STAFF_METRICS.height;
            }

            ctx.drawImage(item.image, x , y);
        ctx.restore();
    }

    static render(item){
        const offScreenCanvas = document.createElement('canvas');
        offScreenCanvas.height = STAFF_METRICS.height;
        offScreenCanvas.width = OFFSCREEN_IMG_WIDTH;
        const ctx = offScreenCanvas.getContext("2d");
        // ctx.fillStyle = 'orange'; //set fill color
        // ctx.fillRect(0, 0, 80, 180);
        StaffItemRenderer.renderOfflineStaffItemImage(ctx, item);
        item.image = offScreenCanvas;
    }

    static renderOfflineStaffItemImage(ctx, item) {
        ctx.save();
            const noteColor = "#333";
            ctx.fillStyle = noteColor;
            ctx.strokeStyle = noteColor;

            this.drawTail(ctx, item, noteX);

            for (const note of item.notes){
                StaffItemRenderer.drawNote(ctx, note, noteX);
            }
        ctx.restore();
    }

    static drawNote(ctx, note){
        const noteY = Staff.calcNoteY(note);

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
            ctx.font = `30px Oswald`;
            ctx.textAlign = "left";
            ctx.textBaseline = "middle";
            ctx.fillText(note.accidental, noteX - 30, noteY - STAFF_METRICS.lineDistance / 2 + 3);
            ctx.restore();
        }
    }

    static drawTail(ctx, item){
        const bottomNote = item.notes[0];
        const topNote = item.notes[item.notes.length - 1];
        const dir = topNote.distanceFromMidG > 4 ? -1 : 1;

        let bottomY;
        let topY;

        if (dir > 0){
            bottomY = Staff.calcNoteY(bottomNote);
            topY = Staff.calcNoteY(topNote) - NOTE_TAIL_SIZE;
        } else {
            bottomY = Staff.calcNoteY(topNote);
            topY = Staff.calcNoteY(bottomNote) + NOTE_TAIL_SIZE;
        }

        const tailX = noteX - dir *  -8;
        ctx.save();
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(tailX, bottomY);
            ctx.lineTo(tailX, topY);
            ctx.closePath();
            ctx.stroke();
        ctx.restore();
    }
}