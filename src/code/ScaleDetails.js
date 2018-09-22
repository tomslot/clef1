import {ScaleGenerator} from "./theory/ScaleGenerator";
import {CircleOfFifths} from "./draw/CircleOfFifths";
import {createSelectOptions} from "./ui/selectGenerator";
import {FIFTHS_ORDER} from "./theory/noteBase";
import {KeyboardGlymph} from "./draw/KeyboardGlymph";

export class ScaleDetails {
    constructor(rootNote){
        this.scaleGenerator = new ScaleGenerator();
        const circleOfFifthsCanvas = document.getElementById('circle-of-fifths');
        this.circleOfFifths = new CircleOfFifths(circleOfFifthsCanvas);
        this.circleOfFifths.setScale(this.scaleGenerator.current);
        this.circleOfFifths.onscalechange = (newRoot) => {

            this.scaleGenerator.setScale(newRoot);
        };
        createSelectOptions('scale-selection', this.scaleGenerator, FIFTHS_ORDER);

        this.scaleGenerator.onchange = (scale)=>{

            this.circleOfFifths.setScale(scale);
            this.keyboardGlymph.setActiveNotes(scale.notes);
            document.querySelector('[name=scale]').value = scale.rootNote;
        };
        this.keyboardGlymph = new KeyboardGlymph(document.getElementById('scale-glymph'));

        this.keyboardGlymph.setActiveNotes(this.scaleGenerator.current.notes);
        this.scaleGenerator.setScale(rootNote);
    }
}