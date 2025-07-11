<script lang="ts">
	import MixerPart from './Mixer-Part.svelte';
	let page = $state(0);
	const cols = 12;

	const { active }: { active?: boolean } = $props();
</script>

<div class="grid h-[100%] w-[100%]" class:hidden={!active}>
	<div class="flex justify-center gap-2 py-1">
		{#each Array(5) as _, i}
			<button
				class="btn btn-xs sm:btn-sm btn-neutral"
				class:btn-primary={page == i}
				onclick={() => {
					page = i;
				}}>{i + 1}</button
			>
		{/each}
	</div>
	<div class="mixer h-[100%] w-[100%]" style="--cols: {cols}">
		{#each Array(cols * 5) as _, i}
			<MixerPart channel={i} show={i >= page * cols && i < (page + 1) * cols} />
		{/each}
	</div>
</div>

<style>
	.mixer {
		display: grid;
		height: 100%;
		max-height: 100%;
		width: 100%;
		grid-template-columns: repeat(var(--cols), 1fr);
		position: relative;
	}

	.grid {
		grid-template-rows: auto 1fr;
	}

	.hidden {
		display: none !important;
	}

	@keyframes fadein {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}

	:global(.fadein) {
		animation-name: fadein;
		animation-duration: 0.3s;
		animation-timing-function: ease-in-out;
		animation-fill-mode: forwards;
		animation-delay: 0.2s;
	}
</style>
