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

const margin = {
    default: 30,
    left: 120
};

const pentagram = {
    lineNumber: 5,
    width: 720,
    height: 180,
    lineDistance: 0,
    topLineY: 0,
    leftScoreStart: 0,
    rightScoreEnd: 0,

    resize() {
        let emptySpace = 2 * margin.default + 2 * this.lineNumber;
        let availableSpace = this.height - emptySpace;
        this.lineDistance = availableSpace / this.lineNumber;
        this.topLineY = emptySpace / 2 + this.lineDistance / 2;
        this.leftScoreStart = margin.left;
        this.rightScoreEnd = this.width - margin.default;
    },

    drawLine(ctx, height) {
        ctx.moveTo(this.leftScoreStart, height);
        ctx.lineTo(this.rightScoreEnd, height);
        ctx.stroke();
    },

    draw(ctx) {
        this.resize();

        for (let i = 0; i < this.lineNumber; i++) {
            let y = this.topLineY + i * this.lineDistance;
            this.drawLine(ctx, y);
        }

        let clefFontSize = this.height / 2;
        ctx.font = `${clefFontSize}px Arial`;
        ctx.fillText('\u{1D11E}', margin.default, this.height / 2 + clefFontSize / 2);
    }
}

const noteControl = {
    updatePosition(canvasElem, noteElem) {
        let cr = canvasElem.getBoundingClientRect();
        let midGPos = cr.top + 16;
        let distanceFromMG = noteBase.calculateTonicDistanceFromMidG(game.noteValue);
        let noteY = midGPos - distanceFromMG * pentagram.lineDistance / 2;
        let noteX = parseInt(cr.left + cr.width + margin.left - game.noteProgress * cr.width / 100);
        let redAmount = parseInt(Math.pow(game.noteProgress / 100, 2) * 255);
        let noteColor = `rgb(${redAmount}, 0, 0)`;

        let style = noteElem.style;
        style.left = `${noteX}px`;
        style.top = `${noteY}px`;
        style.color = noteColor;

        let showHint = game.noteProgress > 75;
        let nextNoteElement = document.getElementById('nextNoteHint');
        nextNoteElement.style.display = showHint ?  'block' : 'none';
    }
};

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
        nextNoteElement.innerText =  noteSymbol;

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
        this.noteProgress += 0.4;

        if (this.noteProgress >= 100) {
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

        for (var input = inputs.next(); input && !input.done; input = inputs.next()) {
            let deviceName = input.value.name;
            console.log(`Midi device: ${deviceName}`)
            input.value.onmidimessage = midiController.onMIDIMessage;
        }
    }
};

window.onload = function () {
    let canvasElem = document.getElementById('score_canvas');
    let ctx = canvasElem.getContext("2d");
    pentagram.draw(ctx);

    let noteElem = document.getElementById('note');

    function timer() {
        game.updateProgress();
        noteControl.updatePosition(canvasElem, noteElem);
    }

    game.resetNote();
    setInterval(timer, 30);

    midiController.start();
};