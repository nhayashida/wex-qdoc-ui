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
  const res = await fetch('/wex/query', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
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
  const res = await fetch('/wex/collections');

  const data = await res.json();
  if (!res.ok) {
    throw data.error;
  }
  return data.collections;
};

export default { query, listCollections };
