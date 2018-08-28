import { noteBase } from './noteBase.js';

const KEY_WIDTH = 44;

function appendKeyFunction(elem, midiCode){
    elem.setAttribute('onclick', `key(${midiCode})`);
}

export function drawKeyboard(){
    const keyboardElem = document.getElementById('piano');
    keyboardElem.innerHTML = '';

    const keyNumber = parseInt(Math.min(window.innerWidth / KEY_WIDTH, 7 * 4));
    keyboardElem.style.maxWidth = `${keyNumber * KEY_WIDTH}px`;

    const octaveCount = parseInt(keyNumber / 7);
    const startOctave = 5 - parseInt(octaveCount / 2);
    const startNote = startOctave * 12;
    let midiCode = startNote;

    for (let i = 0; i < keyNumber; i ++, midiCode ++){
        let keyElem = document.createElement("li");
        let divElem = document.createElement("div");
        divElem.setAttribute('class', 'anchor');
        keyElem.appendChild(divElem);

        if (noteBase.isAccidental(midiCode)){
            let blackKey = document.createElement("span");
            appendKeyFunction(blackKey, midiCode);
            keyElem.appendChild(blackKey);
            midiCode ++;
        }

        appendKeyFunction(divElem, midiCode);

        keyboardElem.appendChild(keyElem);
    }
}