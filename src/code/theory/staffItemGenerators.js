import { scale } from './scale.js';
import {Note, noteBase} from './noteBase.js';

export const singleRandomNoteFromCurrentScale = {
    label: 'Single Random Note From Current Scale',

    generate: () => {
        const currentNotePalette = scale.current.notePalette;
        const numberOfNotesInPalette = currentNotePalette.length;
        const randomNoteIndex = parseInt(Math.random() * numberOfNotesInPalette);
        return currentNotePalette[randomNoteIndex];
    }
}

export const randomTriadChordFromCurrentScale = {
    label: 'Random Triad Chord From Current Scale',

    generate: () => {
        const currentNotePalette = scale.current.notePalette;
        const numberOfNotesInPalette = currentNotePalette.length;
        const rootNoteIndex = parseInt(Math.random() * (numberOfNotesInPalette - 5));

        const rootNote = new Note(currentNotePalette[rootNoteIndex]);
        const thirdNote = new Note(currentNotePalette[rootNoteIndex + 2]);
        const fifthNote = new Note(currentNotePalette[rootNoteIndex + 4]);

        const rootNoteLabel = noteBase.noteToSymbol(rootNote.midiValue);
        const thrirdDistance = thirdNote.midiValue - rootNote.midiValue;
        const chordQuality = thrirdDistance == 4 ? 'Major' : 'Minor';

        let chordName = `${rootNoteLabel} ${chordQuality}`;

        return {
            label: chordName,
            notes: [rootNote, thirdNote, fifthNote]
        };
    }
}

export const staffItemGenerator = {
    current: randomTriadChordFromCurrentScale
};