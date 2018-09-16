import {Interval, Note} from "../theory/noteBase";

const KEY_WIDTH = 44;

export class VirtualKeyboard {
    constructor(container, onkeypressed){
        this.container = container;
        this.onkeypressed = onkeypressed;

        window.addEventListener("resize", ()=>{
            if (!this.resizeTimeout) {
                this.resizeTimeout = setTimeout(()=>{
                    this.resizeTimeout = null;
                    this.actualResizeHandler();
                }, 200);
            }
        }, false);
    }

    calculateSize(){
        this.keyNumber = parseInt(Math.min(window.innerWidth / KEY_WIDTH - 1, 7 * 4));
        this.octaveCount = parseInt(this.keyNumber / 7);
        this.startOctave = 5 - parseInt(this.octaveCount / 2);
        this.startNote = this.startOctave * 12;
    }

    appendKeyFunction(elem, midiCode) {
        elem.addEventListener('click', (evt) => {
            let midiCode = parseInt(evt.currentTarget.getAttribute('data-midi'));
            this.onkeypressed(midiCode);
        });

        elem.setAttribute('data-midi', midiCode);
    }

    render() {
        this.calculateSize();
        const keyboardElem = document.getElementById('piano');
        keyboardElem.innerHTML = '';
        keyboardElem.style.maxWidth = `${this.keyNumber * KEY_WIDTH}px`;

        let midiCode = this.startNote;

        for (let i = 0; i < this.keyNumber; i++ , midiCode++) {
            const keyElem = document.createElement("li");
            const divElem = document.createElement("div");
            divElem.setAttribute('class', 'anchor');
            keyElem.appendChild(divElem);

            if (Note.isAccidental(midiCode)) {
                const blackKey = document.createElement("span");
                this.appendKeyFunction(blackKey, midiCode);
                keyElem.appendChild(blackKey);
                midiCode++;
            }

            this.appendKeyFunction(divElem, midiCode);
            keyboardElem.appendChild(keyElem);
        }

        this.lastNote = midiCode;
    }

    highlightKey(noteValue, timeout = 500) {
        if (noteValue >= this.lastNote) {
            do {
                noteValue = Interval.octaveDown(noteValue);
            } while (noteValue >= this.lastNote && noteValue > 0);
        }

        if (noteValue < this.startNote) {
            do {
                noteValue = Interval.octaveUp(noteValue);
            } while (noteValue < this.startNote && noteValue < this.lastNote);
        }

        let anchor = this.container.querySelector(`[data-midi="${noteValue}"]`);

        if (anchor !== null) {
            anchor.classList.add('active');

            window.setTimeout(() => {
                anchor.classList.remove('active');

            }, timeout);
        }
    }

    actualResizeHandler() {
        console.log('resize()');
        this.render();
    }
}