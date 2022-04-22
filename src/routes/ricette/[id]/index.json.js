import { recipes } from '$lib/recipes';

export async function get({ params }) {
  const { id } = params;

  const recipe = recipes[id];

  var headers = new Headers({
    'Content-Type': 'application/json'
  });

  if (recipe) {
    return {
      status: 200,
      headers: headers,
      body: JSON.stringify(recipe)
    };
  }

  return {
    status: 404,
    headers: headers,
    body: JSON.stringify({ message: 'Recipe not found' })
  };
}