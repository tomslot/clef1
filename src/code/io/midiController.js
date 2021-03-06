export const midiController = {
    start() {
        if (navigator.requestMIDIAccess) {
            navigator.requestMIDIAccess({
                sysex: false
            }).then(this.onMIDISuccess, this.onMIDIFailure);
        } else {
            console.log("No MIDI support in the browser.");
        }
    },

    onMIDIFailure(error) {
        console.log("No access to MIDI devices or your browser doesn't support WebMIDI API. Please use WebMIDIAPIShim " + error);
    },

    onMIDIMessage(message) {
        let data = message.data;

        if ((data[0] & 0xF0) === 0x90) {
            let note = data[1];
            console.log(`note ${note}}, data[0]=${data[0]}`);
            midiController.onNote(note);
        }
    },

    onMIDISuccess(midiAccess) {
        let midi = midiAccess;
        let inputs = midi.inputs.values();
        let deviceName = '';

        for (var input = inputs.next(); input && !input.done; input = inputs.next()) {
            deviceName += input.value.name;
            input.value.onmidimessage = midiController.onMIDIMessage;
        }

        if (deviceName.length === 0) {
            deviceName = 'none';
        }

        document.getElementById('connectedDevice').setAttribute('value', deviceName);
    }
};