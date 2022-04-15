import ingredients from '$lib/ingredients';

export async function get({ params }) {
  const { id } = params;

  const ingredient = ingredients.find((p) => {
    return p.id.toLowerCase() === id.toLowerCase();
  });

  return {
    status: 200,
    head: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(ingredient)
  };
}