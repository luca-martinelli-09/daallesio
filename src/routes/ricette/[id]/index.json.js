import posts from '$lib/recipes';

export async function get({ params }) {
  const { id } = params;

  const post = posts.find((p) => {
    return p.id.toLowerCase() === id.toLowerCase();
  });

  return {
    status: 200,
    body: JSON.stringify(post)
  };
}