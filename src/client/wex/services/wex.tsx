import { Collection, QueryResult } from '../reducers/wex/types';

/**
 * List collections
 *
 * @returns collections
 */
export const listCollections = async (): Promise<Collection[]> => {
  const res = await fetch('/wex/collections');

  const data = await res.json();
  if (!res.ok) {
    throw data.error;
  }
  return data.collections;
};

/**
 * Query a collection
 *
 * @param payload
 * @returns docs
 */
export const query = async (payload: {
  collectionId: string;
  bodyFieldId: string;
  q: string;
  page?: number;
  count?: number;
}): Promise<QueryResult> => {
  const { collectionId, bodyFieldId, q, page, count } = payload;
  const urlParams = new URLSearchParams({
    bodyFieldId,
    q,
  });
  if (count) {
    urlParams.append('rows', count.toString());
    if (page) {
      urlParams.append('start', (page * count).toString());
    }
  }
  const res = await fetch(`/wex/collections/${collectionId}/query?${urlParams}`);

  const data = await res.json();
  if (!res.ok) {
    throw data.error;
  }
  return data;
};

export default { listCollections, query };
