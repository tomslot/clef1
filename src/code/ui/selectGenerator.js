export function createSelectOptions(elementId, generatorRepo){
    const exerciseElem = document.getElementById(elementId);
    const keys = Object.keys(generatorRepo.map).sort();

    for (const key of keys){
        const generator = generatorRepo.map[key];
        const optionElem = document.createElement("option");
        const txtNode = document.createTextNode(generator.label);
        optionElem.appendChild(txtNode);
        const attr = document.createAttribute("value");
        attr.value = key;
        optionElem.setAttributeNode(attr);
        exerciseElem.appendChild(optionElem);
    }

    exerciseElem.onchange = () => {
        const sel = exerciseElem.value;
        generatorRepo.selectByIndex(sel);
    }
}