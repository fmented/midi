import { base as b } from '$app/paths';
const base = b ? b : '';

export default {
	name: 'MIDI',
	short_name: 'MIDI',
	description: 'MIDI Controller App ',
	theme_color: '#202122',
	background_color: '#202122',
	display: 'fullscreen',
	orientation: 'landscape',
	prefer_related_applications: false,
	scope: `.`,
	start_url: `${base}`,
	lang: 'en',
	categories: [
		'music',
		'productivity',
		'utilities',
		'multimedia',
		'developer tools',
		'entertainment'
	],
	icons: [
		{
			purpose: 'maskable',
			sizes: '48x48',
			src: `${base}/maskable_icon_x48.png`,
			type: 'image/png'
		},
		{
			purpose: 'maskable',
			sizes: '72x72',
			src: `${base}/maskable_icon_x72.png`,
			type: 'image/png'
		},
		{
			purpose: 'maskable',
			sizes: '96x96',
			src: `${base}/maskable_icon_x96.png`,
			type: 'image/png'
		},
		{
			purpose: 'maskable',
			sizes: '128x128',
			src: `${base}/maskable_icon_x128.png`,
			type: 'image/png'
		},
		{
			purpose: 'maskable',
			sizes: '192x192',
			src: `${base}/maskable_icon_x192.png`,
			type: 'image/png'
		},
		{
			purpose: 'maskable',
			sizes: '384x384',
			src: `${base}/maskable_icon_x384.png`,
			type: 'image/png'
		},
		{
			purpose: 'maskable',
			sizes: '512x512',
			src: `${base}/maskable_icon_x512.png`,
			type: 'image/png'
		},
		{
			sizes: '32x32',
			src: `${base}/icon_32.png`,
			type: 'image/png'
		},
		{
			sizes: '64x64',
			src: `${base}/icon_64.png`,
			type: 'image/png'
		},
		{
			sizes: '128x128',
			src: `${base}/icon_128.png`,
			type: 'image/png'
		},
		{
			sizes: '192x192',
			src: `${base}/icon_192.png`,
			type: 'image/png'
		},
		{
			sizes: '256x256',
			src: `${base}/icon_256.png`,
			type: 'image/png'
		},
		{
			sizes: '384x384',
			src: `${base}/icon_384.png`,
			type: 'image/png'
		},
		{
			sizes: '512x512',
			src: `${base}/icon_512.png`,
			type: 'image/png'
		}
	],
	shortcuts: [
		{
			name: 'Pedal',
			url: `${base}/pedal`,
			icons: [
				{
					sizes: '512x512',
					src: `${base}/pedal.png`,
					type: 'image/png'
				}
			]
		},
		{
			name: 'Mixer',
			url: `${base}/mixer`,
			icons: [
				{
					sizes: '512x512',
					src: `${base}/mixer.png`,
					type: 'image/png'
				}
			]
		},
		{
			name: 'Drums',
			url: `${base}/drums`,
			icons: [
				{
					sizes: '512x512',
					src: `${base}/drums.png`,
					type: 'image/png'
				}
			]
		},
		{
			name: 'Switchpad',
			url: `${base}/switchpad`,
			icons: [
				{
					sizes: '512x512',
					src: `${base}/launchpad.png`,
					type: 'image/png'
				}
			]
		},
		{
			name: 'Keyboard',
			url: `${base}/keyboard`,
			icons: [
				{
					sizes: '512x512',
					src: `${base}/piano.png`,
					type: 'image/png'
				}
			]
		},
		{
			name: 'Notepad',
			url: '/notepad',
			icons: [
				{
					sizes: '512x512',
					src: `${base}/launchpad.png`,
					type: 'image/png'
				}
			]
		}
	],
	screenshots: [
		{
			sizes: '2402x1081',
			src: `${base}/ss_pedal.png`,
			type: 'image/png',
			form_factor: 'wide'
		},

		{
			sizes: '2402x1081',
			src: `${base}/ss_mixer.png`,
			type: 'image/png',
			form_factor: 'wide'
		},

		{
			sizes: '2402x1081',
			src: `${base}/ss_drums.png`,
			type: 'image/png',
			form_factor: 'wide'
		},

		{
			sizes: '2402x1081',
			src: `${base}/ss_keyboard.png`,
			type: 'image/png',
			form_factor: 'wide'
		},

		{
			sizes: '2402x1081',
			src: `${base}/ss_notepad.png`,
			type: 'image/png',
			form_factor: 'wide'
		},

		{
			sizes: '2402x1081',
			src: `${base}/ss_switchpad.png`,
			type: 'image/png',
			form_factor: 'wide'
		},
		{
			sizes: '2402x1081',
			src: `${base}/ss_pedal.png`,
			type: 'image/png',
			platform: 'android'
		},

		{
			sizes: '2402x1081',
			src: `${base}/ss_mixer.png`,
			type: 'image/png',
			platform: 'android'
		},

		{
			sizes: '2402x1081',
			src: `${base}/ss_drums.png`,
			type: 'image/png',
			platform: 'android'
		},

		{
			sizes: '2402x1081',
			src: `${base}/ss_keyboard.png`,
			type: 'image/png',
			platform: 'android'
		},

		{
			sizes: '2402x1081',
			src: `${base}/ss_notepad.png`,
			type: 'image/png',
			platform: 'android'
		},

		{
			sizes: '2402x1081',
			src: `${base}/ss_switchpad.png`,
			type: 'image/png',
			platform: 'android'
		}
	]
};
