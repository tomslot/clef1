import { noteBase } from './noteBase.js';
import { playNote } from './sound.js';
import { throws } from 'assert';

export const game = {
    noteProgress: 0,
    noteValue: 60,
    hitCount: 0,
    missCount: 0,
    distanceFromMG: 0,
    points: 0,
    paused: true,
    proposedValue: 0,
    missFallout: 0,
    hitAnimation: 0,

    resetNote() {
        this.noteProgress = 0;

        let newNote = noteBase.generateRandNote();

        while (newNote === this.noteValue) {
            newNote = noteBase.generateRandNote();
        }

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
        this.hitAnimation = 1;
    },

    miss() {
        this.missCount++;
        this.points -= 5;

        if (this.points < 0) {
            this.points = 0;
        }
    },

    shoot(note) {
        if (this.paused) {
            game.unpause();
            playNote(note);
            return;
        }

        try {
            playNote(note);
        }
        catch (err) {
            alert(`Error playing sound ${err}`);
        }

        if (this.shootFallout > 0) {
            return;
        }

        if (noteBase.normalize(note) === noteBase.normalize(this.noteValue)) {
            this.hit();
        } else {
            this.miss();
        }

        this.proposedValue = note;
        this.shootFallout = 1;
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
            document.getElementById('helpme').disabled = true;
            this.paused = true;
        }
    },

    unpause() {
        document.getElementById('helpme').disabled = false;
        this.paused = false;
        this.resetNote();
    },

    updateProgress() {
        if (this.paused) {
            return;
        }

        if (this.hitAnimation > 0) {
            this.hitAnimation -= 0.018;

            if (this.hitAnimation <= 0) {
                this.resetNote();
            }
        } else {
            this.noteProgress += 0.002;

            if (this.noteProgress >= 1) {
                this.shootFallout = 1;
                this.proposedValue = -1;
                this.miss();
                this.resetNote();
            }
        }

        this.shootFallout -= 0.02;

        if (this.shootFallout < 0) {
            this.shootFallout = 0;
        }
    }
}