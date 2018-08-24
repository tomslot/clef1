import {game} from './game.js';
import {noteBase} from './noteBase.js';

export const pentagram = {
    margin: 25,
    clefSpace: 120,
    lineNumber: 5,
    width: 640,
    height: 180,
    lineDistance: 0,
    topLineY: 0,
    leftScoreStart: 0,
    rightScoreEnd: 0,

    resize() {
        let emptySpace = 3 * this.margin + 2 * this.lineNumber;
        let availableSpace = this.height - emptySpace;
        this.lineDistance = availableSpace / this.lineNumber;
        this.topLineY = this.margin + this.lineDistance / 2;
        this.leftScoreStart = this.clefSpace;
        this.rightScoreEnd = this.width - this.margin;
    },

    drawLine(ctx, height) {
        ctx.beginPath();
        ctx.moveTo(this.leftScoreStart, height);
        ctx.lineTo(this.rightScoreEnd, height);
        ctx.stroke();
        ctx.closePath();
    },

    drawNote(ctx) {
        let noteX = this.rightScoreEnd - game.noteProgress * (this.rightScoreEnd - this.leftScoreStart);
        let midGPos = this.topLineY + 3 * this.lineDistance;
        let noteY = midGPos - game.distanceFromMG * this.lineDistance / 2;

        let redAmount = parseInt(Math.pow(game.noteProgress, 2) * 255);
        let noteColor = `rgb(${redAmount}, 0, 0)`;

        ctx.save();
        ctx.shadowBlur = 5;
        ctx.shadowOffsetX = 3;
        ctx.shadowOffsetY = 3;
        ctx.shadowColor = '#A0A0A0';
        ctx.fillStyle = noteColor;
        ctx.strokeStyle = noteColor;
        ctx.save();
        let yScale = 0.75;
        ctx.scale(1, yScale);
        ctx.beginPath();
        ctx.arc(noteX, noteY / yScale, 9, 0, Math.PI * 2, false);
        ctx.fill();
        ctx.stroke();
        ctx.closePath();
        ctx.restore();
        ctx.save();
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(noteX + 8, noteY);
        let dir = game.distanceFromMG > 5 ? -1 : 1;
        ctx.lineTo(noteX + 7, noteY - 55 * dir);
        ctx.closePath();
        ctx.stroke();
        ctx.restore();
        ctx.beginPath();

        if (game.distanceFromMG === -4 || game.distanceFromMG === 8) {
            ctx.moveTo(noteX - 20, noteY);
            ctx.lineTo(noteX + 20, noteY);
        }

        ctx.stroke();
        ctx.closePath();
        ctx.restore();
    },

    drawClef(ctx) {
        let clefFontSize = this.height / 2;
        ctx.font = `${clefFontSize}px Arial`;
        ctx.fillText('\u{1D11E}', this.margin, this.height / 2 + clefFontSize / 2 - this.margin);
    },

    drawHint(ctx, opacity, hint, color = '#909090'){
        ctx.save();
            ctx.font = `bold 36px Arial`;
            ctx.fillStyle = color;
            ctx.globalAlpha = opacity;
            ctx.textAlign = "center";
            ctx.textBaseline = "bottom"; 
            ctx.fillText(hint, this.clefSpace + (this.width - this.clefSpace) / 2, this.height - this.margin / 2);
        ctx.restore();
    },

    drawNextNoteHint(ctx) {
        let hint = game.getNextNote();
        const SHOW_HINT_AT = 0.5;
        let opacity = game.noteProgress > SHOW_HINT_AT ? Math.pow((game.noteProgress - SHOW_HINT_AT) / SHOW_HINT_AT, 2) : 0;
        this.drawHint(ctx, opacity, hint);
    },

    drawPaused(ctx) {
        this.drawHint(ctx, 1, 'II', '#A07070');
    },

    drawShootFallout(ctx){
        let lbl = game.proposedValue === -1 ? 'MISS' : noteBase.noteToSymbol(game.proposedValue);
        this.drawHint(ctx, game.shootFallout, lbl);
    },

    draw(ctx) {
        this.resize();
        ctx.clearRect(0, 0, this.width, this.height);
        ctx.strokeStyle = '#505050';
        ctx.fillStyle = '#505050';
        this.drawClef(ctx);

        for (let i = 0; i < this.lineNumber; i++) {
            let y = this.topLineY + i * this.lineDistance;
            this.drawLine(ctx, y);
        }
        ctx.closePath();

        if (game.paused) {
            this.drawPaused(ctx);
        } else {
            this.drawNote(ctx);
            if (game.shootFallout > 0){
                this.drawShootFallout(ctx);
            } else {
               this.drawNextNoteHint(ctx);
            }
        }

        ctx.closePath();
    }
}