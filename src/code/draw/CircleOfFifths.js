import {Interval, Note} from '../theory/noteBase';

const COLOR1 = "hsl(34, 41%, 98%)";
const COLOR2 = "#ACB6BD";
const COLOR3 = "hsl(198, 15%, 30%)";
const COLOR4 = "#E4847D";
const COLOR5 = "#E11347";

const COLOR_MAJOR = COLOR5;
const COLOR_MINOR = "#137ae1";
const COLOR_DIMINISHED = "#7abee3";

const RING_WIDTH = 50;

function drawStripedCircle(ctx, radius, margin, scale){
    const FILL_MAJOR = ctx.createRadialGradient(radius, radius, RING_WIDTH, radius, radius, radius);
    FILL_MAJOR.addColorStop(0, COLOR3);
    FILL_MAJOR.addColorStop(1, COLOR_MAJOR);

    const FILL_MAJOR_TONIC = COLOR_MAJOR;

    const FILL_MINOR = ctx.createRadialGradient(radius, radius, RING_WIDTH, radius, radius, radius);
    FILL_MINOR.addColorStop(0, COLOR3);
    FILL_MINOR.addColorStop(1, COLOR_MINOR);

    const FILL_MINOR_TONIC = COLOR_MINOR;

    const FILL_INACTIVE = COLOR3;

    const FILL_DIMINISHED =  ctx.createRadialGradient(radius, radius, RING_WIDTH, radius, radius, radius);
    FILL_DIMINISHED.addColorStop(0, COLOR_DIMINISHED);
    FILL_DIMINISHED.addColorStop(1, COLOR3);

    const FILLS = [FILL_MAJOR, FILL_MAJOR_TONIC, FILL_MAJOR, FILL_MINOR, FILL_MINOR_TONIC, FILL_MINOR, FILL_DIMINISHED];

    const RADIAL_STEP = 2 * Math.PI / 12;

    let start = RADIAL_STEP / 2;
    let adjust = Math.PI / -2 - RADIAL_STEP;

    for (let i = 0, noteValue = 0, r = 0; i < 12; i ++, start += RADIAL_STEP, noteValue = Interval.perfectFifth(noteValue)){
        let arcStartX = radius + (radius - margin) * Math.cos(start + adjust);
        let arcStartY = radius + (radius - margin) * Math.sin(start + adjust);

        const fillIndex = scale.harmonicPosition(noteValue);
        ctx.fillStyle = FILLS[fillIndex] || FILL_INACTIVE;
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
        let noteSymbol = Note.noteToSymbol(noteValue);
        ctx.fillText(noteSymbol, radius, margin + 5);
        ctx.restore();
        ctx.closePath;
    }
}

export class CircleOfFifths{
    constructor(canvas){
        this.diameter = canvas.getBoundingClientRect().width;
        this.canvas = canvas;

        canvas.addEventListener('click', (clickEvt) => {
            if (!this.scale || !this.onscalechange){
                return;
            }

            const currentRoot = this.scale.notes[0];
            const newRoot = Interval.perfectFifth(currentRoot);
            this.onscalechange(newRoot);
        })
    }

    setScale(scale){
        this.scale = scale;
        this.draw();
    }

    draw(){
        const ctx = this.canvas.getContext("2d");
        ctx.strokeStyle = COLOR3;
        ctx.textAlign = "center";
        ctx.textBaseline = "top";
        const radius = this.diameter / 2;
        const fontSize = Math.ceil(0.16 * radius);
        ctx.font = `${fontSize}px Oswald`;
        drawStripedCircle(ctx, radius, 1, this.scale);
        ctx.fillStyle = COLOR1;
        ctx.beginPath();
        ctx.arc(radius, radius, radius - RING_WIDTH, 0, 2 * Math.PI);
        ctx.fill();
        ctx.stroke();
    }
}