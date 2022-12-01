import { fetchRecipes } from '$lib/utils'
import { json } from '@sveltejs/kit'

export const GET = async () => {
  const allRecipes = await fetchRecipes();

  return json(allRecipes)
}