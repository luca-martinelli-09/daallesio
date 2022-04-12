import posts from '$lib/recipes';

export async function get() {
  const body = Object.keys(posts).map((id) => ({
    id,
    ...posts[id],
  }));

  return {
    status: 200,
    body: JSON.stringify(body)
  };
}