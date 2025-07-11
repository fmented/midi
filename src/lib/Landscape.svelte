<script lang="ts">
	import type { Snippet } from 'svelte';
	import rotate from './rotate.webm?url';

	import { states } from './states.svelte';

	type Props = {
		children?: Snippet;
	};

	let { children }: Props = $props();

	function init() {
		const query = window.matchMedia('(orientation: landscape)');
		states.landscape = query.matches;
		return query;
	}

	$effect(() => {
		const query = init();

		function handler(e: MediaQueryListEvent) {
			states.landscape = e.matches;
		}

		function isFullscreen() {
			states.fullscreen = document.fullscreenElement !== null;
		}

		query.addEventListener('change', handler);

		const resizeObserver = new ResizeObserver(init);
		resizeObserver.observe(document.body, {});
		window.addEventListener('orientationchange', init);
		window.addEventListener('visibilitychange', init);
		window.addEventListener('resize', init);
		isFullscreen();
		window.addEventListener('fullscreenchange', isFullscreen);

		return () => {
			query.removeEventListener('change', handler);
			window.removeEventListener('orientationchange', init);
			window.removeEventListener('visibilitychange', init);
			window.removeEventListener('resize', init);
			resizeObserver.disconnect();
			window.removeEventListener('fullscreenchange', isFullscreen);
		};
	});

	let rate = $state(1.75);
</script>

{#if states.landscape === undefined}
	<dialog open class="modal">
		<div class="modal-box bg-neutral">
			<h3 class="text-center text-2xl font-bold">
				<span>Please Wait...</span>
				<br />
				<div class="loading"></div>
			</h3>
		</div>
	</dialog>
{/if}

<dialog
	open
	class={[
		'modal',
		(states.landscape || states.landscape === undefined) && 'hidden -translate-y-full',
		states.landscape === false && 'flyin-down'
	]}
	class:flyin={states.landscape === false}
>
	<div class="modal-box bg-neutral">
		<h3 class="text-lg font-bold">This Page Is Only Available in Landscape</h3>
		<video
			width="100"
			height="100"
			style="margin: auto;"
			src={rotate}
			bind:playbackRate={rate}
			autoplay
			loop
			muted
		></video>
		<p class="py-4">Please Rotate Your Device</p>
	</div>
	<div class="modal-backdrop bg-base-300"></div>
</dialog>

{#if children}
	{@render children()}
{/if}
