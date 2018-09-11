import { noteBase } from './theory/noteBase.js';
import { staffItemGenerator } from './theory/staffItemGenerators';
import { playNote } from './io/sound.js';
import { staffItem} from './draw/staffItem.js';

function isStaffItemFullyResolved(staffItem){
    for (const note of staffItem.notes){
        if (!note.hit){
            return false;
        }
    }

    return true;
}

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
    helpAutoTriggered: false,

    proceedToNextStaffItem() {
        this.noteProgress = 0;
        this.helpAutoTriggered = false;
        this.currentStaffItem = staffItemGenerator.generate();
        this.renderStaffItem();
        console.log(`currentStaffItem: ${JSON.stringify(this.currentStaffItem)}`);
    },

    renderStaffItem(){
        staffItem.render(this.currentStaffItem);
    },

    getNextNote() {
        return this.currentStaffItem.label;
    },

    hit() {
        this.renderStaffItem();
        this.hitCount++;
        this.points += 1 + parseInt((1 - this.noteProgress) * 10);

        if (isStaffItemFullyResolved(this.currentStaffItem)){
            this.hitAnimation = 1;
        }
    },

    miss() {
        this.missCount++;
        this.points -= 5;

        if (this.points < 0) {
            this.points = 0;
        }
    },

    matchAnyChordNote(staffItem, noteValue){
        const normalizedNoteValue = noteBase.normalize(noteValue);

        for (const note of staffItem.notes){
            if (!note.hit && note.normalized === normalizedNoteValue){
                note.hit = true;
                return true;
            }
        }

        return false;
    },

    shoot(noteValue) {
        if (this.paused) {
            game.unpause();
            playNote(noteValue);
            return;
        }

        try {
            playNote(noteValue);
        }
        catch (err) {
            alert(`Error playing sound ${err}`);
        }

        if (this.shootFallout > 0) {
            return;
        }

        if (this.matchAnyChordNote(this.currentStaffItem, noteValue)) {
            this.hit();
        } else {
            this.miss();
        }

        this.proposedValue = noteValue;
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
            this.noteProgress += 0.0013;

            if (!this.helpAutoTriggered && this.noteProgress >= 0.8) {
                this.helpAutoTriggered = true;
                window.help();
            }

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