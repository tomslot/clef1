
const left_margin = 100;
const margin = 20;

const canvas = {
  width: 720,
  height: 180
};

const pentagram = {
    margin: {
        default: 20,
        left: 100
    },

    draw: function (ctx) {
        let y = canvas.height / 2;

        let left_score_start = left_margin;
        let right_score_end = canvas.width - margin;

        ctx.moveTo(left_score_start, y);
        ctx.lineTo(right_score_end, y);
        ctx.stroke();
    }
}


window.onload =  function () {
    let canvas = document.getElementById('score_canvas');
    let ctx = canvas.getContext("2d");

    pentagram.draw(ctx);
};