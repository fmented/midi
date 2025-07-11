<script lang="ts">
	type Colors =
		`${string};${string};${string};${string};${string};${string};${string};${string};${string}`;
	type NoteData = [
		/**
		 * The State of the note
		 * 0 = release
		 * 1 = press
		 */
		state: 0 | 1,

		/**
		 * The key of the note
		 */
		key: number
	];
	type KeyEvent = Event & { note: NoteData };
	type OnChange = (e: KeyEvent) => void;
	type PianoProps = {
		value: number[];
		min: number;
		keys: number;
		color: Colors;
		outline: 0 | 1 | string;
		width: number;
		height: number;

		onchange: OnChange;
		enable: 0 | 1;
	};

	type Piano = HTMLElement &
		Partial<PianoProps> & {
			setNote: (v: number[]) => void;
		};

	export function setNote(v: number[]) {
		if (!piano) return;
		piano.setNote(v);
	}

	type Props = Partial<
		Omit<PianoProps, 'width' | 'height'> & {
			width?: string;
			height?: string;
			class?: string;
		}
	>;

	let { height, width, keys = 25, class: className = '', onchange, ...p }: Props = $props();

	let div: HTMLDivElement | undefined = $state();

	let piano: Piano | undefined = $state();

	function init(entries?: ResizeObserverEntry[] | Event) {
		requestAnimationFrame(() => {
			if (!div || !piano) return;
			const { width, height } = div.getBoundingClientRect();
			piano.width = Number(width.toFixed(0));
			piano.height = Number(height.toFixed(0));
		});
	}

	$effect(() => {
		if (!div || !piano) return;
		init();

		function changeHandler(e: Event) {
			onchange?.(e as KeyEvent);
		}

		piano.addEventListener('change', changeHandler);

		const resizeObserver = new ResizeObserver(init);
		resizeObserver.observe(div);
		return () => {
			resizeObserver.disconnect();
			piano?.removeEventListener('change', changeHandler);
		};
	});

	const w = $derived(
		height == undefined && width == undefined ? '' : width == undefined ? 'auto' : width
	);
	const h = $derived(
		height == undefined && width == undefined ? '' : height == undefined ? 'auto' : height
	);
</script>

<div class={className} style={w || h ? `width: ${w}; height: ${h};` : ''} bind:this={div}>
	{#if div}
		<webaudio-keyboard bind:this={piano} {...p}></webaudio-keyboard>
	{/if}
</div>

<style>
	div {
		display: grid;
		place-items: center;
		position: relative;
		overflow: hidden;
	}
</style>
