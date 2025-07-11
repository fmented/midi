import type { MidiTransport } from './transport';

type ConnectArgs = {
	name?: string;
	onSuccess?: (input: MIDIInput, output: MIDIOutput) => void;
	onError?: (err: unknown) => void;
};

export class WebMidi implements MidiTransport {
	private out: MIDIOutput;
	private in: MIDIInput;

	static supported() {
		return 'navigator' in globalThis && 'requestMIDIAccess' in globalThis.navigator;
	}

	static connect({ name, onSuccess, onError }: ConnectArgs): Promise<WebMidi> {
		return new Promise((resolve, reject) => {
			navigator
				.requestMIDIAccess()
				.then((access) => {
					const inputs = Array.from(Object.values(access.inputs)).filter((i) =>
						i.name?.includes(name ?? '')
					);
					const outputs = Array.from(Object.values(access.outputs)).filter((i) =>
						i.name?.includes(name ?? '')
					);
					if (inputs.length == 0 && outputs.length == 0) return reject('no device found');
					if (onSuccess) onSuccess(inputs[0], outputs[0]);
					return resolve(new WebMidi(inputs[0], outputs[0]));
				})
				.catch((e) => {
					if (onError) onError(e);
					console.error(e);
					reject(e);
				});
		});
	}

	static list() {
		return navigator.requestMIDIAccess().then((access) => {
			const inputs = new Set(Array.from(Object.values(access.inputs)).map((i) => i.name));
			const outputs = new Set(Array.from(Object.values(access.outputs)).map((i) => i.name));
			return Array.from(inputs.intersection(outputs)).filter((i) => typeof i === 'string');
		});
	}

	private inputReady = false;
	private outputReady = false;

	onDisconnect?: () => void;

	constructor(input: MIDIInput, output: MIDIOutput) {
		this.in = input;
		this.out = output;
	}

	async init(listener: (e: { data: Uint8Array }) => void) {
		this.in.addEventListener('midimessage', (e) => {
			if (!e.data) return;
			if (import.meta.env.DEV) console.log(e.data);
			listener({ data: e.data });
		});

		this.out.addEventListener('statechange', (e) => {
			if (this.outputReady) return;
			this.outputReady = this.out.state === 'connected';
		});

		this.in.addEventListener('statechange', (e) => {
			if (this.inputReady) return;
			this.inputReady = this.in.state === 'connected';
		});

		this.in.addEventListener('statechange', (e) => {
			if (this.in.state === 'disconnected') {
				this.onDisconnect?.();
			}
		});

		this.out.addEventListener('statechange', (e) => {
			if (this.out.state === 'disconnected') {
				this.onDisconnect?.();
			}
		});

		await this.in.open();
		await this.out.open();

		return true;
	}

	get ready() {
		return this.inputReady && this.outputReady;
	}

	close(): void {
		this.in.onstatechange = null;
		this.out.onstatechange = null;
		this.in.onmidimessage = null;

		this.in.close();
		this.out.close();
	}
	send(data: Uint8Array) {
		return this.outputReady && this.out.send(data as unknown as number[]);
	}
}
