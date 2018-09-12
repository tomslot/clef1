import { scaleGenerator } from './scale.js';
import {Note, noteBase} from './noteBase.js';
import {game} from '../game.js';
import {createSelectOptions} from '../ui/selectGenerator.js';

const ROMAN_NUMERALS = {
    1: 'I',
    2: 'II',
    3: 'III',
    4: 'IV',
    5: 'V',
    6: 'VI',
    7: 'VII'
}

const singleRandomNoteFromCurrentScale = {
    label: 'Single Random Note',

    generate: () => {
        const currentNotePalette = scaleGenerator.current.notePalette;
        const numberOfNotesInPalette = currentNotePalette.length;
        const randomNoteIndex = parseInt(Math.random() * numberOfNotesInPalette);
        const noteValue = currentNotePalette[randomNoteIndex];
        const sharpVsFlat = scaleGenerator.current.sharpVsFlat;

        return {
            label: noteBase.noteToSymbol(noteValue, sharpVsFlat),
            notes: [new Note(noteValue, sharpVsFlat)]
        }
    }
}

const randomTriadChordFromCurrentScale = {
    label: 'Random Triad Chord',

    generate: () => {
        const currentNotePalette = scaleGenerator.current.notePalette;
        const numberOfNotesInPalette = currentNotePalette.length;
        const rootNoteIndex = parseInt(Math.random() * (numberOfNotesInPalette - 5));

        const sharpVsFlat = scaleGenerator.current.sharpVsFlat;

        const rootNote = new Note(currentNotePalette[rootNoteIndex], sharpVsFlat);
        const thirdNote = new Note(currentNotePalette[rootNoteIndex + 2], sharpVsFlat);
        const fifthNote = new Note(currentNotePalette[rootNoteIndex + 4], sharpVsFlat);

        const thirdDistance = thirdNote.midiValue - rootNote.midiValue;
        const chordNumber = ROMAN_NUMERALS[scaleGenerator.current.degree(rootNote.normalized) + 1];

        let chordQuality = 'Major';

        if (thirdDistance !== 4){
            const thirdToFifthDistance = fifthNote.midiValue - thirdNote.midiValue;
            chordQuality = thirdToFifthDistance === 4 ? 'Minor' : 'Diminished';
        }

        let chordName = `${rootNote.symbol} ${chordQuality} (${chordNumber})`;

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