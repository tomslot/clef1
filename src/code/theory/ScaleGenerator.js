import { noteBase } from './noteBase.js';
import {FIFTHS_ORDER, Interval, Note} from "./noteBase";
import {Chord, ROMAN_NUMERALS} from "./Chord";

const MAJOR_CHORD_QUALITY = 'Major';
const MINOR_CHORD_QUALITY = 'Minor';
const DIMINISHED_CHORD_QUALITY = 'Diminished';

const SCALE_ORDER_TO_HARMONIC_ORDER = {
    0: 1,
    1: 3,
    2: 5,
    3: 0,
    4: 2,
    5: 4,
    6: 6
};

export class MajorScale {
    constructor(rootNoteValue) {
        const majorKey = Note.noteToSymbol(rootNoteValue);
        this.sharpVsFlat = Note.defaultSharpVsFlatForNote(rootNoteValue);
        const parallelMinorKey = Note.noteToSymbol(rootNoteValue + 3 * 7);

        this.label = `${majorKey}/${parallelMinorKey}m`;
        this.rootNote = rootNoteValue;
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

        this.chordsByRootNote = {};

        this.chordsByQuality = {};
        this.chordsByQuality[MAJOR_CHORD_QUALITY] = [];
        this.chordsByQuality[MINOR_CHORD_QUALITY] = [];
        this.chordsByQuality[DIMINISHED_CHORD_QUALITY] = [];

        this.generateTriadChords();
    }

    generateTriadChords(){
        for (let rootNoteIndex = 0; rootNoteIndex < this.notes.length; rootNoteIndex ++){
            const rootNote = new Note(this.notes[rootNoteIndex], this.sharpVsFlat);
            const thirdNote = new Note(this.notes[(rootNoteIndex + 2) % this.notes.length], this.sharpVsFlat);
            const fifthNote = new Note(this.notes[(rootNoteIndex + 4) % this.notes.length], this.sharpVsFlat);

            const thirdDistance = Interval.calculateDistanceAssumingAscendingOrder(rootNote.midiValue, thirdNote.midiValue);
            const chordNumber = ROMAN_NUMERALS[this.degree(rootNote.normalized) + 1];

            let chordQuality = MAJOR_CHORD_QUALITY;

            if (thirdDistance !== 4){
                const thirdToFifthDistance = Interval.calculateDistanceAssumingAscendingOrder(thirdNote.midiValue, fifthNote.midiValue);
                chordQuality = thirdToFifthDistance === 4 ? MINOR_CHORD_QUALITY : DIMINISHED_CHORD_QUALITY;
            }

            let chordName = `${rootNote.symbol} ${chordQuality} (${chordNumber})`;

            const chord = new Chord(chordName, [rootNote, thirdNote, fifthNote]);
            this.chordsByRootNote[rootNoteIndex] = chord;
            this.chordsByQuality[chordQuality].push(chord);
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
        if (this.current.rootNote === rootNote){
            return;
        }

        this.current = this.map[rootNote];

        if (this.onchange){
            this.onchange(this.current);
        }

        if (this.selectElement) {
            this.selectElement.value = rootNote;
            // this.selectElement.onchange();
        }
    }

    static parseRootValue(rootValue){
        const noteValue = Note.normalize(Math.abs(parseInt(rootValue)));

        if (isNaN(noteValue)){
            return 0;
        }

        return noteValue;
    }
}