"use strict";

import style from "./style/style.scss";
import {ScaleDetails} from "./code/ScaleDetails";
import {ScaleGenerator} from "./code/theory/ScaleGenerator";


window.onload = () => {
    const url = new URL(window.location.href);
    const rootNote = ScaleGenerator.parseRootValue(url.searchParams.get("scale"));

    window.scoreDetails = new ScaleDetails(rootNote);
};