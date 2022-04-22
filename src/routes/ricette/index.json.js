import { recipes } from '$lib/recipes';

export async function get() {
  var headers = new Headers({
    'Content-Type': 'application/json'
  });

  return {
    status: 200,
    headers: headers,
    body: JSON.stringify(recipes)
  };
}