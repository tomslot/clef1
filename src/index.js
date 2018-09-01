"use strict";

import style1 from "./style/pianoKeyboard.scss";
import style2 from "./style/style.scss";

import { game } from './code/game.js';
import { midiController } from './code/midiController.js';
import { pentagram } from './code/pentagram.js';
import { drawKeyboard, hightlightKey } from './code/virtualKeyboard.js';
import { drawCircle } from './code/circleOfFifths.js';

let canvasElem = document.getElementById('score_canvas');

window.help = () => {
    hightlightKey(game.noteValue);
};

window.onload = () => {
    window.game = game;
    pentagram.gClefImage = new Image();
    pentagram.gClefImage.src = require("./gfx/clefG_180.png");

    function animate(timestamp) {
        let ctx = canvasElem.getContext("2d");
        pentagram.draw(ctx);
        game.updateProgress();
        window.requestAnimationFrame(animate);
    }

    document.addEventListener('keypress', (event) => {
        if (event.key === ' ') {
            game.togglePaused();
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
    game.resetNote();
    window.requestAnimationFrame(animate);

    midiController.start();
};