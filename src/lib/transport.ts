type Channel = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15;

type NoteOffParams = [note: number, velocity: number, channel: Channel];

type NoteOnParams = NoteOffParams;

type AfterTouchParams = [note: number, value: number, channel: Channel];

type ControlChangeParams = [control: number, value: number, channel: Channel];

type ChannelAfterTouchParams = [value: number, channel: Channel];

type ProgramChangeParams = [program: number, channel: Channel];

type PitchBendParams = ChannelAfterTouchParams;

type SysExParams = [data: number[]];

type NoteOffCallback = (...args: NoteOffParams) => void;

type NoteOnCallback = NoteOffCallback;

type ControlChangeCallback = (...args: ControlChangeParams) => void;

type AfterTouchCallback = (...args: AfterTouchParams) => void;

type ProgramChangeCallback = (...args: ProgramChangeParams) => void;

type ChannelAfterTouchCallback = (...args: ChannelAfterTouchParams) => void;

type PitchBendCallback = (...args: PitchBendParams) => void;

type SysExCallback = (...args: SysExParams) => void;

type RawCallback = (data: number[]) => void;

type ValidMidiMessage<T extends object> = { valid: true } & T;

type InvalidMidiMessage = {
	valid: false;
};

type NoteOffMessage = ValidMidiMessage<{
	status: typeof MIDI.NOTE_OFF;
	channel: Channel;
	note: number;
	velocity: number;
}>;

type NoteOnMessage = ValidMidiMessage<{
	status: typeof MIDI.NOTE_ON;
	channel: Channel;
	note: number;
	velocity: number;
}>;

type AfterTouchMessage = ValidMidiMessage<{
	status: typeof MIDI.AFTERTOUCH;
	channel: Channel;
	note: number;
	value: number;
}>;

type ControlChangeMessage = ValidMidiMessage<{
	status: typeof MIDI.CONTROL_CHANGE;
	channel: Channel;
	control: number;
	value: number;
}>;

type ProgramChangeMessage = ValidMidiMessage<{
	status: typeof MIDI.PROGRAM_CHANGE;
	channel: Channel;
	program: number;
}>;

type ChannelAfterTouchMessage = ValidMidiMessage<{
	status: typeof MIDI.CHANNEL_AFTERTOUCH;
	channel: Channel;
	value: number;
}>;

type PitchBendMessage = ValidMidiMessage<{
	status: typeof MIDI.PITCHBEND;
	channel: Channel;
	value: number;
	msb: number;
	lsb: number;
}>;

type SysExMessage = ValidMidiMessage<{
	status: typeof MIDI.SYSEX;
	data: number[];
}>;

type MidiMessage =
	| InvalidMidiMessage
	| NoteOffMessage
	| NoteOnMessage
	| AfterTouchMessage
	| ControlChangeMessage
	| ProgramChangeMessage
	| ChannelAfterTouchMessage
	| PitchBendMessage
	| SysExMessage;

class InvalidData extends Error {
	constructor(name?: string, expect?: string, received?: unknown) {
		if (name == undefined) super('invalid data');
		else super(`${name} is invalid! expected: ${expect}, received: ${received}`);
	}
}

type MidiStatus =
	| typeof MIDI.NOTE_OFF
	| typeof MIDI.NOTE_ON
	| typeof MIDI.AFTERTOUCH
	| typeof MIDI.CONTROL_CHANGE
	| typeof MIDI.PROGRAM_CHANGE
	| typeof MIDI.CHANNEL_AFTERTOUCH
	| typeof MIDI.PITCHBEND
	| typeof MIDI.SYSEX;

function isValidInt(v: unknown): v is number {
	if (!(typeof v == 'number')) return false;
	if (Number.isNaN(v)) return false;

	if (!Number.isFinite(v)) return false;

	if (!Number.isInteger(v)) return false;

	return true;
}

type MidiCallback = {
	noteOff: NoteOffCallback[];
	noteOn: NoteOnCallback[];
	afterTouch: AfterTouchCallback[];
	controlChange: ControlChangeCallback[];
	programChange: ProgramChangeCallback[];
	channelAfterTouch: ChannelAfterTouchCallback[];
	pitchBend: PitchBendCallback[];
	sysEx: SysExCallback[];
	raw: RawCallback[];
	invalid: RawCallback[];
};

export type MidiTransport = {
	send(data: Uint8Array): void;
	init(listener: (e: { data: Uint8Array }) => void): boolean | void | Promise<boolean | void>;
	close(): void | Promise<void>;
	onDisconnect?: () => void;
	readonly ready: boolean;
};

