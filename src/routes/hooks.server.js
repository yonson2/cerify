export function handleError({ event, error }) {
  console.log("AAAAAAAAAA");
  console.error(error.stack);

  return {
    message: 'everything is fine',
    code: 'JEREMYBEARIMY'
  };
}
