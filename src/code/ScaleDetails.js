import {ScaleGenerator} from "./theory/ScaleGenerator";
import {CircleOfFifths} from "./draw/CircleOfFifths";
import {createSelectOptions} from "./ui/selectGenerator";
import {FIFTHS_ORDER} from "./theory/noteBase";
import {KeyboardGlymph} from "./draw/KeyboardGlymph";

export class ScaleDetails {
    constructor(rootNote){
        this.scaleGenerator = new ScaleGenerator();
        this.scaleGenerator.setScale(rootNote);
        const circleOfFifthsCanvas = document.getElementById('circle-of-fifths');
        this.circleOfFifths = new CircleOfFifths(circleOfFifthsCanvas);
        const scale = this.scaleGenerator.current;
        this.circleOfFifths.setScale(scale);

        this.circleOfFifths.onscalechange = (newRoot) => {
            this.scaleGenerator.setScale(newRoot);
        };

        createSelectOptions('scale-selection', this.scaleGenerator, FIFTHS_ORDER);
        this.scaleGenerator.onchange = (scale)=>{
            this.circleOfFifths.setScale(scale);
            this.keyboardGlymph.setScale(scale);
            this.keyboardGlymph.setActiveNotes(scale.notes);
            document.querySelector('[name=scale]').value = scale.rootNote;
            this.showTriadChords();
        };

        this.keyboardGlymph = new KeyboardGlymph(document.getElementById('scale-glymph'), scale);
        this.keyboardGlymph.setActiveNotes(scale.notes);
        this.showTriadChords();
    }

    showTriadChords(){
        const chordsByQuality = this.scaleGenerator.current.chordsByQuality;
        const majorChordsContainer = document.getElementById('major-chords');
        this.fillContainerWithChords(majorChordsContainer, chordsByQuality['Major']);
        const minorChordsContainer = document.getElementById('minor-chords');
        this.fillContainerWithChords(minorChordsContainer, chordsByQuality['Minor']);
        const diminishedChordsContainer = document.getElementById('diminished-chords');
        this.fillContainerWithChords(diminishedChordsContainer, chordsByQuality['Diminished']);
    }

    fillContainerWithChords(container, chords){
        while (container.firstChild) {
            container.removeChild(container.firstChild);
        }

        for (let chord of chords){
            const canvas = document.createElement('canvas');
            canvas.setAttribute('width', '280');
            canvas.setAttribute('height', '90');
            const keyboardGlymph = new KeyboardGlymph(canvas, this.scaleGenerator.current);

            const chordNotes = [];

            for (let note of chord.notes){

                chordNotes.push(note.midiValue);
            }
            keyboardGlymph.setActiveNotes(chordNotes);

            const figure = document.createElement('figure');

            figure.setAttribute('class', 'chordBox')
            figure.setAttribute('draggable', 'true');
            figure.innerText = chord.label;
            figure.appendChild(canvas);
            container.appendChild(figure);
        }
    }
}