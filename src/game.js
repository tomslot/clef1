import {noteBase} from './noteBase.js';

export const game = {
    noteProgress: 0,
    noteValue: 60,
    previousNoteValue: 0,
    hitCount: 0,
    missCount: 0,
    distanceFromMG: 0,
    points: 0,
    paused: true,

    resetNote() {
        this.noteProgress = 0;

        do {
            var newNote = noteBase.generateRandNote();
        }
        while (newNote === this.previousNoteValue);

        this.previousNoteValue = this.noteValue;
        this.noteValue = newNote;
        this.distanceFromMG = noteBase.calculateTonicDistanceFromMidG(game.noteValue);
        console.log(`noteValue: ${this.noteValue}, ${this.getNextNote()}, distance=${this.distanceFromMG}`);
    },

    getNextNote() {
        return noteBase.noteToSymbol(this.noteValue);
    },

    hit() {
        this.hitCount++;
        this.points += 1 + parseInt((1 - this.noteProgress) * 10);

        this.resetNote();
    },

    miss() {
        this.missCount++;
        this.points -= 5;

        if (this.points < 0) {
            this.points = 0;
        }
    },

    shoot(note) {
        if (noteBase.normalize(note) === noteBase.normalize(this.noteValue)) {
            this.hit();
        } else {
            this.miss();
        }

        let hitRate = parseInt(this.hitCount / (this.hitCount + this.missCount) * 100);
        let missesLabel = document.getElementById('hitRate');
        missesLabel.setAttribute('value', `${hitRate}%`);

        let pointsLabel = document.getElementById('points');
        pointsLabel.setAttribute('value', this.points);
    },

    togglePaused() {
        if (this.paused) {
            this.unpause();
        }
        else {
            this.paused = true;
        }
    },

    unpause() {
        this.paused = false;
        this.resetNote();
    },

    updateProgress() {
        if (this.paused) {
            return;
        }

        this.noteProgress += 0.002;

        if (this.noteProgress >= 1) {
            this.miss();
            this.resetNote();
        }
    }
}