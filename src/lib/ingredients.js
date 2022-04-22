const allIngredients = import.meta.globEager('./ingredients/*.md');

const ingredients = {};
for (const path in allIngredients) {
  const ingredient = allIngredients[path];
  if (ingredient) {
    ingredients[ingredient.metadata.id] = {
      ...ingredient.metadata,
      ...ingredient.default.render()
    };
  }
}

export default ingredients;