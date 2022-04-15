const allRecipes = import.meta.globEager('./recipes/*.md');
const allIngredients = import.meta.globEager('./ingredients/*.md');

const ingredients = [];
for (const path in allIngredients) {
  const ingredient = allIngredients[path];
  if (ingredient) {
    ingredients.push({ ...ingredient.metadata });
  }
}

async function getIngredientNutritionalData(foodID) {
  const res = await fetch("https://api.nal.usda.gov/fdc/v1/food/" + foodID + "?api_key=DMbAaQsgKG7ZndAHkTfFFSfiVU5mlDtpMkSNchME");
  const data = await res.json();

  return data;
}

const recipes = [];
for (const path in allRecipes) {
  const recipe = allRecipes[path];
  if (recipe) {
    const recipeIngredients = recipe.metadata.ingredients;
    for (const i in recipeIngredients) {
      const ingredient = recipeIngredients[i];
      const ingredientInfo = ingredients.filter((ing) => { return ing.id === ingredient.id; });

      if (ingredientInfo.length > 0)
        recipeIngredients[i] = {
          ...ingredient,
          ...ingredientInfo[0]
        };
    }

    getIngredientNutritionalData(171893).then((res) => {
      console.log(res);
    });

    recipes.push({
      ...recipe.metadata,
      ...recipe.default.render(),
      ingredients: recipeIngredients,
    });
  }
}

const filteredRecipes = recipes
  .filter((recipe) => !recipe.hidden)
  .sort((a, b) =>
    new Date(a.date).getTime() > new Date(b.date).getTime()
      ? -1
      : new Date(a.date).getTime() < new Date(b.date).getTime()
        ? 1
        : 0
  )


export default filteredRecipes;