import { noteBase } from './noteBase.js';
import { createSelectOptions } from '../ui/selectGenerator.js';
import {FIFTHS_ORDER, Note} from "./noteBase";

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
        const majorKey = Note.noteToSymbol(rootNoteValue);
        this.sharpVsFlat = Note.defaultSharpVsFlatForNote(rootNoteValue);
        const parallelMinorKey = Note.noteToSymbol(rootNoteValue + 3 * 7);

        this.label = `${majorKey}/${parallelMinorKey}m`;
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
        const noteValue = Note.normalize(this.notes[this.notes.length - 1] + interval);
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

export class ScaleGenerator  {
    constructor() {
        this.map = {};

        for (const n of FIFTHS_ORDER){
            this.map[n] = new MajorScale(n);
        }

        this.current = this.map[0];
    }

    setScale(rootNote){
        this.selectElement.value = rootNote;
        this.selectElement.onchange();
    }
}