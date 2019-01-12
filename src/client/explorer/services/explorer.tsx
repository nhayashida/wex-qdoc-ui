import { Collection, QueryResult } from '../../../server/services/explorer';

namespace Explorer {
  /**
   * List collections
   */
  export const listCollections = async (): Promise<Collection[]> => {
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

  /**
   * Query a collection
   *
   * @param collectionId
   * @param bodyField
   * @param q
   */
  export const query = async (
    collectionId: string,
    bodyField: string,
    q: string,
  ): Promise<QueryResult> => {
    try {
      const res = await fetch('/explorer/query', {
        headers: { 'Content-Type': 'application/json' },
        method: 'POST',
        body: JSON.stringify({
          collectionId,
          bodyField,
          q,
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
}

export default Explorer;
