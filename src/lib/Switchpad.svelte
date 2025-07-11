<script lang="ts">
	import { states } from './states.svelte';

	const cols = 8;
	const rows = 3;

	type Props = {
		channel?: number;
		active?: boolean;
	};
	let { channel = 0, active }: Props = $props();

	const switchStates: (0 | 1)[] = $state(Array(rows * cols * 5).fill(0));

	const lowestNote = $derived(channel * rows * cols);

	function pointerDownHandler(idx: number) {
		return (e: PointerEvent) => {
			if (import.meta.env.DEV) console.log(idx, switchStates[idx] ? 'Off' : 'On');
			e.preventDefault();
			const on = switchStates[idx];
			const c = states.midi;
			if (c) {
				c.sendControlChange(lowestNote + idx, on ? 0 : 127);
			}
			switchStates[idx] = on ? 0 : 1;
		};
	}

	function cancelContextMenu(e: Event) {
		e.preventDefault();
	}
</script>

<div class="main h-[100%] w-[100%]" class:hidden={!active}>
	<div class="flex justify-center gap-2 py-1">
		{#each Array(5) as _, i}
			<button
				class="btn btn-xs sm:btn-sm btn-neutral"
				class:btn-primary={channel == i}
				onclick={() => {
					channel = i;
				}}>{i + 1}</button
			>
		{/each}
	</div>
	<div class="container grid" style="--rows:{rows}; --cols:{cols};">
		{#each Array(rows * cols * 5) as _, i}
			{@const hide = i < channel * rows * cols || i >= (channel + 1) * rows * cols}
			<button
				class="btn h-full w-full bg-neutral-900 opacity-0"
				class:bg-primary={switchStates[i]}
				class:hidden={hide}
				class:fadein={!hide}
				oncontextmenu={cancelContextMenu}
				onpointerdown={pointerDownHandler(i)}>{i + 1}</button
			>
		{/each}
	</div>
</div>

<style>
	.container {
		width: 100%;
		height: 100%;
		min-width: 100%;
		grid-template-columns: repeat(var(--cols), 1fr);
		grid-template-rows: repeat(var(--rows), 1fr);
		gap: 0.5rem;
		padding: 0.25rem;
	}

	.main {
		display: grid;
		grid-template-rows: auto 1fr;
		position: relative;
	}
</style>
