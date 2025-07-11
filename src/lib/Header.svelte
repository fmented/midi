<script lang="ts">
	import { BLETransport } from './bt';
	import Menu from './Menu.svelte';
	import { states } from './states.svelte';
	import { MIDI } from './transport';
	import { WebMidi } from './webmidi';

	type Props = {
		onConnect?: (midi: MIDI) => void;
		onError?: (err: unknown) => void;
		onDisconnect?: () => void;
		onChangeMenu?: (mode: string) => void;
	};

	const { onConnect, onError, onDisconnect, onChangeMenu }: Props = $props();

	let connectedDevice: string = $state('');
	let connectedDeviceType: string = $state('');

	let webMidiDevice: string = $state('');

	let midiDevices: string[] = $state([]);

	async function getWebMidiDevices() {
		midiDevices = await WebMidi.list();
	}

	let modal: HTMLDialogElement | undefined = $state();

	function openModal() {
		modal?.showModal();
	}

	function closeModal() {
		modal?.close();
	}

	function clear() {
		states.midi?.close();
		states.midi = undefined;
		connectedDeviceType = '';
		connectedDevice = '';
		webMidiDevice = '';
	}

	async function onSelectChange(e: Event) {
		const target = e.target as HTMLSelectElement;
		const value = target.value;
		if (!value) return;
		try {
			if (states.midi) {
				clear();
			}
			const w = await WebMidi.connect({ name: value });

			states.midi = new MIDI(w);
			connectedDevice = value;
			connectedDeviceType = 'Web MIDI';
			w.onDisconnect = () => {
				clear();
				if (onDisconnect) onDisconnect();
			};

			if (onConnect) onConnect(states.midi);
		} catch (e) {
			console.error(e);
			if (onError) onError(e);
			clear();
		}

		closeModal();
	}

	async function onWebMidiClick() {
		await getWebMidiDevices();
		openModal();
	}

	async function onBluetoothClick() {
		try {
			const bt = await BLETransport.connect({});
			if (states.midi) {
				clear();
			}
			states.midi = new MIDI(bt);
			connectedDevice = bt.characteristic.service.device.name ?? 'Unknown';
			connectedDeviceType = 'BLE MIDI';
			bt.onDisconnect = () => {
				clear();
				if (onDisconnect) onDisconnect();
			};
			if (onConnect) onConnect(states.midi);
		} catch (e) {
			console.error(e);
			if (onError) onError(e);
			clear();
		}
	}

	function toggleFullscreen() {
		if (states.fullscreen) {
			document.exitFullscreen();
		} else {
			document.documentElement.requestFullscreen();
		}
	}

	let showMenu = $state(false);
</script>

<dialog bind:this={modal} class="modal modal-middle sm:modal-middle">
	<div class="modal-box">
		{#if !midiDevices.length}
			<div class="flex w-full justify-center">
				<span class="text-lg font-bold">No devices found</span>
			</div>
		{:else}
			<h3 class="text-lg font-bold">Select MIDI Device</h3>
			<label class="select w-full">
				<span class="label">Select a device</span>
				<select onchange={onSelectChange} bind:value={webMidiDevice}>
					{#each midiDevices as device}
						<option value={device}>{device}</option>
					{/each}
				</select>
			</label>
		{/if}
		<div class="modal-action">
			<form method="dialog" id="close-webmidi">
				<button class="btn">Close</button>
			</form>
		</div>
	</div>
</dialog>

<div class="bg-base-200 flex h-min items-center justify-between py-2">
	<div class="flex gap-2">
		<button
			class="btn btn-primary"
			aria-label="Bluetooth"
			disabled={!BLETransport.supported()}
			onclick={onBluetoothClick}
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 24 24"
				height="1rem"
				width="1rem"
				fill="currentColor"
				><path d="M0 0h24v24H0z" fill="none"></path><path
					d="M14.24 12.01l2.32 2.32c.28-.72.44-1.51.44-2.33 0-.82-.16-1.59-.43-2.31l-2.33 2.32zm5.29-5.3l-1.26 1.26c.63 1.21.98 2.57.98 4.02s-.36 2.82-.98 4.02l1.2 1.2a9.936 9.936 0 001.54-5.31c-.01-1.89-.55-3.67-1.48-5.19zm-3.82 1L10 2H9v7.59L4.41 5 3 6.41 8.59 12 3 17.59 4.41 19 9 14.41V22h1l5.71-5.71-4.3-4.29 4.3-4.29zM11 5.83l1.88 1.88L11 9.59V5.83zm1.88 10.46L11 18.17v-3.76l1.88 1.88z"
				></path></svg
			>
			BLE MIDI
		</button>
		<button
			class="btn btn-primary fs_button"
			aria-label="Toggle fullscreen"
			onclick={toggleFullscreen}
		>
			{#if states.fullscreen}
				<svg
					width="1rem"
					height="1rem"
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 24 24"
					fill="currentColor"
					color="currentColor"
					><path d="M0 0h24v24H0z" fill="none"></path><path
						d="M5 16h3v3h2v-5H5v2zm3-8H5v2h5V5H8v3zm6 11h2v-3h3v-2h-5v5zm2-11V5h-2v5h5V8h-3z"
					></path></svg
				>
			{:else}
				<svg
					width="1rem"
					height="1rem"
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 24 24"
					fill="currentColor"
					color="currentColor"
					><path d="M0 0h24v24H0z" fill="none"></path><path
						d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"
					></path></svg
				>
			{/if}
		</button>
	</div>

	<div class="flex flex-col items-center">
		<strong class="select-none">
			{#if connectedDeviceType && connectedDevice}
				{connectedDevice} ({connectedDeviceType})
			{:else}
				No device
			{/if}
		</strong>
	</div>

	<div class="flex gap-2">
		<button class="btn btn-primary" aria-label="Menu" onclick={() => (showMenu = !showMenu)}>
			<svg
				width="1rem"
				height="1rem"
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 24 24"
				fill="currentColor"
				color="currentColor"
				><path d="M0 0h24v24H0z" fill="none"></path><path
					d="M4 8h4V4H4v4zm6 12h4v-4h-4v4zm-6 0h4v-4H4v4zm0-6h4v-4H4v4zm6 0h4v-4h-4v4zm6-10v4h4V4h-4zm-6 4h4V4h-4v4zm6 6h4v-4h-4v4zm0 6h4v-4h-4v4z"
				></path></svg
			>
		</button>
		<button
			class="btn btn-primary"
			onclick={onWebMidiClick}
			aria-label="USB"
			disabled={!WebMidi.supported()}
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="1rem"
				height="1rem"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
				class="lucide lucide-usb-icon lucide-usb"
				><circle cx="10" cy="7" r="1" /><circle cx="4" cy="20" r="1" /><path
					d="M4.7 19.3 19 5"
				/><path d="m21 3-3 1 2 2Z" /><path d="M9.26 7.68 5 12l2 5" /><path
					d="m10 14 5 2 3.5-3.5"
				/><path d="m18 12 1-1 1 1-1 1Z" /></svg
			>
			Web MIDI
		</button>
	</div>
</div>

{#if showMenu}
	<Menu onclose={() => (showMenu = false)} onchange={onChangeMenu} />
{/if}

<style>
	@media (display-mode: fullscreen) {
		.fs_button {
			display: none !important;
		}
	}
</style>
