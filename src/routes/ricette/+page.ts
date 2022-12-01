import type { Recipe } from '$lib/utils/d';

export const load = async ({ fetch }: any) => {
	const response = await fetch('/api/ricette');
	const recipes = <Recipe[]>await response.json();

	return { recipes };
};
