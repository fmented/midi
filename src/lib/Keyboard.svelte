<script lang="ts">
	import { musicalOctave2MidiNote } from './helper';
	import Piano from './Piano.svelte';
	import { states } from './states.svelte';

	const { active }: { active?: boolean } = $props();

	let transpose = $state(0);

	function increaseTranspose() {
		if (transpose == 12) return (transpose = -12);
		transpose = transpose + 1;
	}

	function decreaseTranspose() {
		if (transpose == -12) return (transpose = 12);
		transpose = transpose - 1;
	}

	function onChangeHandler(e: any) {
		if (import.meta.env.DEV)
			console.log(e.note[1] + transpose + musicalOctave2MidiNote(octave), e.note[0] ? 'On' : 'Off');
		const c = states.midi;
		if (!c) return;
		if (e.note[0]) {
			return c.sendNoteOn(e.note[1] + transpose + musicalOctave2MidiNote(octave));
		}
		c.sendNoteOff(e.note[1] + transpose + musicalOctave2MidiNote(octave));
	}

	function increaseOctave() {
		if (octave == 2) return (octave = -2);
		octave = octave + 1;
	}

	function decreaseOctave() {
		if (octave == -2) return (octave = 2);
		octave = octave - 1;
	}

	let octave = $state(0);
</script>

<div class="grid opacity-0" class:hidden={!active} class:fadein={active}>
	<div class="flex h-max items-center justify-around">
		<div class="flex h-max w-max items-center">
			<button class="btn" onclick={decreaseOctave} aria-label="Decrease Octave">
				<svg
					width="1em"
					height="1em"
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
					color="currentColor"
					><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"
					></path></svg
				>
			</button>
			<span>Octave : <span class="inline-block min-w-[3ch]">{octave}</span></span>
			<button class="btn" onclick={increaseOctave} aria-label="Increase Octave">
				<svg
					width="1em"
					height="1em"
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
					color="currentColor"
					><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"
					></path></svg
				>
			</button>
		</div>
		<div class="flex h-max w-max items-center">
			<button class="btn" onclick={decreaseTranspose} aria-label="Decrease Transpose">
				<svg
					width="1em"
					height="1em"
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
					color="currentColor"
					><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"
					></path></svg
				>
			</button>
			<span>Transpose : <span class="inline-block min-w-[3ch]">{transpose}</span></span>
			<button class="btn" onclick={increaseTranspose} aria-label="Increase Transpose">
				<svg
					width="1em"
					height="1em"
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
					color="currentColor"
					><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"
					></path></svg
				>
			</button>
		</div>
	</div>
	<Piano onchange={onChangeHandler} class="h-[99%] w-full self-end" />
</div>

<style>
	.grid {
		grid-template-rows: auto 1fr;
		height: 100%;
		width: 100%;
		position: relative;
		overflow: clip;
	}

	span {
		user-select: none;
	}
</style>
