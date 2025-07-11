<script lang="ts">
	type Colors = `${string};${string};${string}`;
	type KnobProps = {
		value: number;
		min: number;
		max: number;
		defvalue: number;
		src: string;
		tooltip: string;
		color: Colors;
		outline: 0 | 1 | string;
		width: number;
		height: number;
		oninput: (e: InputEvent & { target: Knob }) => void;
		onchange: (e: Event & { target: Knob }) => void;
		enable: 0 | 1;
	};

	type Knob = HTMLElement &
		Partial<KnobProps> & {
			setValue: (v: number) => void;
		};

	type Props = Partial<
		Omit<KnobProps, 'width' | 'height'> & {
			width?: string;
			height?: string;
			class?: string;
		}
	>;

	let { height, width, class: className = '', oninput, onchange, ...p }: Props = $props();

	let div: HTMLDivElement | undefined = $state();

	let knob: Knob | undefined = $state();

	function init() {
		requestAnimationFrame(() => {
			if (!div || !knob) return;
			const { width, height } = div.getBoundingClientRect();
			const lowest = Math.round(Math.min(width, height));
			knob.width = lowest;
			knob.height = lowest;
		});
	}

	$effect(() => {
		if (!div || !knob) return;
		init();
		function inputHandler(e: Event) {
			oninput?.(e as InputEvent & { target: Knob });
		}

		function changeHandler(e: Event) {
			onchange?.(e as Event & { target: Knob });
		}

		knob.addEventListener('input', inputHandler);
		knob.addEventListener('change', changeHandler);

		const resizeObserver = new ResizeObserver(init);
		resizeObserver.observe(div);
		return () => {
			knob?.removeEventListener('input', inputHandler);
			knob?.removeEventListener('change', changeHandler);
			resizeObserver.disconnect();
		};
	});

	const w = $derived(
		height == undefined && width == undefined ? '' : width == undefined ? 'auto' : width
	);
	const h = $derived(
		height == undefined && width == undefined ? '' : height == undefined ? 'auto' : height
	);
</script>

<div
	class={className}
	style={w || h ? `width: ${w}; height: ${h}; aspect-ratio: 1/1` : 'aspect-ratio: 1/1'}
	bind:this={div}
>
	{#if div}
		<webaudio-knob bind:this={knob} {...p}></webaudio-knob>
	{/if}
</div>

<style>
	div {
		display: grid;
		place-items: center;
		position: relative;
	}
</style>