export class MIDI<T extends MidiTransport = MidiTransport> {
	static readonly NOTE_OFF = 0x80 as const;
	static readonly NOTE_ON = 0x90 as const;
	static readonly AFTERTOUCH = 0xa0 as const;
	static readonly CONTROL_CHANGE = 0xb0 as const;
	static readonly PROGRAM_CHANGE = 0xc0 as const;
	static readonly CHANNEL_AFTERTOUCH = 0xd0 as const;
	static readonly PITCHBEND = 0xe0 as const;
	static readonly SYSEX = 0xf0 as const;
	static readonly END_SYSEX = 0xf7 as const;

	static getStatus(byte: number) {
		return (byte & 0xf0) as unknown as MidiStatus;
	}

	static getChannel(byte: number) {
		return (byte & 0x0f) as unknown as Channel;
	}

	static pitchbendMSB(value: number) {
		return (value >> 7) & 0xf0;
	}

	static pitchbendLSB(value: number) {
		return value & 0xf0;
	}

	static pitchbend(msb: number, lsb: number) {
		return (msb << 7) | lsb;
	}

	static sysEx(data: number[]) {
		const copy: number[] = [];
		if (data[0] != MIDI.SYSEX) copy.push(MIDI.SYSEX);

		for (let i = 0; i < data.length; i++) {
			copy.push(data[i]);
			if (data[i] == MIDI.END_SYSEX) break;
		}

		if (copy[copy.length - 1] != MIDI.END_SYSEX) copy.push(MIDI.END_SYSEX);

		return copy;
	}

	static parseMidiMessage(data: unknown): MidiMessage {
		const invalid: InvalidMidiMessage = { valid: false };

		if (!Array.isArray(data)) return invalid;
		if (!data.every(isValidInt)) return invalid;
		if (!data.length) return invalid;
		if (data[0] < MIDI.NOTE_OFF) return invalid;

		if (data[0] == MIDI.SYSEX && data[data.length - 1] == MIDI.END_SYSEX) {
			return {
				valid: true,
				status: MIDI.SYSEX,
				data: data.slice(1, -1)
			};
		}
		const status = MIDI.getStatus(data[0]);

		switch (status) {
			case MIDI.NOTE_OFF:
			case MIDI.NOTE_ON:
				return {
					valid: true,
					status,
					channel: MIDI.getChannel(data[0]),
					note: data[1],
					velocity: data[2]
				};
			case MIDI.AFTERTOUCH:
				return {
					valid: true,
					status,
					channel: MIDI.getChannel(data[0]),
					note: data[1],
					value: data[2]
				};
			case MIDI.CONTROL_CHANGE:
				return {
					valid: true,
					status,
					channel: MIDI.getChannel(data[0]),
					control: data[1],
					value: data[2]
				};
			case MIDI.PITCHBEND:
				return {
					valid: true,
					status,
					channel: MIDI.getChannel(data[0]),
					value: MIDI.pitchbend(data[1], data[2]),
					msb: data[1],
					lsb: data[2]
				};

			case MIDI.CHANNEL_AFTERTOUCH:
				return {
					valid: true,
					status,
					channel: MIDI.getChannel(data[0]),
					value: data[1]
				};
			case MIDI.PROGRAM_CHANGE:
				return {
					valid: true,
					status,
					channel: MIDI.getChannel(data[0]),
					program: data[1]
				};
		}

		return invalid;
	}

	static isValidMidiMessage(data: unknown): data is number[] {
		if (!Array.isArray(data)) return false;
		if (!data.every(isValidInt)) return false;
		if (!data.length) return false;
		if (data[0] < MIDI.NOTE_OFF) return false;

		if (data[0] == MIDI.SYSEX) return data[data.length - 1] == MIDI.END_SYSEX;

		const status = MIDI.getStatus(data[0]);

		switch (status) {
			case MIDI.NOTE_OFF:
			case MIDI.NOTE_ON:
			case MIDI.AFTERTOUCH:
			case MIDI.CONTROL_CHANGE:
			case MIDI.PITCHBEND:
				return data.length == 3;

			case MIDI.CHANNEL_AFTERTOUCH:
			case MIDI.PROGRAM_CHANGE:
				return data.length == 2 || data.length == 3;
		}

		return false;
	}

	private byte(arr: number[]) {
		return new Uint8Array(arr);
	}

