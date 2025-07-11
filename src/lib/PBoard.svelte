<script lang="ts">
	import Knob from './Knob.svelte';
	import { states } from './states.svelte';
	import Switch from './Switch.svelte';

	type Props = {
		index: number;
		show: boolean;
	};

	const { index = 0, show = false }: Props = $props();

	const pedalStates: (0 | 1)[] = $state([0, 0, 0, 0]);

	const buttonStates = $state({
		prevPreset: false,
		nextPreset: false,
		prevBank: false,
		nextBank: false
	});

	type Mapping = {
		pedals: number[];
		nextPreset: number;
		prevPreset: number;
		nextBank: number;
		prevBank: number;
		volume: number;
	};

	type PedalMap = [Mapping, Mapping, Mapping, Mapping, Mapping];

	const pedalMap: PedalMap = [
		{
			pedals: [0, 1, 2, 3],
			nextPreset: 4,
			prevPreset: 5,
			nextBank: 6,
			prevBank: 7,
			volume: 8
		},
		{
			pedals: [9, 10, 11, 12],
			nextPreset: 13,
			prevPreset: 14,
			nextBank: 15,
			prevBank: 16,
			volume: 17
		},
		{
			pedals: [18, 19, 20, 21],
			nextPreset: 22,
			prevPreset: 23,
			nextBank: 24,
			prevBank: 25,
			volume: 26
		},
		{
			pedals: [27, 28, 29, 30],
			nextPreset: 31,
			prevPreset: 32,
			nextBank: 33,
			prevBank: 34,
			volume: 35
		},

		{
			pedals: [36, 37, 38, 39],
			nextPreset: 40,
			prevPreset: 41,
			nextBank: 42,
			prevBank: 43,
			volume: 44
		}
	];

	let switches: (Switch | undefined)[] = $state([undefined, undefined, undefined, undefined]);

	function allSwitchesOff() {
		for (let i = 0; i < switches.length; i++) {
			const sw = switches[i];
			if (sw) sw.setValue(0);
		}
	}

	function setSwitch(index: number, value: 0 | 1 = 1) {
		const sw = switches[index];
		if (sw) sw.setValue(value);
	}

	function onpointerdown(e: PointerEvent, i: number) {
		if (pedalStates[i] == 1) return;
		pedalStates[i] = 1;
		const c = states.midi;
		if (!c) return;
		c.sendControlChange(pedalMap[index].pedals[i], 127);
	}

	function onpointerup(e: PointerEvent, i: number) {
		if (pedalStates[i] == 0) return;
		pedalStates[i] = 0;
		allSwitchesOff();
		setSwitch(i);
		const c = states.midi;
		if (!c) return;
		c.sendControlChange(pedalMap[index].pedals[i], 0);
	}

	function nextPresetDown() {
		if (buttonStates.nextPreset) return;
		buttonStates.nextPreset = true;
		const c = states.midi;
		if (!c) return;
		c.sendControlChange(pedalMap[index].nextPreset, 127);
	}

	function nextPresetUp() {
		if (!buttonStates.nextPreset) return;
		buttonStates.nextPreset = false;
		allSwitchesOff();
		setSwitch(0);
		const c = states.midi;
		if (!c) return;
		c.sendControlChange(pedalMap[index].nextPreset, 0);
	}

	function prevPresetDown() {
		if (buttonStates.prevPreset) return;
		buttonStates.prevPreset = true;
		const c = states.midi;
		if (!c) return;
		c.sendControlChange(pedalMap[index].prevPreset, 127);
	}

	function prevPresetUp() {
		if (!buttonStates.prevPreset) return;
		buttonStates.prevPreset = false;
		allSwitchesOff();
		setSwitch(0);
		const c = states.midi;
		if (!c) return;
		c.sendControlChange(pedalMap[index].prevPreset, 0);
	}

	function nextBankDown() {
		if (buttonStates.nextBank) return;
		buttonStates.nextBank = true;
		const c = states.midi;
		if (!c) return;
		c.sendControlChange(pedalMap[index].nextBank, 127);
	}

	function nextBankUp() {
		if (!buttonStates.nextBank) return;
		buttonStates.nextBank = false;
		allSwitchesOff();
		setSwitch(0);
		const c = states.midi;
		if (!c) return;
		c.sendControlChange(pedalMap[index].nextBank, 0);
	}

	function prevBankDown() {
		if (buttonStates.prevBank) return;
		buttonStates.prevBank = true;
		const c = states.midi;
		if (!c) return;
		c.sendControlChange(pedalMap[index].prevBank, 127);
	}

	function prevBankUp() {
		if (!buttonStates.prevBank) return;
		buttonStates.prevBank = false;
		allSwitchesOff();
		setSwitch(0);
		const c = states.midi;
		if (!c) return;
		c.sendControlChange(pedalMap[index].prevBank, 0);
	}

	function volumeChange(e: InputEvent) {
		const c = states.midi;
		if (!c) return;

		const value = Number((e.target as HTMLInputElement).value);
		c.sendControlChange(pedalMap[index].volume, value);
	}

	function init(e: Event | undefined = undefined) {
		if (switches[0]) {
			setSwitch(0);
		}
	}

	$effect(() => {
		init();
	});
