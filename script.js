"use strict";

let canvasElem = document.getElementById('score_canvas');

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

    normalize(noteVal) {
        return noteVal % 12;
    },

    isAccidental(noteVal) {
        let normalized = this.normalize(noteVal);
        return this.accidentals.includes(normalized);
    },

    noteToSymbol(noteVal) {
        return this.solphageMap[this.normalize(noteVal)];
    },

    generateRandNote() {
        let r = parseInt(60 + Math.random() * 20);

        if (this.isAccidental(r)) {
            return this.generateRandNote();
        }

        return r;
    },

    calculateTonicDistanceFromMidG(noteValue) {
        const midG = 67;
        let from = Math.min(midG, noteValue);
        let to = Math.max(midG, noteValue);
        let distance = 0;

        for (let i = from; i < to; i++) {
            if (!this.isAccidental(i)) {
                distance++;
            }
        }

        if (noteValue < midG) {
            return -1 * distance;
        }

        return distance;
    },
};

const pentagram = {
    margin: 30,
    clefSpace: 120,
    lineNumber: 5,
    width: 720,
    height: 180,
    lineDistance: 0,
    topLineY: 0,
    leftScoreStart: 0,
    rightScoreEnd: 0,

    resize() {
        let emptySpace = 2 * this.margin + 2 * this.lineNumber;
        let availableSpace = this.height - emptySpace;
        this.lineDistance = availableSpace / this.lineNumber;
        this.topLineY = emptySpace / 2 + this.lineDistance / 2;
        this.leftScoreStart = this.clefSpace;
        this.rightScoreEnd = this.width - this.margin;
    },

    drawLine(ctx, height) {
        ctx.moveTo(this.leftScoreStart, height);
        ctx.lineTo(this.rightScoreEnd, height);
        ctx.stroke();
    },

    draw(ctx) {
        this.resize();
        ctx.clearRect(0, 0, this.width, this.height);

        for (let i = 0; i < this.lineNumber; i++) {
            let y = this.topLineY + i * this.lineDistance;
            this.drawLine(ctx, y);
        }

        let clefFontSize = this.height / 2;
        ctx.font = `${clefFontSize}px Arial`;
        ctx.fillText('\u{1D11E}', this.margin, this.height / 2 + clefFontSize / 2);

        let noteX = this.rightScoreEnd - game.noteProgress * (this.rightScoreEnd - this.leftScoreStart);
        let distanceFromMG = noteBase.calculateTonicDistanceFromMidG(game.noteValue);
        let midGPos = this.topLineY + 3 * this.lineDistance;
        let noteY = midGPos - distanceFromMG * this.lineDistance / 2;

        let redAmount = parseInt(Math.pow(game.noteProgress, 2) * 255);
        let noteColor = `rgb(${redAmount}, 0, 0)`;

        ctx.save();
        ctx.fillStyle = noteColor;
        ctx.strokeStyle = noteColor;
        ctx.save();
        let yScale = 0.75;
        ctx.scale(1, yScale);
        ctx.beginPath();
        ctx.arc(noteX, noteY / yScale, 8, 0, Math.PI * 2, false);
        ctx.fill();
        ctx.closePath();
        ctx.restore();

        ctx.moveTo(noteX + 8, noteY);
        ctx.lineTo(noteX + 8, noteY - 40);
        ctx.stroke();
        ctx.restore();
    }
}


const game = {
    noteProgress: 0,
    noteValue: 60,
    hitCount: 0,
    missCount: 0,

    resetNote() {
        this.noteProgress = 0;
        this.noteValue = noteBase.generateRandNote();
        let nextNoteElement = document.getElementById('nextNote');
        let noteSymbol = noteBase.noteToSymbol(this.noteValue);
        nextNoteElement.innerText = noteSymbol;

        let distance = noteBase.calculateTonicDistanceFromMidG(this.noteValue);
        console.log(`noteValue: ${this.noteValue}, ${noteSymbol}, distance=${distance}`);
    },

    hit() {
        this.resetNote();
        this.hitCount++;
        let missesLabel = document.getElementById('hitCount');
        missesLabel.setAttribute('value', this.hitCount);
    },

    miss() {
        this.missCount++;
        let missesLabel = document.getElementById('missCount');
        missesLabel.setAttribute('value', this.missCount);
    },

    shoot(note) {
        if (noteBase.normalize(note) === noteBase.normalize(this.noteValue)) {
            this.hit();
        } else {
            this.miss();
        }
    },

    updateProgress() {
        this.noteProgress += 0.002;

        if (this.noteProgress >= 1) {
            this.miss();
            this.resetNote();
        }
    }
}

const midiController = {
    start() {
        if (navigator.requestMIDIAccess) {
            navigator.requestMIDIAccess({
                sysex: false
            }).then(this.onMIDISuccess, this.onMIDIFailure);
        } else {
            console.log("No MIDI support in the browser.");
        }
    },

    onMIDIFailure(error) {
        console.log("No access to MIDI devices or your browser doesn't support WebMIDI API. Please use WebMIDIAPIShim " + error);
    },

    onMIDIMessage(message) {
        let data = message.data;

        if ((data[0] & 0xF0) === 0x90) {
            let note = data[1];
            console.log(`note ${note}, ${noteBase.noteToSymbol(note)}, data[0]=${data[0]}`);
            game.shoot(note);
        }
    },

    onMIDISuccess(midiAccess) {
        let midi = midiAccess;
        let inputs = midi.inputs.values();
        let deviceName = '';

        for (var input = inputs.next(); input && !input.done; input = inputs.next()) {
            deviceName += input.value.name;
            input.value.onmidimessage = midiController.onMIDIMessage;
        }

        if (deviceName.length === 0) {
            deviceName = 'none';
        }

        document.getElementById('connectedDevice').setAttribute('value', deviceName);
    }
};

function key(code) {
    game.shoot(code);
}

window.onload = function () {
    let noteElem = document.getElementById('note');
    let nextNoteElement = document.getElementById('nextNoteHint');

    function animate(timestamp) {
        let ctx = canvasElem.getContext("2d");
        pentagram.draw(ctx);
        game.updateProgress();
        let showHint = game.noteProgress > 0.75;
        nextNoteElement.style.display = showHint ? 'block' : 'none';

        window.requestAnimationFrame(animate);
    }

    game.resetNote();
    window.requestAnimationFrame(animate);

    midiController.start();
};