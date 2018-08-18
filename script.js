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
        let emptySpace =  2 * margin.default + 2 * pentagram.lineNumber;
        let availableSpace = canvas.height - emptySpace;
        let lineDistance = availableSpace / pentagram.lineNumber;
        let topLineY = emptySpace / 2 + lineDistance / 2;

        for (let i = 0; i < pentagram.lineNumber; i ++){
            let y = topLineY + i * lineDistance;
            this.drawLine(ctx, y);
        }

        let clefFontSize = canvas.height / 2;
        ctx.font = `${clefFontSize}px Arial`;
        ctx.fillText('\u{1D11E}', margin.default, canvas.height / 2 + clefFontSize / 2);
    }
}

window.onload =  function () {
    let canvas = document.getElementById('score_canvas');
    let ctx = canvas.getContext("2d");

    let note = document.getElementById('note');
    let noteX = 0;
    let noteY = 80;
    let noteProgress = 0;
    let noteValue;

    function resetNote(){
        noteProgress = 0;
        let nextNoteElement = document.getElementById('next_note');
        noteValue = noteBase.generateRandNote();
        nextNoteElement.innerText = noteBase.noteToSymbol(noteValue);
    }

    function updateNoteProgress(){
        noteProgress += 0.4;

        if (noteProgress >= 100){
            resetNote();
        }
    }

    function timer(){
        let cr = canvas.getBoundingClientRect();
        noteY = cr.top;

        noteX = parseInt(cr.left + cr.width + margin.left - noteProgress * cr.width / 100);
        let redAmount = parseInt(Math.pow(noteProgress/100, 2) * 255);
        let noteColor = `rgb(${redAmount}, 0, 0)`;

        updateNoteProgress();

        note.style.left = `${noteX}px`;
        note.style.top = `${noteY}px`;
        note.style.color = noteColor;
    }

    resetNote();
    setInterval(timer, 30);

    pentagram.draw(ctx);
};