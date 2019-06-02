/**
 * Query a collection
 *
 * @param collectionId
 * @param bodyField
 * @param input
 */
export const query = async (
  collectionId: string,
  bodyField: string,
  input: QueryInput,
): Promise<QueryResult> => {
  const { text, page, count } = input;
  const res = await fetch('/explorer/query', {
    headers: { 'Content-Type': 'application/json' },
    method: 'POST',
    body: JSON.stringify({
      collectionId,
      bodyField,
      text,
      start: page * count,
      rows: count,
    }),
  });

  const data = await res.json();
  if (!res.ok) {
    throw data.error;
  }
  return data;
};

/**
 * List collections
 */
export const listCollections = async (): Promise<Collection[]> => {
  const res = await fetch('/explorer/collections');

  const data = await res.json();
  if (!res.ok) {
    throw data.error;
  }
  return data;
};

export default { query, listCollections };
