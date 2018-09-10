import { scaleGenerator } from './scale.js';
import {Note, noteBase} from './noteBase.js';
import {game} from '../game.js';
import {createSelectOptions} from '../ui/selectGenerator.js'; 

const singleRandomNoteFromCurrentScale = {
    label: 'Single Random Note',

    generate: () => {
        const currentNotePalette = scaleGenerator.current.notePalette;
        const numberOfNotesInPalette = currentNotePalette.length;
        const randomNoteIndex = parseInt(Math.random() * numberOfNotesInPalette);
        const noteValue = currentNotePalette[randomNoteIndex];

        return {
            label: noteBase.noteToSymbol(noteValue),
            notes: [new Note(noteValue)]
        }
    }
}

const randomTriadChordFromCurrentScale = {
    label: 'Random Triad Chord',

    generate: () => {
        const currentNotePalette = scaleGenerator.current.notePalette;
        const numberOfNotesInPalette = currentNotePalette.length;
        const rootNoteIndex = parseInt(Math.random() * (numberOfNotesInPalette - 5));

        const rootNote = new Note(currentNotePalette[rootNoteIndex]);
        const thirdNote = new Note(currentNotePalette[rootNoteIndex + 2]);
        const fifthNote = new Note(currentNotePalette[rootNoteIndex + 4]);

        const rootNoteLabel = noteBase.noteToSymbol(rootNote.midiValue);
        const thrirdDistance = thirdNote.midiValue - rootNote.midiValue;
        let chordQuality = 'Major';

        if (thrirdDistance !== 4){
            const thirdToFifthDistance = fifthNote.midiValue - thirdNote.midiValue;
            chordQuality = thirdToFifthDistance === 4 ? 'Minor' : 'Diminished';
        }

        let chordName = `${rootNoteLabel} ${chordQuality}`;

        return {
            label: chordName,
            notes: [rootNote, thirdNote, fifthNote]
        };
    }
}

export const staffItemGenerator = {
    map: {0 : singleRandomNoteFromCurrentScale, 1 : randomTriadChordFromCurrentScale},
    current: singleRandomNoteFromCurrentScale,
    previouslyGeneratedRoot: -1,

    selectByIndex(index){
        this.current = this.map[index];
        game.proceedToNextStaffItem();
        console.log(`selected: ${this.current.label}`);
    },

    generate(){
        let staffItem;

        do {
            staffItem = this.current.generate();
        } 
        while (staffItem.notes[0].midiValue === this.previouslyGeneratedRoot);

        this.previouslyGeneratedRoot = staffItem.notes[0].midiValue;
        return staffItem;
    }
};

createSelectOptions('exercise', staffItemGenerator);