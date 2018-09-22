"use strict";

import style1 from "./style/pianoKeyboard.scss";
import style2 from "./style/style.scss";

import {Game} from "./code/Game";
import {Staff} from "./code/draw/Staff";
import {ScaleGenerator} from "./code/theory/ScaleGenerator";

window.onload = () => {
    const url = new URL(window.location.href);
    const exerciseParam = url.searchParams.get("exercise");
    const rootNote = ScaleGenerator.parseRootValue(url.searchParams.get("scale"));

    window.game = new Game(exerciseParam, rootNote);

    const staffCanvas = document.getElementById('score-canvas');
    const staff = new Staff(staffCanvas, game);

    function animate() {
        staff.draw();
        game.updateProgress();
        window.requestAnimationFrame(animate);
    }

    document.addEventListener('keypress', (event) => {
        if (event.key === ' ') {
            game.togglePaused();
        } else if (event.key.toUpperCase() === 'H'){
            game.help();
        }
    });

    window.requestAnimationFrame(animate);
};