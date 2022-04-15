import ingredients from '$lib/ingredients';

export async function get() {
  const body = Object.keys(ingredients).map((id) => ({
    id,
    ...ingredients[id],
  }));

  return {
    status: 200,
    body: JSON.stringify(body)
  };
}