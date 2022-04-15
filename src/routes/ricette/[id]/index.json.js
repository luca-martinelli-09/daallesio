import recipes from '$lib/recipes';

export async function get({ params }) {
  const { id } = params;

  const recipe = recipes.find((p) => {
    return p.id.toLowerCase() === id.toLowerCase();
  });

  var headers = new Headers({
    'Content-Type': 'application/json'
  });

  return {
    status: 200,
    headers: headers,
    body: JSON.stringify(recipe)
  };
}