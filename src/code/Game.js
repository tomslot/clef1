import {StaffItemGenerator} from './theory/StaffItemGenerator';
import { playNote } from './io/sound.js';
import { config } from './config.js';
import {ScaleGenerator} from "./theory/ScaleGenerator";
import {VirtualKeyboard} from "./io/VirtualKeyboard";
import {StaffItemRenderer} from "./draw/StaffItemRenderer";
import {Note} from "./theory/noteBase";
import {midiController} from "./io/midiController";

export class Game {
    constructor(exerciseParam, scaleParam) {
        this.noteProgress = 0;
        this.currentStaffItem = {};
        this.hitCount = 0;
        this.missCount = 0;
        this.points = 0;
        this.paused = true;
        this.proposedNote = null;
        this.hitAnimation = 0;
        this.helpAutoTriggered = false;
        this.scaleGenerator = new ScaleGenerator();
        this.scaleGenerator.setScale(scaleParam);
        this.staffItemGenerator =  new StaffItemGenerator(this.scaleGenerator.current, exerciseParam);
        const keyboardContainer = document.getElementById('piano');

        const pageTitle = this.staffItemGenerator.current.label + this.scaleGenerator.current.label;
        document.getElementById('main-title').innerText =  pageTitle;
        document.title = pageTitle;

        document.querySelector('[name=scale]').value = this.scaleGenerator.current.rootNote;

        this.virtualKeyboard = new VirtualKeyboard(keyboardContainer, (noteValue) =>{
            this.shoot(noteValue);
        });

        midiController.start();

        midiController.onNote = (noteValue) =>{
            this.shoot(noteValue);
        };

        this.virtualKeyboard.render();
        const helpButton = document.getElementById('helpme');

        helpButton.addEventListener('click', ()=>{
            this.help();
        });

        this.scaleGenerator.onchange = (scale)=>{
            this.staffItemGenerator.setScale  (scale);
            this.proceedToNextStaffItem();
        };

        this.proceedToNextStaffItem();
    }

    proceedToNextStaffItem() {
        this.noteProgress = 0;
        this.helpAutoTriggered = false;
        this.currentStaffItem = this.staffItemGenerator.generate();
        StaffItemRenderer.render(this.currentStaffItem);
        console.log(`currentStaffItem: ${JSON.stringify(this.currentStaffItem)}`);
    }

    hit() {
        StaffItemRenderer.render(this.currentStaffItem);
        this.hitCount++;
        this.points += 1 + parseInt((1 - this.noteProgress) * 10);

        if (this.currentStaffItem.isFullyResolved()){
            this.hitAnimation = 1;
        }
    }

    miss() {
        this.missCount++;
        this.points -= 5;

        if (this.points < 0) {
            this.points = 0;
        }
    }

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

        if (this.currentStaffItem.matchAnyChordNote(noteValue)) {
            this.hit();
        } else {
            this.miss();
        }

        this.proposedNote = new Note(noteValue, this.scaleGenerator.current.sharpVsFlat);
        this.shootFallout = 1;
        let hitRate = parseInt(this.hitCount / (this.hitCount + this.missCount) * 100);
        let missesLabel = document.getElementById('hitRate');
        missesLabel.setAttribute('value', `${hitRate}%`);

        let pointsLabel = document.getElementById('points');
        pointsLabel.setAttribute('value', this.points);
    }

    togglePaused() {
        if (this.paused) {
            this.unpause();
        }
        else {
            document.getElementById('helpme').disabled = true;
            this.paused = true;
        }
    }

    unpause() {
        document.getElementById('helpme').disabled = false;
        this.paused = false;
        this.proceedToNextStaffItem();
    }

    help(){
        console.log('help()');
        for (const note of this.currentStaffItem.notes){
            this.virtualKeyboard.highlightKey(note.midiValue, config.hideHelpAfterMs);
        }
    }

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

            if (!this.helpAutoTriggered && this.noteProgress >= config.autoTriggerHelpAt) {
                this.helpAutoTriggered = true;
                this.help();
            }

            if (this.noteProgress >= 1) {
                this.shootFallout = 1;
                this.proposedNote= null;
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