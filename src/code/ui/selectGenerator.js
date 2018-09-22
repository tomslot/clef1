export function createSelectOptions(elementId, generatorRepo, sortedKeys){
    const selectElement = document.getElementById(elementId);
    const keys = sortedKeys || Object.keys(generatorRepo.map);

    for (const key of keys){
        generatorRepo.selectElement = selectElement;
        const generator = generatorRepo.map[key];
        const optionElem = document.createElement("option");
        const txtNode = document.createTextNode(generator.label);
        optionElem.appendChild(txtNode);
        const attr = document.createAttribute("value");
        attr.value = key;
        optionElem.setAttributeNode(attr);
        selectElement.appendChild(optionElem);
    }

    selectElement.onchange = () => {
        const selection = selectElement.value;
        generatorRepo.setScale(selection);
    };

    return selectElement;
}