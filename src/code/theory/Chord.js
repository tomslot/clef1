import {Note} from "./noteBase";

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