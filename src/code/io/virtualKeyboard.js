import { noteBase } from '../theory/noteBase.js';
const KEY_WIDTH = 44;

const SIZE = {
    keyNumber: 0,
    octaveCount: 0,
    startOctave: 0,
    startNote: 0,
    lastNote: 0
}

function calculateKeyboardSize(){
    SIZE.keyNumber = parseInt(Math.min(window.innerWidth / KEY_WIDTH, 7 * 4));
    SIZE.octaveCount = parseInt(SIZE.keyNumber / 7);
    SIZE.startOctave = 5 - parseInt(SIZE.octaveCount / 2);
    SIZE.startNote = SIZE.startOctave * 12;
}

function appendKeyFunction(elem, midiCode) {

    elem.addEventListener('click', (evt) => {
        let midiCode = parseInt(evt.currentTarget.getAttribute('data-midi'));
        game.shoot(midiCode);
    });

    elem.setAttribute('data-midi', midiCode);
}

export function drawKeyboard() {
    calculateKeyboardSize();
    const keyboardElem = document.getElementById('piano');
    keyboardElem.innerHTML = '';
    keyboardElem.style.maxWidth = `${SIZE.keyNumber * KEY_WIDTH}px`;

    let midiCode = SIZE.startNote;

    for (let i = 0; i < SIZE.keyNumber; i++ , midiCode++) {
        let keyElem = document.createElement("li");
        let divElem = document.createElement("div");
        divElem.setAttribute('class', 'anchor');
        keyElem.appendChild(divElem);

        if (noteBase.isAccidental(midiCode)) {
            let blackKey = document.createElement("span");
            appendKeyFunction(blackKey, midiCode);
            keyElem.appendChild(blackKey);
            midiCode++;
        }

        appendKeyFunction(divElem, midiCode);
        keyboardElem.appendChild(keyElem);
    }

    SIZE.lastNote = midiCode;
}

export function hightlightKey(note, exact = false) {
    if (!exact) {
        if (note >= SIZE.lastNote){
            do {
                note -= 12;
            } while (note >= SIZE.lastNote && note > 0);
        }
        
        if (note < SIZE.startNote){
            do {
                note += 12;
            } while (note < SIZE.startNote && note < SIZE.lastNote);
        }
    }

    let anchor = document.querySelector(`[data-midi="${note}"]`);

    if (anchor !== null) {
        anchor.classList.add('active');

        window.setTimeout(() => {
            anchor.classList.remove('active');
        }, 500);
    }
}