<script lang="ts" module>
	import { fakeVelocity } from './helper';
	import bg from './drums-bg.jpg?url';
	import { states } from './states.svelte';

	type Kit =
		| 'kick1'
		| 'kick2'
		| 'snare'
		| 'tom1'
		| 'tom2'
		| 'tom3'
		| 'floor'
		| 'hh_closed'
		| 'hh_open'
		| 'ride'
		| 'crash1'
		| 'crash2'
		| 'splash';

	type KitState = Record<Kit, 0 | 1 | boolean>;

	type KitMap = Record<Kit, number>;
</script>

<script lang="ts">
	type Props = { active?: boolean };

	const { active }: Props = $props();

	const kitState: KitState = $state({
		kick1: false,
		kick2: false,
		snare: false,
		tom1: false,
		tom2: false,
		tom3: false,
		floor: false,
		hh_closed: false,
		hh_open: false,
		ride: false,
		crash1: false,
		crash2: false,
		splash: false
	});

	const kitMIDI: KitMap = $state({
		kick1: 36,
		kick2: 35,
		snare: 38,
		tom1: 48,
		tom2: 47,
		tom3: 45,
		floor: 41,
		hh_closed: 42,
		hh_open: 46,
		ride: 47,
		crash1: 49,
		crash2: 57,
		splash: 55
	});

	function on(kit: Kit, e: PointerEvent) {
		e.stopPropagation();
		e.preventDefault();

		if (kitState[kit]) return;
		const c = states.midi;
		kitState[kit] = true;
		if (!c) return;

		c.sendNoteOn(kitMIDI[kit], fakeVelocity(e), 9);
	}

	function off(kit: Kit, e: PointerEvent) {
		e.stopPropagation();
		e.preventDefault();

		if (!kitState[kit]) return;
		const c = states.midi;
		kitState[kit] = false;
		if (!c) return;
		c.sendNoteOff(kitMIDI[kit], 0, 9);
	}

	function noContextMenu(e: Event) {
		e.preventDefault();
		e.stopPropagation();
	}
</script>

