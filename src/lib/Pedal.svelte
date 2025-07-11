<script lang="ts">
	import PBoard from './PBoard.svelte';

	const { active }: { active?: boolean } = $props();

	let currentMappingIndex = $state(0);

	function changeMapping(index: number) {
		currentMappingIndex = index;
	}
</script>

<div class="ctr w-[100% grid h-[100%]" class:hidden={!active} class:fadein={active}>
	<div class="flex justify-center gap-2 py-1">
		{#each Array(5) as _, i}
			<button
				class="btn btn-xs sm:btn-sm btn-neutral"
				class:btn-primary={currentMappingIndex == i}
				onclick={() => changeMapping(i)}>{i + 1}</button
			>
		{/each}
	</div>
	{#each Array(5) as _, i}
		<PBoard show={currentMappingIndex == i} index={i} />
	{/each}
</div>

<style>
	.ctr {
		grid-template-rows: auto 1fr;
		position: relative;
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
