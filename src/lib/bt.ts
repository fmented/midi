import type { MidiTransport } from "./transport";

function timestamp(): [number, number] {
    let localTime = performance.now() & 8191;
    let t: [number, number] = [((localTime >> 7) | 0x80) & 0xbf, (localTime & 0x7f) | 0x80];
    return t;
}

const MIDI_SERVICE_UID = '03B80E5A-EDE8-4B33-A751-6CE34EC4C700'.toLowerCase();
const MIDI_IO_CHARACTERISTIC_UID = '7772E5DB-3868-4112-A1A9-F2669D106BF3'.toLowerCase();


type ConnectArgs = {
    name?: string,
    onSuccess?: (characteristic: BluetoothRemoteGATTCharacteristic) => void,
    onError?: (err: unknown) => void
}

function delayPromise(ms: number) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}
export class BLETransport implements MidiTransport {
    private c: BluetoothRemoteGATTCharacteristic
    private queued: Uint8Array[] = []
    private lastSent = 0

    static async connect({ name, onSuccess, onError }: ConnectArgs): Promise<BLETransport> {

        return new Promise((resolve, reject) => {
            navigator.bluetooth
                .requestDevice({ filters: [{ name: name, services: [MIDI_SERVICE_UID] }] })
                .then((d) => {
                    if (!d.gatt) return;
                    return d.gatt.connect();
                })
                .then((gatt) => {
                    return gatt?.getPrimaryService(MIDI_SERVICE_UID);
                })
                .then((service) => {
                    return service?.getCharacteristic(MIDI_IO_CHARACTERISTIC_UID);
                })
                .then((characteristic) => {
                    if (!characteristic) return;
                    if (onSuccess) onSuccess(characteristic)
                    return resolve(new BLETransport(characteristic))
                })
                .catch((e) => {
                    if (onError) onError(e)
                    console.error(e);
                    reject(e)

                });

        })
    }

    static supported() {
        return "navigator" in globalThis && 'bluetooth' in globalThis.navigator
    }

    onDisconnect?: () => void

    constructor(c: BluetoothRemoteGATTCharacteristic) {
        this.c = c
    }
    send(data: Uint8Array) {
        this.c.writeValue(new Uint8Array([...timestamp(), ...data]))
    }

    init(listener: (e: { data: Uint8Array }) => void) {
        this.c.startNotifications()
        this.c.addEventListener("characteristicvaluechanged", (e) => {

            const target = e.target as BluetoothRemoteGATTCharacteristic
            if (!target.value) return
            listener({ data: new Uint8Array(target.value.buffer.slice(2)) });
        });

        this.c.service.device.addEventListener("gattserverdisconnected", () => {
            this.onDisconnect?.()
        })
        return true
    }

    get ready() {
        return this.c.service.device.gatt?.connected || false
    }

    async close() {
        // @ts-expect-error Should be fine
        this.c.oncharacteristicvaluechanged = null
        await this.c.stopNotifications()
        this.c.service.device.gatt?.disconnect()
    }
    get characteristic() {
        return this.c
    }
}

