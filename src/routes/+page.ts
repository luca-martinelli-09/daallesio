import type { Recipe } from '$lib/utils/utils';

export const load = async ({ fetch }: any) => {
	const response = await fetch('/api/ricette');
	const recipes = <Recipe[]>await response.json();

	return { recipes };
};
