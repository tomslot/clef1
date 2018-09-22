import {Note} from "./noteBase";

export const ROMAN_NUMERALS = {
    1: 'I',
    2: 'ii',
    3: 'iii',
    4: 'IV',
    5: 'V',
    6: 'vi',
    7: 'vii'
};

export class Chord {
    constructor(label, notes) {
        this.label = label;
        this.notes = notes;
    }

    matchAnyChordNote(noteValue) {
        const normalizedNoteValue = Note.normalize(noteValue);

        for (const note of this.notes) {
            if (!note.hit && note.normalized === normalizedNoteValue) {
                note.hit = true;
                return true;
            }
        }

        return false;
    }

    isFullyResolved() {
        for (const note of this.notes) {
            if (!note.hit) {
                return false;
            }
        }

        return true;
    }
}