import type { MIDI } from './transport';

type States = {
	midi?: MIDI;
	landscape?: boolean;
	menu?: string;
	fullscreen?: boolean;
};

export const states: States = $state({});
