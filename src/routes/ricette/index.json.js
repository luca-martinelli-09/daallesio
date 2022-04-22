import { recipes } from '$lib/recipes';

export async function get() {
  var headers = new Headers({
    'Content-Type': 'application/json'
  });

  const smallRecipes = [];
  for (const i in recipes) {
    const recipe = recipes[i];

    delete recipe.ingredients;
    delete recipe.html;
    delete recipe.css;
    delete recipe.head;

    smallRecipes.push({
      ...recipe
    })
  }

  return {
    status: 200,
    headers: headers,
    body: JSON.stringify(smallRecipes)
  };
}