import style from "./../../style/_common.scss";
import {noteBase} from './../noteBase.js';

const COLOR1 = "hsl(34, 41%, 98%)";
const COLOR2 = "#ACB6BD";
const COLOR3 = "hsl(198, 15%, 30%)";
const COLOR4 = "#E4847D";
const COLOR5 = "#E11347";

function drawStripedCircle(ctx, radius, margin, styles){
    const RADIAL_STEP = 2 * Math.PI / 12;

    let start = RADIAL_STEP / 2;
    let odd = false;
    let adjust = Math.PI / -2 - RADIAL_STEP;

    for (let i = 0, note = 0, r = 0; i < 12; i ++, start += RADIAL_STEP, note = (note + 5) % 12){
        let arcStartX = radius + (radius - margin) * Math.cos(start + adjust);
        let arcStartY = radius + (radius - margin) * Math.sin(start + adjust);

        ctx.fillStyle = styles[i % 2];
        ctx.beginPath();

        ctx.moveTo(radius, radius);
        ctx.lineTo(arcStartX, arcStartY);
        ctx.arc(radius, radius, radius - margin, start + adjust, start + RADIAL_STEP + adjust);
        ctx.fill();
        ctx.stroke();
        ctx.save();
        ctx.moveTo(radius, radius);
        
        ctx.save();
        ctx.fillStyle = COLOR1;
        ctx.shadowBlur = 5;
        ctx.shadowOffsetX = 3;
        ctx.shadowOffsetY = 3;
        ctx.shadowColor = COLOR3;
        ctx.translate(radius, radius);
        ctx.rotate(start - RADIAL_STEP / 2);
        ctx.translate(-1 * radius, -1 * radius);
        let noteSymbol = noteBase.noteToSymbol(12 - parseInt(note));
        ctx.fillText(noteSymbol, radius, margin + 5);
        ctx.restore();
        ctx.closePath;
    }
}

export function drawCircle() {
    let canvasElem = document.getElementById('circleOf5');
    let ctx = canvasElem.getContext("2d");
    ctx.strokeStyle = COLOR3;  
    ctx.textAlign = "center";
    ctx.textBaseline = "top"; 
    ctx.font = `18px Oswald`;

    let ringWidth = 50;
    let radius = canvasElem.width / 2;

    let radialFill1 = ctx.createRadialGradient(radius, radius, ringWidth, radius, radius, radius);
    radialFill1.addColorStop(0, COLOR3);
    radialFill1.addColorStop(1, COLOR2);

    let radialFill2 = ctx.createRadialGradient(radius, radius, ringWidth, radius, radius, radius);
    radialFill2.addColorStop(0, COLOR2);
    radialFill2.addColorStop(1, COLOR3);

    drawStripedCircle(ctx, radius, 1, [radialFill1, radialFill2]);
    
    // drawStripedCircle(ctx, radius, ringWidth, [COLOR2, COLOR1]);

    ctx.fillStyle = COLOR1;
    ctx.beginPath();
    ctx.arc(radius, radius, radius - ringWidth, 0, 2 * Math.PI);
    ctx.fill();
    ctx.stroke();
}