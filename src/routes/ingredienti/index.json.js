import ingredients from '$lib/ingredients';

export async function get() {
  const allIngredients = Object.keys(ingredients).map((id) => ({
    id,
    ...ingredients[id],
  }));

  var headers = new Headers({
    'Content-Type': 'application/json'
  });

  return {
    status: 200,
    headers: headers,
    body: JSON.stringify(allIngredients)
  };
}