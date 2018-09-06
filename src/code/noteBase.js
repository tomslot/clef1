export class Note{
    constructor(midiValue){
        this.midiValue = midiValue;
        this.normalized = midiValue % 12;
        this.distanceFromMidG = noteBase.calculateTonicDistanceFromMidG(midiValue);
        this.hit = false;
    }
}

export const noteBase = {
    VISIBLE_MIDI_CODE_MIN: 48,
    VISIBLE_MIDI_CODE_MAX: 70,

    solphageMap: {
        0: 'C',
        1: 'D♭',
        2: 'D',
        3: 'E♭',
        4: 'E',
        5: 'F',
        6: 'G♭',
        7: 'G',
        8: 'A♭',
        9: 'A',
        10: 'B♭',
        11: 'B'
    },

    accidentals: [1, 3, 6, 8, 10],

    currentScale: {
        name: 'C Major',
        notes: [0, 2, 4, 5, 7, 9, 11]
    },

    currentNotePalette: [],

    createNotePalette(){
        this.currentNotePalette = [];

        for (let i = this.VISIBLE_MIDI_CODE_MIN; i <= this.VISIBLE_MIDI_CODE_MAX; i ++){
            if (this.currentScale.notes.includes(i % 12)){
                this.currentNotePalette.push(i);
            }
        }

        console.log(`createNotePalette() added ${this.currentNotePalette.length} notes`);
    },

    singleRandomNoteFromCurrentPalette(){
        let numberOfNotesInPalette = this.currentNotePalette.length;
        let randomNoteIndex = parseInt(Math.random() * numberOfNotesInPalette);
        return this.currentNotePalette[randomNoteIndex];
    },

    genRandomTriadChord(){
        const numberOfNotesInPalette = this.currentNotePalette.length;
        const randomRootNoteIndex = parseInt(Math.random() * (numberOfNotesInPalette - 5));
    
        const rootNote = new Note(this.currentNotePalette[randomRootNoteIndex]);
        const thirdNote = new Note(this.currentNotePalette[randomRootNoteIndex + 2]);
        const fifthNote = new Note(this.currentNotePalette[randomRootNoteIndex + 4]);
    
        const rootNoteLabel = this.noteToSymbol(rootNote.midiValue);
        const thrirdDistance = thirdNote.midiValue - rootNote.midiValue;
        const chordQuality = thrirdDistance == 4 ? 'Major' : 'Minor';
        
        let chordName = `${rootNoteLabel} ${chordQuality}`;
    
        return {
            label: chordName,
            notes: [rootNote, thirdNote, fifthNote]
        };
    },

    normalize(noteVal) {
        return noteVal % 12;
    },

    isAccidental(noteVal) {
        let normalized = this.normalize(noteVal);
        return this.accidentals.includes(normalized);
    },

    noteToSymbol(noteVal) {
        return this.solphageMap[this.normalize(noteVal)];
    },

    generateNextStaffItem() {
        return this.genRandomTriadChord();
        // let note = new Note(this.singleRandomNoteFromCurrentPalette());
        // let label = this.noteToSymbol(note.midiValue);

        // return {
        //     label: label,
        //     notes: [note]
        // };
    },

    calculateTonicDistanceFromMidG(noteValue) {
        const midG = 67 - 12;
        let from = Math.min(midG, noteValue);
        let to = Math.max(midG, noteValue);
        let distance = 0;

        for (let i = from; i < to; i++) {
            if (!this.isAccidental(i)) {
                distance++;
            }
        }

        if (noteValue < midG) {
            return -1 * distance;
        }

        return distance;
    },
};

noteBase.createNotePalette();

