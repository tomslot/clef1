const SHARP_SCALES = [7, 2, 9, 4, 11];
const ACCIDENTALS = [1, 3, 6, 8, 10];
const SOLPHAGE_MAP = {
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
};
const SOLPHAGE_MAP_SHARP = {
    0: 'C',
    1: 'C♯',
    2: 'D',
    3: 'D♯',
    4: 'E',
    5: 'F',
    6: 'F♯',
    7: 'G',
    8: 'G♯',
    9: 'A',
    10: 'A♯',
    11: 'B'
};

export class Note{
    constructor(midiValue, sharpVsFlat){
        this.sharpVsFlat = sharpVsFlat;
        this.midiValue = midiValue;
        this.normalized = midiValue % 12;

        if (noteBase.isAccidental(midiValue)){
            this.accidental = sharpVsFlat? '♯' : '♭';
        }

        this.distanceFromMidG = noteBase.calculateTonicDistanceFromMidG(midiValue);
        this.symbol = noteBase.noteToSymbol(midiValue, sharpVsFlat);

        if (sharpVsFlat && this.accidental){
            this.distanceFromMidG --;
        }

        this.hit = false;
    }
}

export const noteBase = {
    VISIBLE_MIDI_CODE_MIN: 48,
    VISIBLE_MIDI_CODE_MAX: 69,

    normalize(noteVal) {
        return noteVal % 12;
    },

    isAccidental(noteVal) {
        let normalized = this.normalize(noteVal);
        return ACCIDENTALS.includes(normalized);
    },

    defaultSharpVsFlatForNote(noteValue){
        return SHARP_SCALES.includes(noteValue % 12);
    },

    noteToSymbol(noteVal, sharpVsFlat = undefined) {
        if (sharpVsFlat === undefined){
            sharpVsFlat = this.defaultSharpVsFlatForNote(noteVal);
        }

        return sharpVsFlat ? SOLPHAGE_MAP_SHARP[this.normalize(noteVal)] : SOLPHAGE_MAP[this.normalize(noteVal)];
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