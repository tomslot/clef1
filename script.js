"use strict";

const noteBase = {
    solphageMap: {
        0: 'C',
        1: 'C#',
        2: 'D',
        3: 'D#',
        4: 'E',
        5: 'F',
        6: 'F#',
        7: 'G',
        8: 'G#',
        9: 'A',
        10: 'A#',
        11: 'B'
    },

    accidentals: [1, 3, 6, 8, 10], 

    normalize(noteVal){
        return noteVal % 12;
    },

    isAccidental(noteVal){
        let normalized = this.normalize(noteVal);
        return this.accidentals.includes(normalized);
    },

    noteToSymbol(noteVal){
        return this.solphageMap[this.normalize(noteVal)];
    },

    generateRandNote(){
        let r = parseInt(60 + Math.random() * 20);

        if (this.isAccidental(r)){
            return this.generateRandNote();
        }

        return r;
    } 
};

const canvas = {
  width: 720,
  height: 180
};

const margin = {
    default: 30,
    left: 120
};

const pentagram = {
    lineNumber: 5,

    drawLine(ctx, height) {
        let left_score_start = margin.left;
        let right_score_end = canvas.width - margin.default;

        ctx.moveTo(left_score_start, height);
        ctx.lineTo(right_score_end, height);
        ctx.stroke();
    },

    draw(ctx) {
        let emptySpace =  2 * margin.default + 2 * this.lineNumber;
        let availableSpace = canvas.height - emptySpace;
        let lineDistance = availableSpace / this.lineNumber;
        let topLineY = emptySpace / 2 + lineDistance / 2;

        for (let i = 0; i < this.lineNumber; i ++){
            let y = topLineY + i * lineDistance;
            this.drawLine(ctx, y);
        }

        let clefFontSize = canvas.height / 2;
        ctx.font = `${clefFontSize}px Arial`;
        ctx.fillText('\u{1D11E}', margin.default, canvas.height / 2 + clefFontSize / 2);
    }
}

const noteControl = {
    noteProgress: 0,
    noteValue: 60,
    
    resetNote(){
        this.noteProgress = 0;
        this.noteValue = noteBase.generateRandNote();
        let nextNoteElement = document.getElementById('next_note');
        nextNoteElement.innerText = noteBase.noteToSymbol(this.noteValue);
    },

    updateProgress(){
        this.noteProgress += 0.4;

        if (this.noteProgress >= 100){
            this.resetNote();
        }
    },

    updatePosition(canvas, noteElem){
        let cr = canvas.getBoundingClientRect();
        let midGPos = cr.top;
        let noteY = midGPos;
        let noteX = parseInt(cr.left + cr.width + margin.left - this.noteProgress * cr.width / 100);
        let redAmount = parseInt(Math.pow(this.noteProgress/100, 2) * 255);
        let noteColor = `rgb(${redAmount}, 0, 0)`;

        let style = noteElem.style;
        style.left = `${noteX}px`;
        style.top = `${noteY}px`;
        style.color = noteColor;
    }
};

window.onload =  function () {
    let canvas = document.getElementById('score_canvas');
    let ctx = canvas.getContext("2d");
    pentagram.draw(ctx);

    let note = document.getElementById('note');

    function timer(){
        noteControl.updateProgress();
        noteControl.updatePosition(canvas, note);
    }

    noteControl.resetNote();
    setInterval(timer, 30);    
};