"use strict";

import style1 from "./style/pianoKeyboard.scss";
import style2 from "./style/style.scss";

import { game } from './code/game.js';
import { staff } from './code/draw/staff.js';
import { drawCircle } from './code/draw/circleOfFifths.js';
import { midiController } from './code/io/midiController.js';
import { drawKeyboard, hightlightKey } from './code/io/virtualKeyboard.js';

let canvasElem = document.getElementById('score_canvas');

window.help = () => {
    console.log('help()');
    for (const note of game.currentStaffItem.notes){
        hightlightKey(note.midiValue);
    }
};

window.onload = () => {
    window.game = game;
    staff.gClefImage = new Image();
    staff.gClefImage.src = require("./gfx/clefG_180.png");

    function animate(timestamp) {
        let ctx = canvasElem.getContext("2d");
        staff.draw(ctx);
        game.updateProgress();
        window.requestAnimationFrame(animate);
    }

    document.addEventListener('keypress', (event) => {
        if (event.key === ' ') {
            game.togglePaused();
        } else if (event.key.toUpperCase() === 'H'){
            window.help();
        }
    });

    window.addEventListener("resize", resizeThrottler, false);

    var resizeTimeout;
    function resizeThrottler() {
        if (!resizeTimeout) {
            resizeTimeout = setTimeout(() => {
                resizeTimeout = null;
                actualResizeHandler();
            }, 66);
        }
    }

    function actualResizeHandler() {
        console.log('resize()');
        drawKeyboard();
    }

    drawKeyboard();
    drawCircle();
    game.proceedToNextStaffItem();
    window.requestAnimationFrame(animate);

    midiController.start();
};