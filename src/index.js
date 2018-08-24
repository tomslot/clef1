"use strict";

import style1 from "./pianoKeyboard.css";
import style2 from "./style.css";

import {noteBase} from './noteBase.js';
import {game} from './game.js';
import {midiController} from './midiController.js';
import {pentagram} from './pentagram.js';

let canvasElem = document.getElementById('score_canvas');

window.key = function(code) {
    if (game.paused) {
        game.unpause();
    } else {
        game.shoot(code);
    }
};

window.onload = function () {
    window.game = game;
    pentagram.gClefImage = new Image();
    pentagram.gClefImage.src = require("./clefG_180.png");

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

    game.resetNote();
    window.requestAnimationFrame(animate);

    midiController.start();
};