<svg
	role="document"
	width="100vw"
	height="100%"
	viewBox="0 0 1136 640"
	version="1.1"
	id="svg1"
	xmlns:xlink="http://www.w3.org/1999/xlink"
	xmlns="http://www.w3.org/2000/svg"
	preserveAspectRatio="xMidYMid slice"
	class:hidden={!active}
	oncontextmenu={noContextMenu}
	><image
		width="1136"
		height="640"
		preserveAspectRatio="none"
		xlink:href={bg}
		id="image1"
		x="0"
		y="0"
		class="opacity-0"
		class:fadein={active}
		style="animation-delay: 0;"
	/>

	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<path
		style="fill:#9700fe;stroke:none;stroke-width:3.77953;stroke-linejoin:round;paint-order:stroke fill markers"
		d="m 80.545611,362.56439 8.512951,12.00544 10.477478,12.22373 11.3506,9.16779 11.13232,7.20327 15.71622,6.7667 14.84309,3.05593 12.87857,2.18281 H 177.244 l 12.87857,-1.52796 11.56888,-3.05594 9.82263,-4.14733 8.07639,-3.92905 8.94952,-4.80218 4.14733,-3.71078 2.40109,2.40109 4.80218,10.47748 3.49249,10.04092 3.27421,11.78716 1.09141,12.66029 -1.30969,17.24418 -2.61937,13.31513 -2.61937,8.73123 -3.49249,8.07639 -5.45702,9.60435 -8.29467,13.09685 -7.63983,8.51295 -9.16779,7.63983 -9.82264,6.54842 -9.82263,6.54843 -14.8431,5.23873 -10.04091,2.61937 -15.9345,1.30969 -10.04092,-0.65484 -8.07639,-0.43657 -13.09684,-2.40108 -12.00545,-4.36562 -10.040912,-5.45702 -7.203266,-3.27421 -12.005444,-9.60436 -12.005443,-13.31512 -7.421547,-11.13232 -5.45702,-9.60436 -3.055931,-6.7667 -3.274211,-9.1678 -2.61937,-13.53341 -1.091404,-18.1173 2.401089,-17.24418 3.710773,-12.22373 4.802178,-11.13232 3.929054,-8.07639 5.45702,-8.51295 6.548423,-8.29467 6.548424,-5.89358 4.147335,-4.5839 z"
		id="hh_closed"
		fill-opacity={kitState.hh_closed ? 0.250292 : 0}
		onpointerdown={(e) => on('hh_closed', e)}
		onpointerup={(e) => off('hh_closed', e)}
		onpointerleave={(e) => off('hh_closed', e)}
		oncontextmenu={noContextMenu}
		onpointermove={noContextMenu}
	/>

	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<path
		id="hh_open"
		fill-opacity={kitState.hh_open ? 0.250292 : 0}
		onpointerdown={(e) => on('hh_open', e)}
		onpointerup={(e) => off('hh_open', e)}
		onpointerleave={(e) => off('hh_open', e)}
		oncontextmenu={noContextMenu}
		onpointermove={noContextMenu}
		style="fill:#9700fe;stroke:none;stroke-width:3.77953;stroke-linejoin:round;paint-order:stroke fill markers"
		d="m 110.51367,226.58203 -5.55664,4.32227 -11.730468,11.11328 -9.878906,12.34765 L 71,279.06055 l -4.322266,32.10547 4.939454,30.25195 3.597656,6.77148 2.05664,6.29883 5.675782,10.47656 7.638672,12.22461 4.917968,4.33985 2.042969,3.10547 19.757815,16.66992 26.54687,11.11328 20.375,2.46875 22.22656,-0.61719 19.13868,-4.93945 22.22656,-10.4961 18.52148,-16.66796 10.49414,-13.58399 9.87891,-17.28711 7.4082,-25.3125 v -25.3125 l -4.32031,-21.60937 -11.11328,4.32226 -29.63477,4.93946 -22.84375,-0.61719 -26.54882,-4.93946 -30.86914,-16.66992 -22.22657,-19.13867 z"
	/>

	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<path
		style="fill:#9700fe;stroke:none;stroke-width:3.77953;stroke-linejoin:round;paint-order:stroke fill markers"
		d="m 605.07435,571.89567 18.33558,20.95495 24.44745,16.58934 24.44745,13.09685 31.43243,7.85811 33.17868,1.74625 27.06682,-5.23874 20.08183,-2.61937 13.96998,-6.98499 14.84309,-12.22372 14.84309,-8.73123 17.46247,-17.46247 18.33558,-19.20871 11.3506,-15.71621 4.36562,-19.20871 1.74625,-21.82808 0.87312,-32.30556 -0.87312,-20.95495 -2.61937,-20.08184 -6.98499,-18.33558 -14.84309,-21.82808 -9.60436,-15.71622 -16.58934,-14.84309 -13.96997,-12.22373 -5.23874,-5.23874 -11.3506,8.73124 -12.22372,7.8581 -12.22373,-2.61937 -19.20871,-2.61936 -26.19369,-6.98499 -26.1937,-11.3506 -3.49249,4.36561 -6.98498,19.20871 -11.3506,28.81307 -0.87313,7.85811 3.49249,24.44745 -13.96997,7.8581 -13.09684,-0.87312 -17.46247,13.96997 -16.58934,10.47748 -12.22372,8.73123 h -15.71622 l -15.71621,0.87312 -6.11187,0.87313 -0.87312,22.7012 1.74625,12.22372 6.11186,28.81307 8.73123,24.44745 0.87312,7.8581 z"
		id="kick2"
		onpointerdown={(e) => on('kick2', e)}
		onpointerup={(e) => off('kick2', e)}
		onpointerleave={(e) => off('kick2', e)}
		fill-opacity={kitState.kick2 ? 0.250292 : 0}
		oncontextmenu={noContextMenu}
		onpointermove={noContextMenu}
	/>

	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<path
		style="fill:#9700fe;stroke:none;stroke-width:3.77953;stroke-linejoin:round;paint-order:stroke fill markers"
		d="m 433.94221,626.0293 27.06682,-3.49249 14.84309,-7.85811 21.82808,-17.46246 32.30556,-32.30556 18.33558,-23.57432 7.85811,-15.71622 4.36562,-39.29054 -4.36562,-32.30556 -9.60435,1.74625 -9.60436,1.74624 -11.3506,-2.61937 -10.47748,-9.60435 -18.33558,-11.3506 -18.33559,-18.33559 -9.60435,-1.74624 -7.85811,-9.60436 V 392.0323 l -7.85811,-22.7012 -6.11186,-16.58934 -5.23874,-13.09685 1.74624,-11.3506 -13.96997,-0.87313 -6.98498,1.74625 -10.47748,2.61937 -20.95496,1.74625 -13.09684,-0.87313 -20.95496,-5.23874 -5.23874,-3.49249 -9.60435,6.98499 -18.33559,12.22372 -17.46246,13.09685 -27.06682,33.17868 -13.96997,19.20871 -5.23874,7.85811 -0.87312,6.11186 -6.98499,31.43243 0.87313,32.30556 5.23873,35.79805 3.4925,13.09684 27.06681,37.5443 27.93995,27.93994 c 0,0 22.7012,18.33559 26.19369,18.33559 3.49249,0 23.57433,3.49249 23.57433,3.49249 l 20.95495,3.49249 21.82808,1.74625 z"
		id="kick1"
		onpointerdown={(e) => on('kick1', e)}
		onpointerup={(e) => off('kick1', e)}
		onpointerleave={(e) => off('kick1', e)}
		fill-opacity={kitState.kick1 ? 0.250292 : 0}
		oncontextmenu={noContextMenu}
		onpointermove={noContextMenu}
	/>

	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<path
		style="fill:#9700fe;stroke:none;stroke-width:3.77953;stroke-linejoin:round;paint-order:stroke fill markers"
		d="m 442.67344,323.92869 0.87312,19.20871 8.73124,16.58934 6.98498,18.33559 4.36562,18.33558 6.11186,13.96997 12.22372,2.61937 17.46247,19.20871 16.58934,10.47748 13.09684,12.22372 10.47748,0.87313 12.22372,-1.74625 38.41742,0.87312 13.96997,3.4925 12.22373,-2.61937 v -10.47748 l 14.84309,-7.85811 21.82808,-19.20871 13.96997,-0.87312 9.60436,-16.58934 v -11.3506 l 9.60435,-21.82808 3.49249,-20.08183 8.73124,-9.60436 -1.74625,-8.73123 -9.60436,-4.36562 -5.23873,-6.98498 -1.74625,-13.09685 -8.73123,-19.20871 -4.36562,-6.11186 -1.74624,-13.09685 -5.23874,-13.96997 -18.33559,-19.20871 -4.36562,2.61937 -10.47747,8.73123 -16.58934,11.3506 -18.33559,6.98499 -15.71622,1.74625 -7.85811,6.11186 -8.73123,0.87312 -10.47747,-7.85811 -22.70121,-10.47747 -21.82808,-18.33559 -3.49249,-1.74625 -17.46246,15.71622 -6.11186,6.11186 -6.11187,21.82808 -10.47747,18.33559 -10.47748,13.96997 z"
		id="snare"
		onpointerdown={(e) => on('snare', e)}
		onpointerup={(e) => off('snare', e)}
		onpointerleave={(e) => off('snare', e)}
		fill-opacity={kitState.snare ? 0.250292 : 0}
		oncontextmenu={noContextMenu}
		onpointermove={noContextMenu}
	/>

	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<path
		style="fill:#9700fe;stroke:none;stroke-width:3.77953;stroke-linejoin:round;paint-order:stroke fill markers"
		d="m 350.55895,321.30932 17.89902,7.42155 14.40653,3.05593 h 18.33559 l 21.82808,-4.80218 11.78716,-1.74624 3.92906,-0.43657 4.80217,-5.23873 v -6.98499 l 9.1678,-7.85811 12.66028,-19.20871 7.42155,-14.84309 4.36562,-22.7012 4.36561,2.1828 1.30969,-9.60435 -5.6753,-6.98499 -1.74625,-4.36561 -3.92906,-16.15278 -7.42154,-12.66029 -6.54843,-7.8581 -9.16779,1.30968 h -15.71622 l -13.5334,-2.18281 -12.66029,-4.80217 -15.27966,-7.42155 -9.60435,-8.29467 -10.47748,-10.47748 -12.66028,3.49249 -5.6753,3.4925 -1.30969,1.74624 -2.61937,15.71622 -2.61937,12.66029 -5.6753,14.84309 -10.47748,16.58934 -7.85811,10.47748 -10.91403,13.09684 -7.42155,7.85811 1.74624,9.60436 9.60436,22.7012 20.08183,21.39152 3.49249,6.98498 6.54843,6.98499 z"
		id="tom1"
		onpointerdown={(e) => on('tom1', e)}
		onpointerup={(e) => off('tom1', e)}
		onpointerleave={(e) => off('tom1', e)}
		fill-opacity={kitState.tom1 ? 0.250292 : 0}
		oncontextmenu={noContextMenu}
		onpointermove={noContextMenu}
	/>

	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<path
		style="fill:#9700fe;stroke:none;stroke-width:3.77953;stroke-linejoin:round;paint-order:stroke fill markers"
		d="m 557.9257,266.73912 3.05593,2.61937 7.85811,-0.87312 7.42154,-5.6753 13.09685,-0.87312 11.78716,-3.92906 14.8431,-7.85811 14.40653,-11.3506 9.60435,-6.98498 h 6.11187 l 2.1828,-9.60436 -0.87312,-4.80217 6.98499,-20.95496 1.74624,-9.16779 -11.78716,-4.80218 -12.22372,-7.42155 -9.1678,-6.11186 -9.16779,-8.29467 -9.16779,-11.3506 -6.54843,-12.22372 -7.42154,-14.8431 -3.4925,-15.71621 -2.61937,-19.208714 -0.43656,-3.929055 -9.60435,-3.055931 -12.22373,6.984986 -13.53341,2.182808 -14.40653,4.365615 -8.29467,5.675301 v 8.29467 9.60435 l -2.61937,11.35061 -4.80217,13.5334 -5.67531,11.35061 -9.16779,12.22372 -10.04091,9.16779 -7.42155,5.23874 -4.80218,3.05593 2.61937,16.58934 -2.18281,4.36562 2.61937,11.78716 3.49249,4.36562 3.92906,0.43656 9.16779,10.91404 6.98499,2.61937 17.46246,15.71621 11.78716,6.11187 12.22373,4.80217 4.36561,4.36562 z"
		id="tom2"
		onpointerdown={(e) => on('tom2', e)}
		onpointerup={(e) => off('tom2', e)}
		onpointerleave={(e) => off('tom2', e)}
		fill-opacity={kitState.tom2 ? 0.250292 : 0}
		oncontextmenu={noContextMenu}
		onpointermove={noContextMenu}
	/>

	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<path
		style="fill:#9700fe;stroke:none;stroke-width:3.77953;stroke-linejoin:round;paint-order:stroke fill markers"
		d="m 668.37578,276.78004 5.23874,10.04092 7.8581,17.0259 0.87313,12.66028 6.98498,7.42155 9.1678,3.49249 3.92905,3.05593 h 2.61937 l 10.91404,6.11187 13.96997,5.6753 8.73123,3.05593 15.71622,3.05593 15.71621,0.43656 h 8.29467 l 6.54843,5.23874 9.60435,-2.18281 5.6753,-6.98498 3.05593,-5.6753 10.91404,-4.80218 13.09685,-8.29467 11.78716,-14.84309 9.1678,-10.47748 6.54842,-13.53341 9.16779,-5.23874 2.18281,-10.04092 -3.05593,-4.36561 v -10.04092 l -9.16779,-6.11186 -7.85811,-6.98499 -9.60436,-8.29467 -7.8581,-9.16779 -8.73124,-9.60435 -7.42154,-11.3506 -6.54843,-14.40654 -4.80217,-12.22372 -3.92906,-17.46246 -2.18281,-5.6753 -8.29467,-2.61937 -10.04091,-2.18281 -3.49249,2.61937 -6.98499,8.29467 -8.73123,8.73123 -10.47748,6.54842 -11.3506,6.54843 -14.84309,4.80217 -12.22373,3.92906 -6.11186,1.30968 h -13.09685 l -9.16779,-0.87312 -1.74625,3.05593 -3.92905,8.29467 -5.23874,3.49249 -3.49249,3.4925 -5.23874,4.36561 -1.30969,10.47748 4.36562,7.42155 v 11.3506 9.60435 2.61937 l 2.18281,3.49249 1.74624,10.91404 z"
		id="tom3"
		onpointerdown={(e) => on('tom3', e)}
		onpointerup={(e) => off('tom3', e)}
		onpointerleave={(e) => off('tom3', e)}
		fill-opacity={kitState.tom3 ? 0.250292 : 0}
		oncontextmenu={noContextMenu}
		onpointermove={noContextMenu}
	/>

	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<ellipse
		style="fill:#9700fe;stroke:none;stroke-width:4.23816;stroke-linejoin:round;paint-order:stroke fill markers"
		id="floor"
		fill-opacity={kitState.floor ? 0.250292 : 0}
		onpointerdown={(e) => on('floor', e)}
		onpointerup={(e) => off('floor', e)}
		onpointerleave={(e) => off('floor', e)}
		oncontextmenu={noContextMenu}
		onpointermove={noContextMenu}
		cx="1008.2"
		cy="401.92175"
		rx="123.87683"
		ry="125.11163"
	/>

	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<ellipse
		style="fill:#9700fe;stroke:none;stroke-width:4.67684;stroke-linejoin:round;paint-order:stroke fill markers"
		id="crash1"
		cx="221.33673"
		cy="157.16217"
		rx="128.78566"
		ry="130.96848"
		onpointerdown={(e) => on('crash1', e)}
		onpointerup={(e) => off('crash1', e)}
		onpointerleave={(e) => off('crash1', e)}
		fill-opacity={kitState.crash1 ? 0.250292 : 0}
		oncontextmenu={noContextMenu}
		onpointermove={noContextMenu}
	/>

	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<ellipse
		style="fill:#9700fe;stroke:none;stroke-width:3.88578;stroke-linejoin:round;paint-order:stroke fill markers"
		id="splash"
		cx="439.18094"
		cy="106.08447"
		rx="88.18544"
		ry="87.748878"
		onpointerdown={(e) => on('splash', e)}
		onpointerup={(e) => off('splash', e)}
		onpointerleave={(e) => off('splash', e)}
		fill-opacity={kitState.splash ? 0.250292 : 0}
		oncontextmenu={noContextMenu}
		onpointermove={noContextMenu}
	/>

	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<path
		id="crash2"
		onpointerdown={(e) => on('crash2', e)}
		onpointerup={(e) => off('crash2', e)}
		onpointerleave={(e) => off('crash2', e)}
		fill-opacity={kitState.crash2 ? 0.250292 : 0}
		oncontextmenu={noContextMenu}
		onpointermove={noContextMenu}
		style="fill:#9700fe;stroke:none;stroke-width:4.5737;stroke-linejoin:round;paint-order:stroke fill markers"
		d="M 631.4375,0.46289062 A 105.26522,105.08351 0 0 0 586.52148,86.5625 a 105.26522,105.08351 0 0 0 69.33008,98.76953 105.26522,105.08351 0 0 0 0.004,0.002 l 2.23047,1.32032 0.0781,0.41601 -0.26562,1.41602 3.38281,1.08984 6.00391,1.63867 5.7832,0.98047 5.23828,0.65625 0.64258,-0.92968 0.18164,0.0312 0.33398,-0.5 5.06446,0.63477 6.875,0.43555 h 7.20312 4.36524 l 6.33007,-1.7461 0.29493,-0.24023 2.98046,-0.85156 -0.004,-0.10938 a 105.26522,105.08351 0 0 0 63.47851,-40.03711 l 0.008,0.0234 h 1.18164 l 0.16406,0.0684 0.0371,-0.0684 h 0.7793 l 0.74414,-2.8125 1.27734,-2.35742 2.40234,-3.49219 2.72852,-4.69336 2.18164,-5.34765 2.18359,-4.47461 1.85547,-5.78516 v -0.64063 a 105.26522,105.08351 0 0 0 0.32813,-0.99414 l 0.32617,0.8711 0.98242,-5.12891 0.0488,-0.26367 0.002,-0.008 A 105.26522,105.08351 0 0 0 797.05273,86.5625 105.26522,105.08351 0 0 0 752.13672,0.46289062 Z"
	/>

	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<path
		id="ride"
		onpointerdown={(e) => on('ride', e)}
		onpointerup={(e) => off('ride', e)}
		onpointerleave={(e) => off('ride', e)}
		fill-opacity={kitState.ride ? 0.250292 : 0}
		oncontextmenu={noContextMenu}
		onpointermove={noContextMenu}
		style="fill:#9700fe;stroke:none;stroke-width:7.40983;stroke-linejoin:round;paint-order:stroke fill markers"
		d="m 877.37305,-0.4375 a 146.35278,147.55653 0 0 0 -83.33203,133.17578 146.35278,147.55653 0 0 0 1.66601,22.19922 l 0.72852,0.33594 1.85156,4.63086 2.00586,7.71679 3.08789,13.42969 2.16016,5.71094 5.40234,11.88476 6.32812,11.88477 4.63086,6.48242 3.39454,3.54883 5.40234,6.17383 6.94726,8.18164 6.01954,4.78515 5.24609,4.78321 9.26172,7.56445 5.86523,3.70313 1.08008,1.23437 0.30859,2.4707 -0.0117,0.002 a 146.35278,147.55653 0 0 0 74.97656,20.83398 146.35278,147.55653 0 0 0 146.35351,-147.55664 146.35278,147.55653 0 0 0 -83.332,-133.17578 z"
	/></svg
>

<style>
	svg {
		width: 100%;
		height: 100%;
		touch-action: pan-x pan-y;
		overscroll-behavior: none;
	}
</style>
