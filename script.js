const canvas = {
  width: 720,
  height: 180
};

const margin = {
    default: 30,
    left: 100
};

const pentagram = {
    lineNumber: 5,

    drawLine: function (ctx, height) {
        let left_score_start = margin.left;
        let right_score_end = canvas.width - margin.default;

        ctx.moveTo(left_score_start, height);
        ctx.lineTo(right_score_end, height);
        ctx.stroke();
    },

    draw: function (ctx) {
        let emptySpace =  2 * margin.default + 2 * pentagram.lineNumber;
        let availableSpace = canvas.height - emptySpace;
        let lineDistance = availableSpace / pentagram.lineNumber;
        let topLineY = emptySpace / 2 + lineDistance / 2;

        for (i = 0; i < pentagram.lineNumber; i ++){
            let y = topLineY + i * lineDistance;
            pentagram.drawLine(ctx, y);
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

    function updateNoteProgress(){
        noteProgress += 0.5;

        if (noteProgress >= 100){
            noteProgress = 0;
        }
    }

    function timer(){
        let cr = canvas.getBoundingClientRect();
        noteY = cr.top;

        noteX = parseInt(cr.left + cr.width + margin.left - noteProgress * cr.width / 100);

        updateNoteProgress();

        note.style.left = `${noteX}px`;
        note.style.top = `${noteY}px`;
    }

    setInterval(timer, 30);

    pentagram.draw(ctx);
};