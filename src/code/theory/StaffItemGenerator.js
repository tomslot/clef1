import {Note} from './noteBase';
import {Chord} from "./Chord";

const ROMAN_NUMERALS = {
    1: 'I',
    2: 'ii',
    3: 'iii',
    4: 'IV',
    5: 'V',
    6: 'vi',
    7: 'vii'
};

class SingleRandomNoteFromCurrentScale {
    constructor(staffItemGenerator){
        this.label = 'Practice random single notes in the scale of ';
        this.staffItemGenerator = staffItemGenerator;
    }

    generate(){
        const scale = this.staffItemGenerator.scale;
        const currentNotePalette = scale.notePalette;
        const numberOfNotesInPalette = currentNotePalette.length;
        const randomNoteIndex = parseInt(Math.random() * numberOfNotesInPalette);
        const noteValue = currentNotePalette[randomNoteIndex];
        const sharpVsFlat = scale.sharpVsFlat;
        const note = new Note(noteValue, sharpVsFlat);
        return new Chord(note.symbol, [note]);
    }
}

class RandomTriadChordFromCurrentScale {
    constructor(staffItemGenerator){
        this.label = 'Practice random triad chords in the scale of ';
        this.staffItemGenerator = staffItemGenerator;
    }

    generate(){
        const scale = this.staffItemGenerator.scale;
        const currentNotePalette = scale.notePalette;
        const numberOfNotesInPalette = currentNotePalette.length;
        const rootNoteIndex = parseInt(Math.random() * (numberOfNotesInPalette - 5));

        const sharpVsFlat = scale.sharpVsFlat;

        const rootNote = new Note(currentNotePalette[rootNoteIndex], sharpVsFlat);
        const thirdNote = new Note(currentNotePalette[rootNoteIndex + 2], sharpVsFlat);
        const fifthNote = new Note(currentNotePalette[rootNoteIndex + 4], sharpVsFlat);

        const thirdDistance = thirdNote.midiValue - rootNote.midiValue;
        const chordNumber = ROMAN_NUMERALS[scale.degree(rootNote.normalized) + 1];

        let chordQuality = 'Major';

        if (thirdDistance !== 4){
            const thirdToFifthDistance = fifthNote.midiValue - thirdNote.midiValue;
            chordQuality = thirdToFifthDistance === 4 ? 'Minor' : 'Diminished';
        }

        let chordName = `${rootNote.symbol} ${chordQuality} (${chordNumber})`;

        return new Chord(chordName, [rootNote, thirdNote, fifthNote]);
    }
}

export class StaffItemGenerator {
    constructor(scale, exerciseParam){
        this.setScale(scale);

        if (exerciseParam === 'Random_Chords'){
            this.current = new RandomTriadChordFromCurrentScale(this);
        } else {
            this.current = new SingleRandomNoteFromCurrentScale(this);
        }

        this.previouslyGeneratedRoot = -1;
    }

    generate(){
        let staffItem;

        do {
            staffItem = this.current.generate();
        } 
        while (staffItem.notes[0].midiValue === this.previouslyGeneratedRoot);

        this.previouslyGeneratedRoot = staffItem.notes[0].midiValue;
        return staffItem;
    }

    setScale(scale){
        this.scale = scale;
    }
}