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

export const FIFTHS_ORDER = [0, 7, 2, 9, 4, 11, 6, 1, 8, 3, 10, 5];

export class Note{
    constructor(midiValue, sharpVsFlat){
        this.sharpVsFlat = sharpVsFlat;
        this.midiValue = midiValue;
        this.normalized = midiValue % 12;

        if (Note.isAccidental(midiValue)){
            this.accidental = sharpVsFlat? '♯' : '♭';
        }

        this.distanceFromMidG = Interval.tonicDistanceFromMidG(midiValue);
        this.symbol = Note.noteToSymbol(midiValue, sharpVsFlat);

        if (sharpVsFlat && this.accidental){
            this.distanceFromMidG --;
        }

        this.hit = false;
    }

    static normalize(noteVal) {
        return noteVal % 12;
    }

    static isAccidental(noteVal) {
        let normalized = Note.normalize(noteVal);
        return ACCIDENTALS.includes(normalized);
    }

    static noteToSymbol(noteVal, sharpVsFlat = undefined) {
        if (sharpVsFlat === undefined){
            sharpVsFlat = Note.defaultSharpVsFlatForNote(noteVal);
        }

        return sharpVsFlat ? SOLPHAGE_MAP_SHARP[Note.normalize(noteVal)] : SOLPHAGE_MAP[Note.normalize(noteVal)];
    }

    static defaultSharpVsFlatForNote(noteValue){
        return SHARP_SCALES.includes(noteValue % 12);
    }
}

export class Interval{
    static perfectFifth(noteValue){
        return (noteValue + 7) % 12;
    }

    static tonicDistanceFromMidG(noteValue) {
        const midG = 67 - 12;
        let from = Math.min(midG, noteValue);
        let to = Math.max(midG, noteValue);
        let distance = 0;

        for (let i = from; i < to; i++) {
            if (!Note.isAccidental(i)) {
                distance++;
            }
        }

        if (noteValue < midG) {
            return -1 * distance;
        }

        return distance;
    }

    static calculateDistanceAssumingAscendingOrder(lowerNoteValue, higherNoteValue){
        const r = higherNoteValue - lowerNoteValue;
        return lowerNoteValue <= higherNoteValue ? r :  r + 12;
    }

    static octaveUp(noteValue){
        return noteValue + 12;
    }

    static octaveDown(noteValue){
        return noteValue - 12;
    }
}

export const noteBase = {
    VISIBLE_MIDI_CODE_MIN: 48,
    VISIBLE_MIDI_CODE_MAX: 69,
};