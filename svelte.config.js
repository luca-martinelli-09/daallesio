import preprocess from 'svelte-preprocess';
import adapter from '@sveltejs/adapter-static';
import { mdsvex } from 'mdsvex';
import rehypeExternalLinks from 'rehype-external-links';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import accessibleEmojis from 'rehype-accessible-emojis';
import { imagetools } from 'vite-imagetools';

const extensions = ['.svelte', '.md'];

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: [
		preprocess({
			preserve: ['module']
		}),
		mdsvex({
			layout: {
				recipe: './src/lib/layouts/recipe-layout.svelte',
				ingredient: './src/lib/layouts/ingredient-layout.svelte'
			},
			extensions: extensions,
			rehypePlugins: [
				rehypeExternalLinks,
				rehypeSlug,
				accessibleEmojis,
				[rehypeAutolinkHeadings, {
					behavior: 'append',
					content: {
						type: 'element',
						tagName: 'span',
						properties: { className: ['heading-link'] },
						children: [{ type: 'text', value: '#' }]
					}
				}]
			]
		})
	],
	extensions: extensions,

	kit: {
		adapter: adapter(),
		prerender: {
			default: true
		},
		trailingSlash: 'never',
		vite: {
			plugins: [imagetools()]
		}
	}
};

export default config;