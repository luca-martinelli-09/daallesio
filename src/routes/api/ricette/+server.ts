import { fetchRecipes } from '$lib/utils';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ url }) => {
	const allRecipes = await fetchRecipes(url);

	return json(allRecipes);
};