	private cb: MidiCallback = {
		noteOff: [],
		noteOn: [],
		afterTouch: [],
		controlChange: [],
		programChange: [],
		channelAfterTouch: [],
		pitchBend: [],
		sysEx: [],
		raw: [],
		invalid: []
	};

	constructor(transport: T) {
		this.t = transport;

		const listener = ({ data }: { data: Uint8Array }) => {
			this.cb.raw.forEach(async (c) => c(Array.from(data)));

			const p = MIDI.parseMidiMessage(Array.from(data));

			if (!p.valid) {
				return this.cb.invalid.forEach(async (c) => c(Array.from(data)));
			}

			switch (p.status) {
				case MIDI.NOTE_OFF:
					return this.cb.noteOff.forEach(async (c) => c(p.note, p.velocity, p.channel));
				case MIDI.NOTE_ON:
					return this.cb.noteOn.forEach(async (c) => c(p.note, p.velocity, p.channel));
				case MIDI.AFTERTOUCH:
					return this.cb.afterTouch.forEach(async (c) => c(p.note, p.value, p.channel));
				case MIDI.CONTROL_CHANGE:
					return this.cb.controlChange.forEach(async (c) => c(p.control, p.value, p.channel));
				case MIDI.PROGRAM_CHANGE:
					return this.cb.programChange.forEach(async (c) => c(p.program, p.channel));
				case MIDI.CHANNEL_AFTERTOUCH:
					return this.cb.channelAfterTouch.forEach(async (c) => c(p.value, p.channel));
				case MIDI.PITCHBEND:
					return this.cb.pitchBend.forEach(async (c) => c(p.value, p.channel));
				case MIDI.SYSEX:
					this.cb.sysEx.forEach(async (c) => c(p.data));
			}

			return;
		};

		this.t.init(listener);
	}

	addEventListener<T extends keyof MidiCallback>(type: T, cb: MidiCallback[T][number]) {
		// @ts-expect-error Type 'MidiCallback[T][number]' is not assignable to type 'MidiCallback[T]'.
		this.cb[type].push(cb);
	}

	removeEventListener<T extends keyof MidiCallback>(type: T, cb: MidiCallback[T][number]) {
		// @ts-expect-error Type 'MidiCallback[T][number]' is not assignable to type 'MidiCallback[T]'.
		this.cb[type] = this.cb[type].filter((c) => c != cb);
	}

	private t: T;

	get transport() {
		return this.t;
	}

	close() {
		return this.t.close();
	}

	send(arr: Uint8Array) {
		if (!this.t.ready) return;
		this.t.send(arr);
	}

	sendRaw(data: number[] = []) {
		return MIDI.isValidMidiMessage(data) && this.send(this.byte(data));
	}

	sendRawUnsafe_YES_I_HAVE_CHECKED_ALL_THE_DETAIL_OF_MY_DATA_NOW_FUCK_OFF(data: number[]) {
		this.send(this.byte(data));
	}

	sendNoteOff(note: number, velocity = 0, ch = 0) {
		return this.sendRaw([MIDI.NOTE_OFF | ch % 16, note % 128, velocity % 128]);
	}

	sendNoteOn(note: number, velocity = 127, ch = 0) {
		if (velocity == 0) return this.sendNoteOff(note, velocity, ch);

		return this.sendRaw([MIDI.NOTE_ON | ch % 16, note % 128, velocity % 128]);
	}

	sendAftertouch(note: number, value: number, ch = 0) {
		return this.sendRaw([MIDI.AFTERTOUCH | ch % 16, note % 128, value % 128]);
	}

	sendControlChange(cc: number, value: number, ch = 0) {
		return this.sendRaw([MIDI.CONTROL_CHANGE | ch, cc % 128, value % 128]);
	}

	sendChannelAftertouch(value: number, ch = 0) {
		return this.sendRaw([MIDI.CHANNEL_AFTERTOUCH | ch % 16, value % 128]);
	}

	sendProgramChange(program: number, ch = 0) {
		return this.sendRaw([MIDI.PROGRAM_CHANGE | ch % 16, program % 128]);
	}

	sendPitchbend(value: number, ch = 0) {
		return this.sendRaw([
			MIDI.PITCHBEND | ch % 16,
			MIDI.pitchbendMSB(value),
			MIDI.pitchbendLSB(value)
		]);
	}

	sendSysEx(data: number[] = []) {
		return this.sendRaw(MIDI.sysEx(data));
	}
}
