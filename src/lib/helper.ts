export function fakeVelocity(e: PointerEvent, debug: boolean = false) {
    const target = e.target as HTMLElement;

    if (!target) return Math.round(Math.random() * 127) % 128;
    if (!target.clientHeight || !target.clientHeight || !target.offsetLeft || !target.offsetTop) return fakeVelocityBound(e, debug);
    const elHeight = target.clientHeight;
    const elWidth = target.clientWidth;
    const xCenter = elWidth / 2;
    const yCenter = elHeight / 2;


    const x = e.clientX - target.offsetLeft
    const y = e.clientY - target.offsetTop
    const xPercent = xCenter - Math.abs(xCenter - x)
    const yPercent = yCenter - Math.abs(yCenter - y)

    const xVelocity = scale(xPercent, 0, xCenter, 0, 127) % 128
    const yVelocity = scale(yPercent, 0, yCenter, 0, 127) % 128

    if (debug) {
        const obj = {
            x,
            y,
            xCenter,
            yCenter,
            xPercent,
            yPercent,
            xVelocity,
            yVelocity,
            clientX: e.clientX,
            clientY: e.clientY,
            offsetLeft: target.offsetLeft,
            offsetTop: target.offsetTop
        }
        console.table([obj])
    }
    return Math.round(((xVelocity + yVelocity) / 2)) % 128
}

function fakeVelocityBound(e: PointerEvent, debug: boolean = false) {
    const target = e.target as HTMLElement;

    if (!target) return Math.round(Math.random() * 127) % 128;
    const { height, width, left, top } = target.getBoundingClientRect();
    const xCenter = width / 2;
    const yCenter = height / 2;


    const x = e.clientX - left
    const y = e.clientY - top
    const xPercent = xCenter - Math.abs(xCenter - x)
    const yPercent = yCenter - Math.abs(yCenter - y)

    const xVelocity = scale(xPercent, 0, xCenter, 0, 127) % 128
    const yVelocity = scale(yPercent, 0, yCenter, 0, 127) % 128

    if (debug) {
        const obj = {
            x,
            y,
            xCenter,
            yCenter,
            xPercent,
            yPercent,
            xVelocity,
            yVelocity,
            clientX: e.clientX,
            clientY: e.clientY,
            offsetLeft: target.offsetLeft,
            offsetTop: target.offsetTop
        }
        console.table([obj])
    }
    return Math.round(((xVelocity + yVelocity) / 2)) % 128


}

function scale(value: number, fromMin: number, fromMax: number, toMin: number, toMax: number) {
    return ((value - fromMin) / (fromMax - fromMin)) * (toMax - toMin) + toMin
}

export function midiNote2Octave(note: number) {
    return Math.floor(note / 12) - 1;
}

export function midiNote2Note(note: number) {
    return note % 12;
}

export function midiNote2MusicalOctave(note: number) {
    return midiNote2Octave(note) - 4;
}

export function musicalOctave2MidiNote(octave: number) {
    return (octave + 4) * 12 + 12;
}

export const MIDDLE_C = 60

const defaultKeyboardSettings = {
    transpose: 0,
    octave: 0,
    keys: 25
}

export const KeyboardSettings = {
    load() {
        if (!localStorage?.getItem("keyboard-settings")) {
            localStorage.setItem("keyboard-settings", JSON.stringify(defaultKeyboardSettings))
            return defaultKeyboardSettings
        }
        return JSON.parse(localStorage.getItem("keyboard-settings") || "")
    },

    save(settings: typeof defaultKeyboardSettings) {
        if (!localStorage) return
        localStorage.setItem("keyboard-settings", JSON.stringify(settings))
    },

    default: defaultKeyboardSettings
}

