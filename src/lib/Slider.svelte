<script lang="ts">
	type Colors = `${string};${string};${string}`;
	type SliderProps = {
		value: number;
		min: number;
		max: number;
		defvalue: number;
		src: string;
		knobsrc: string;
		tooltip: string;
		color: Colors;
		outline: 0 | 1 | string;
		width: number;
		height: number;
		knobwidth: number;
		knobheight: number;
		oninput: (e: InputEvent & { target: Slider }) => void;
		onchange: (e: Event & { target: Slider }) => void;
		enable: 0 | 1;
	};

	type Slider = HTMLElement &
		Partial<SliderProps> & {
			setValue: (v: number) => void;
		};

	type Props = Partial<
		Omit<SliderProps, 'width' | 'height'> & {
			width?: string;
			height?: string;
			class?: string;
		}
	>;

	let {
		height = '100%',
		width = '100%',
		class: className = '',
		onchange,
		oninput,
		...p
	}: Props = $props();

	let div: HTMLDivElement | undefined = $state();

	let slider: Slider | undefined = $state();

	function init() {
		if (!div || !slider) return;
		requestAnimationFrame;
		const { width, height } = div.getBoundingClientRect();
		const h = Math.round(height * 0.95);
		const w = Math.round(width / 2);
		const kw = Math.round(w * 0.8);
		const kh = Math.round(w * 1.5);
		slider.width = w;
		slider.height = h;
		slider.knobwidth = kw;
		slider.knobheight = kh;
	}

	$effect(() => {
		if (!div || !slider) return;
		init();

		function inputHandler(e: Event) {
			oninput?.(e as InputEvent & { target: Slider });
		}

		function changeHandler(e: Event) {
			onchange?.(e as Event & { target: Slider });
		}

		slider.addEventListener('input', inputHandler);
		slider.addEventListener('change', changeHandler);
		const resizeObserver = new ResizeObserver(init);
		resizeObserver.observe(div);
		return () => {
			slider?.removeEventListener('input', inputHandler);
			slider?.removeEventListener('change', changeHandler);
			resizeObserver.disconnect();
		};
	});
</script>

<div class={className} style="height: {height}; width: {width};" bind:this={div}>
	{#if div}
		<webaudio-slider bind:this={slider} {...p}></webaudio-slider>
	{/if}
</div>

<style>
	div {
		display: grid;
		place-items: center;
		position: relative;
	}
</style>
