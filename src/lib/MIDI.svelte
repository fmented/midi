<script lang="ts">
	import Header from '$lib/Header.svelte';
	import Landscape from '$lib/Landscape.svelte';
	import Pedal from '$lib/Pedal.svelte';
	import Drums from '$lib/Drums.svelte';
	import Mixer from '$lib/Mixer.svelte';
	import Notepad from '$lib/Notepad.svelte';
	import Switchpad from '$lib/Switchpad.svelte';
	import Keyboard from '$lib/Keyboard.svelte';
	import { states } from '$lib/states.svelte';
	import { base } from '$app/paths';

	type Props = {
		menu: string;
		useLocalStorage?: boolean;
	};

	let { menu, useLocalStorage }: Props = $props();

	let meneMap = {
		pedal: Pedal,
		drums: Drums,
		keyboard: Keyboard,
		switchpad: Switchpad,
		notepad: Notepad,
		mixer: Mixer
	};

	$effect(() => {
		if (useLocalStorage) {
			const m = localStorage.getItem('menu');
			states.menu = m ? m : menu;
		} else {
			states.menu = menu;
		}
	});
</script>

<Landscape>
	<div
		class={['app', !states.landscape && 'hidden translate-y-full', states.landscape && 'flyin-up']}
	>
		<Header
			onChangeMenu={(m) => {
				if (useLocalStorage) {
					localStorage.setItem('menu', m);
				}
			}}
		/>
		{#each Object.entries(meneMap) as [k, Component]}
			<Component active={states.menu == k} />
		{/each}
	</div>
</Landscape>

<svelte:head>
	<link rel="manifest" href="{base}/manifest.json" />
</svelte:head>

<style>
	.app {
		height: 100svh;
		width: 100svw;
		max-width: 100svw;
		max-height: 100svh;
		display: grid;
		grid-template-rows: auto 1fr;
		overflow: hidden;
		position: relative;
	}
</style>
