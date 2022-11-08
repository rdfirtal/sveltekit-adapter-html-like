import { transformFiles } from './adapter.js';
import parent from '@sveltejs/adapter-static'

/** @type {import('.').default} */
export default function (options) {

	return {
		name: 'sveltekit-adapter-html-like',

		async adapt(builder) {
			await parent(options).adapt(builder)

			transformFiles(builder, options);
		}
	};
}
