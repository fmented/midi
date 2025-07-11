<script lang="ts">
	type Colors = `${string};${string};${string}`;
	type Switch_Props = {
		value: 0 | 1;

		defvalue: 0 | 1;
		src: string;

		tooltip: string;
		color: Colors;
		outline: 0 | 1 | string;
		width: number;
		height: number;
		enable: 0 | 1;

		oninput: (e: InputEvent & { target: Switch_ }) => void;
		onchange: (e: Event & { target: Switch_ }) => void;
	};

	export function setValue(v: 0 | 1) {
		if (!switch_) return;
		switch_.setValue(v);
	}

	type Switch_ = HTMLElement &
		Partial<Switch_Props> & {
			setValue: (v: 0 | 1) => void;
		};

	type Props = Partial<
		Omit<Switch_Props, 'width' | 'height'> & {
			width?: string;
			height?: string;
			class?: string;
		}
	>;

	let { height, width, class: className = '', oninput, onchange, ...p }: Props = $props();

	let div: HTMLDivElement | undefined = $state();

	let switch_: Switch_ | undefined = $state();

	function init() {
		requestAnimationFrame(() => {
			if (!div || !switch_) return;
			const { width, height } = div.getBoundingClientRect();
			const lowest = Math.round(Math.min(width, height));
			switch_.width = lowest;
			switch_.height = lowest;
		});
	}

	$effect(() => {
		if (!div || !switch_) return;
		init();

		function inputHandler(e: Event) {
			oninput?.(e as InputEvent & { target: Switch_ });
		}

		function changeHandler(e: Event) {
			onchange?.(e as Event & { target: Switch_ });
		}

		switch_.addEventListener('input', inputHandler);
		switch_.addEventListener('change', changeHandler);
		const resizeObserver = new ResizeObserver(init);
		resizeObserver.observe(div);
		return () => {
			switch_?.removeEventListener('input', inputHandler);
			switch_?.removeEventListener('change', changeHandler);
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
		<webaudio-switch bind:this={switch_} {...p}></webaudio-switch>
	{/if}
</div>

<style>
	div {
		display: grid;
		place-items: center;
		position: relative;
	}
</style>
