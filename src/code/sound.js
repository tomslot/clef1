const noteValues = {
    'C0': 16.35,
    'C#0': 17.32,
    'Db0': 17.32,
    'D0': 18.35,
    'D#0': 19.45,
    'Eb0': 19.45,
    'E0': 20.60,
    'F0': 21.83,
    'F#0': 23.12,
    'Gb0': 23.12,
    'G0': 24.50,
    'G#0': 25.96,
    'Ab0': 25.96,
    'A0': 27.50,
    'A#0': 29.14,
    'Bb0': 29.14,
    'B0': 30.87,
    'C1': 32.70,
    'C#1': 34.65,
    'Db1': 34.65,
    'D1': 36.71,
    'D#1': 38.89,
    'Eb1': 38.89,
    'E1': 41.20,
    'F1': 43.65,
    'F#1': 46.25,
    'Gb1': 46.25,
    'G1': 49.00,
    'G#1': 51.91,
    'Ab1': 51.91,
    'A1': 55.00,
    'A#1': 58.27,
    'Bb1': 58.27,
    'B1': 61.74,
    36: 65.41,
    'C#2': 69.30,
    'D2': 73.42,
    'D#2': 77.78,
    'E2': 82.41,
    'F2': 87.31,
    'F#2': 92.50,
    'G2': 98.00,
    'G#2': 103.83,
    'A2': 110.00,
    'A#2': 116.54,
    'B2': 123.47,
    48: 130.81,
    49: 138.59,
    50: 146.83,
    51: 155.56,
    52: 164.81,
    53: 174.61,
    54: 185.00,
    55: 196.00,
    56: 207.65,
    57: 220.00,
    58: 233.08,
    59: 246.94,
    60: 261.63,
    61: 277.18,
    62: 293.66,
    63: 311.13,
    64: 329.63,
    65: 349.23,
    66: 369.99,
    67: 392.00,
    68: 415.30,
    69: 440.00,
    70: 466.16,
    71: 493.88,
    72: 523.25,
    73: 554.37,
    74: 587.33,
    75: 622.25,
    76: 659.26,
    77: 698.46,
    78: 739.99,
    79: 783.99,
    80: 830.61,
    81: 880.00,
    82: 932.33,
    83: 987.77,
    84: 1046.50,
    85: 1046.5,
    86: 1108.73,
    87: 1174.66,
    88: 1244.51,
    89: 1396.91,
    90: 1479.98,
    91: 1567.98,
    92: 1661.22,
    93: 1760.0,
    94: 1864.66,
    95: 1975.53,
    96: 2093.00,
    'C#7': 2217.46,
    'Db7': 2217.46,
    'D7': 2349.32,
    'D#7': 2489.02,
    'Eb7': 2489.02,
    'E7': 2637.02,
    'F7': 2793.83,
    'F#7': 2959.96,
    'Gb7': 2959.96,
    'G7': 3135.96,
    'G#7': 3322.44,
    'Ab7': 3322.44,
    'A7': 3520.00,
    'A#7': 3729.31,
    'Bb7': 3729.31,
    'B7': 3951.07,
    108: 4186.01
}

var AudioContext = window.AudioContext || window.webkitAudioContext;
let context = new AudioContext();

export function playNote(midiCode) {
    let gainNode = context.createGain();
    gainNode.connect(context.destination);

    context.resume().then(() => {
        let oscillator = context.createOscillator();
        oscillator.type = "triangle";
        gainNode.gain.setValueAtTime(0.0001, context.currentTime);
        gainNode.gain.linearRampToValueAtTime(0.5, context.currentTime + 0.17);
        gainNode.gain.setValueAtTime(0.5, context.currentTime + 0.2);
        gainNode.gain.exponentialRampToValueAtTime(0.00001, context.currentTime + 2);
        oscillator.connect(gainNode);
        oscillator.frequency.value = noteValues[midiCode];
        oscillator.start(0);
        oscillator.stop(context.currentTime + 2);

    //     oscillator.type = "sine";
    //     oscillator.connect(gainNode);
    //     oscillator.frequency.value = noteValues[midiCode + 12];
    //     oscillator.start(0);
    //     oscillator.stop(context.currentTime + 2);
     });
}
