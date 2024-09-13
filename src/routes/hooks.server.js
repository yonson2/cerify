export function handleError({ error }) {
  console.error(error.stack);

  return {
    message: 'everything is fine',
    code: 'JEREMYBEARIMY'
  };
}
