"use strict";

import style1 from "./style/pianoKeyboard.scss";
import style2 from "./style/style.scss";

import {Game} from "./code/Game";
import {Staff} from "./code/draw/Staff";

let canvasElem = document.getElementById('score_canvas');

window.onload = () => {
    window.game = new Game();

    const staffCanvas = document.getElementById('score-canvas');
    const staff = new Staff(staffCanvas, game);

    function animate(timestamp) {
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