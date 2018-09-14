import { noteBase } from './noteBase.js';
import { game } from '../game.js'
import { createSelectOptions } from '../ui/selectGenerator.js';

const SCALE_ORDER_TO_HARMONIC_ORDER = {
    0: 1,
    1: 3,
    2: 5,
    3: 0,
    4: 2,
    5: 4,
    6: 6
}

export class MajorScale {
    constructor(rootNoteValue) {
        const majorKey = noteBase.noteToSymbol(rootNoteValue);
        this.sharpVsFlat = noteBase.defaultSharpVsFlatForNote(rootNoteValue);
        const pararellMinorKey = noteBase.noteToSymbol(rootNoteValue + 3 * 7);

        this.label = `${majorKey}/${pararellMinorKey}m`;
        this.notes = [rootNoteValue];
        this.position = [];
        this.position[rootNoteValue] = 0;
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
    }

    addNote(interval) {
        const noteValue = noteBase.normalize(this.notes[this.notes.length - 1] + interval);
        this.position[noteValue] = this.notes.length;
        this.notes.push(noteValue);
    }

    degree(noteValue){
        return this.position[noteValue];
    }

    harmonicPosition(noteValue){
        return SCALE_ORDER_TO_HARMONIC_ORDER[this.position[noteValue]];
    }
}

export const scaleGenerator = {
    map: {},
    current: null,

    selectByIndex(index) {
        this.current = this.map[index];
        game.onScaleChanged();
    }
};

for (const n of noteBase.FIFTHS_ORDER){
    scaleGenerator.map[n] = new MajorScale(n);
}

scaleGenerator.current = scaleGenerator.map[0]; // C Major

createSelectOptions('scale', scaleGenerator, noteBase.FIFTHS_ORDER);