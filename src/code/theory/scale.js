import {noteBase} from './noteBase.js';

class MajorScale {
    constructor(rootNoteValue){
        this.label = `${noteBase.noteToSymbol(rootNoteValue)} Major`;
        this.notes = [rootNoteValue];
        this.addNote(2);
        this.addNote(2);
        this.addNote(1);
        this.addNote(2);
        this.addNote(2);
        this.addNote(2);

        this.notePalette = [];

        for (let i = noteBase.VISIBLE_MIDI_CODE_MIN; i <= noteBase.VISIBLE_MIDI_CODE_MAX; i ++){
            if (this.notes.includes(i % 12)){
                this.notePalette.push(i);
            }
        }

        console.log(`created ${this.label} scale, palette contains ${this.notePalette.length} notes`);
    }

    addNote(interval){
        const noteValue = noteBase.normalize(this.notes[this.notes.length - 1] + interval);
        this.notes.push(noteValue);
    }
}

export const scale = {
    current: new MajorScale(0)
}