</script>

<div
	class="main gap-1 opacity-0 transition-all duration-300 ease-in-out select-none"
	class:hidden={!show}
	class:fadein={show}
>
	<div class="pedal bg-neutral">
		<Switch
			class="relative grid h-6 place-items-center self-center justify-self-center"
			bind:this={switches[0]}
			enable={0}
		/>
		<button
			class="btn h-[60%] w-[90%] self-end bg-neutral-900 text-4xl"
			onpointerdown={(e) => onpointerdown(e, 0)}
			onpointerup={(e) => onpointerup(e, 0)}
		>
			A
		</button>
	</div>
	<div class="pedal bg-neutral">
		<Switch
			class="relative grid h-6 place-items-center self-center justify-self-center"
			bind:this={switches[1]}
			enable={0}
		/>

		<button
			class="btn h-[60%] w-[90%] self-end bg-neutral-900 text-4xl"
			onpointerdown={(e) => onpointerdown(e, 1)}
			onpointerup={(e) => onpointerup(e, 1)}
		>
			B
		</button>
	</div>
	<div class="pedal bg-neutral">
		<Switch
			class="relative grid h-6 place-items-center self-center justify-self-center"
			bind:this={switches[2]}
			enable={0}
		/>

		<button
			class="btn h-[60%] w-[90%] self-end bg-neutral-900 text-4xl"
			onpointerdown={(e) => onpointerdown(e, 2)}
			onpointerup={(e) => onpointerup(e, 2)}
		>
			C
		</button>
	</div>
	<div class="pedal bg-neutral">
		<Switch
			class="relative grid h-6 place-items-center self-center justify-self-center"
			bind:this={switches[3]}
			enable={0}
		/>

		<button
			class="btn h-[60%] w-[90%] self-end bg-neutral-900 text-4xl"
			onpointerdown={(e) => onpointerdown(e, 3)}
			onpointerup={(e) => onpointerup(e, 3)}
		>
			D
		</button>
	</div>
	<div class="extra">
		<Knob
			oninput={volumeChange}
			class="aspect-1/1 h-12 self-center justify-self-center"
			min={0}
			max={127}
			defvalue={100}
			value={100}
		/>
		<div class="grid w-[100%] place-items-center self-center">
			<div class="flex h-[100%] w-[100%] flex-col justify-stretch gap-1 text-xs">
				<span class="text-center font-bold">Preset</span>
				<div class="join">
					<button
						class="btn btn-xs btn-neutral"
						onpointerdown={prevPresetDown}
						onpointerup={prevPresetUp}>Prev</button
					>
					<button
						class="btn btn-xs btn-neutral"
						onpointerdown={nextPresetDown}
						onpointerup={nextPresetUp}>Next</button
					>
				</div>
				<span class="text-center font-bold">Bank</span>
				<div class="join">
					<button
						class="btn btn-xs btn-neutral"
						onpointerdown={prevBankDown}
						onpointerup={prevBankUp}>Prev</button
					>
					<button
						class="btn btn-xs btn-neutral"
						onpointerdown={nextBankDown}
						onpointerup={nextBankUp}>Next</button
					>
				</div>
			</div>
		</div>
	</div>
</div>

<style>
	.main {
		width: 100%;
		height: 100%;
		display: grid;
		position: relative;
		grid-template-columns: repeat(4, 1fr) 0.75fr;
		padding-inline: 0.25rem;
	}

	.pedal {
		width: 100%;
		height: 100%;
		display: grid;
		position: relative;
		grid-template-rows: auto 1fr;
		padding-block: 1rem;
		gap: 0.5rem;
	}

	.pedal button {
		justify-self: center;
	}

	.extra {
		width: 100%;
		height: 100%;
		display: grid;
		grid-template-rows: 30% 1fr;
		position: relative;
		padding-block: 1rem;
		gap: 0.5rem;
	}

	.extra button {
		width: 50%;
	}
</style>
