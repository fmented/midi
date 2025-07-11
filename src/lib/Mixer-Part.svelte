<script lang="ts">
	import sliderBody from './slider-bg.png?url';
	import sliderKnob from './slider-handle.png?url';
	import panKnob from './knob.png';
	import Slider from './Slider.svelte';
	import Knob from './Knob.svelte';
	import { states } from './states.svelte';

	type Props = {
		channel?: number;
		show?: boolean;
	};

	let { channel = 0, show = false }: Props = $props();

	function onPanChange(e: Event) {
		const c = states.midi;
		if (!c) return;
		const value = Number((e.target as HTMLInputElement).value);
		c.sendControlChange(channel * 2, value);
	}

	function onVolChange(e: Event) {
		const c = states.midi;
		if (!c) return;
		const value = Number((e.target as HTMLInputElement).value);

		c.sendControlChange(channel * 2 + 1, value);
	}
</script>

<div
	class="container h-[100%] w-[100%] opacity-0 transition-all delay-100 duration-300 ease-in-out"
	class:fadein={show}
	class:hidden={!show}
>
	<span class="text-center text-xs">{channel + 1}</span>

	<Knob
		class="pan self-center justify-self-center"
		width="65%"
		min={0}
		max={127}
		value={64}
		defvalue={64}
		src={panKnob}
		oninput={onPanChange}
	></Knob>

	<Slider
		class="vol"
		oninput={onVolChange}
		min={0}
		value={100}
		defvalue={100}
		max={127}
		src={sliderBody}
		knobsrc={sliderKnob}
	/>
</div>

<style>
	.container {
		display: grid;
		position: relative;
		height: 100%;
		width: 100%;
		grid-template-rows: auto auto 1fr;
		padding-block: 1rem;
	}

	:global(.pan) {
		aspect-ratio: 1 / 1;
		width: 100%;
		height: 100%;
		display: grid;
		place-items: center;
		overflow: hidden;
	}

	:global(.vol) {
		width: 100%;
		height: 100%;
		display: grid;
		place-items: center;
	}
</style>
