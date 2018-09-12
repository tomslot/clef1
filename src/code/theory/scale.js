import { noteBase } from './noteBase.js';
import { game } from '../game.js'
import { createSelectOptions } from '../ui/selectGenerator.js';

class MajorScale {
    constructor(rootNoteValue) {
        const majorKey = noteBase.noteToSymbol(rootNoteValue);
        this.sharpVsFlat = noteBase.defaultSharpVsFlatForNote(rootNoteValue);
        const pararellMinorKey = noteBase.noteToSymbol(rootNoteValue + 3 * 7);

        this.label = `${majorKey}/${pararellMinorKey}m`;
        this.notes = [rootNoteValue];
        this.addNote(2);
        this.addNote(2);
        this.addNote(1);
        this.addNote(2);
        this.addNote(2);
        this.addNote(2);

        this.notePalette = [];

        for (let i = noteBase.VISIBLE_MIDI_CODE_MIN; i <= noteBase.VISIBLE_MIDI_CODE_MAX; i++) {
            if (this.notes.includes(i % 12)) {
                this.notePalette.push(i);
            }
        }

        console.log(`created ${this.label} scale, palette contains ${this.notePalette.length} notes, sharpVsFlat: ${this.sharpVsFlat}`);
    }

    addNote(interval) {
        const noteValue = noteBase.normalize(this.notes[this.notes.length - 1] + interval);
        this.notes.push(noteValue);
    }

    degree(noteValue){
        for (let i = 0; i < this.notes.length; i ++){
            if (this.notes[i] === noteValue){
                return i;
            }
        }

        return null;
    }
}

const cMajorScale = new MajorScale(0);
const eMajorScale = new MajorScale(4);
const exoticScale = new MajorScale(6);

export const scaleGenerator = {
    map: {
        0: cMajorScale,
        4: eMajorScale,
        7: exoticScale
    },
    current: cMajorScale,

    selectByIndex(index) {
        this.current = this.map[index];
        game.proceedToNextStaffItem();
    }
};

createSelectOptions('scale', scaleGenerator);