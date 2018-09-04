import { noteBase } from './noteBase.js';
import { playNote } from './sound.js';

export const game = {
    noteProgress: 0,
    currentStaffItem: {},
    hitCount: 0,
    missCount: 0,
    points: 0,
    paused: true,
    proposedValue: 0,
    missFallout: 0,
    hitAnimation: 0,

    proceedToNextStaffItem() {
        this.noteProgress = 0;

        this.currentStaffItem = noteBase.generateNextStaffItem();
        console.log(`currentStaffItem: ${JSON.stringify(this.currentStaffItem)}`);
    },

    getNextNote() {
        return this.currentStaffItem.label;
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

        if (noteBase.normalize(note) === this.currentStaffItem.notes[0].normalized) {
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
        this.proceedToNextStaffItem();
    },

    updateProgress() {
        if (this.paused) {
            return;
        }

        if (this.hitAnimation > 0) {
            this.hitAnimation -= 0.018;

            if (this.hitAnimation <= 0) {
                this.proceedToNextStaffItem();
            }
        } else {
            this.noteProgress += 0.002;

            if (this.noteProgress >= 1) {
                this.shootFallout = 1;
                this.proposedValue = -1;
                this.miss();
                this.proceedToNextStaffItem();
            }
        }

        this.shootFallout -= 0.02;

        if (this.shootFallout < 0) {
            this.shootFallout = 0;
        }
    }
}