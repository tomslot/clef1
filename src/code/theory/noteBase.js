export class Note{
    constructor(midiValue){
        this.midiValue = midiValue;
        this.normalized = midiValue % 12;
        this.accidental = noteBase.isAccidental(midiValue) ? '♭' : null;
        this.distanceFromMidG = noteBase.calculateTonicDistanceFromMidG(midiValue);
        this.hit = false;
    }
}

export const noteBase = {
    VISIBLE_MIDI_CODE_MIN: 48,
    VISIBLE_MIDI_CODE_MAX: 69,

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