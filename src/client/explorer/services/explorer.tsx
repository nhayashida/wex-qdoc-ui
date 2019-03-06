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
  input: Explorer.QueryInput,
): Promise<Explorer.QueryResult> => {
  try {
    const { text, page, count } = input;
    const res = await fetch('/explorer/query', {
      headers: { 'Content-Type': 'application/json' },
      method: 'POST',
      body: JSON.stringify({
        collectionId,
        bodyField,
        text,
        options: {
          start: page * count,
          rows: count,
        },
      }),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message);
    }
    return data;
  } catch (err) {
    throw err;
  }
};

/**
 * List collections
 */
export const listCollections = async (): Promise<Explorer.Collection[]> => {
  try {
    const res = await fetch('/explorer/collections');
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message);
    }
    return data;
  } catch (err) {
    throw err;
  }
};

export default { query, listCollections };