import recipes from '$lib/recipes';

export async function get() {
  const allRecipes = Object.keys(recipes).map((id) => ({
    id,
    ...recipes[id],
  }));

  var headers = new Headers({
    'Content-Type': 'application/json'
  });

  return {
    status: 200,
    headers: headers,
    body: JSON.stringify(allRecipes)
  };
}