export const validApiKey = (key: string): boolean => {
  return (
    key.match(
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/
    ) !== null
  );
};
