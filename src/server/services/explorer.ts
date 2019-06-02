import fromPairs from 'lodash/fromPairs';
import isArray from 'lodash/isArray';
import pick from 'lodash/pick';
import rp, { RequestPromise } from 'request-promise';
import logger from '../utils/logger';

/**
 * Send a http request
 *
 * @param path
 * @returns promise
 */
const request = (path: string): RequestPromise =>
  rp({
    uri: `${process.env.WEX_ORIGIN}/${path}`,
    auth: {
      user: process.env.WEX_USERNAME,
      password: process.env.WEX_PASSWORD,
    },
    json: true,
    rejectUnauthorized: false,
  });

/**
 * Query similar documents in a collection
 *
 * @param payload
 * @returns result
 */
export const query = async (payload: {
  collectionId: string;
  bodyField: string;
  text: string;
  start?: number;
  rows?: number;
}): Promise<QueryResult> => {
  logger.debug(payload);

  const { collectionId, bodyField, text, ...rest } = payload;
  const urlParams = new URLSearchParams(
    Object.assign(
      {
        q: '*',
        fl: 'score, *',
        rq: '{!sss}',
        qdoc: `{ "fields": { "${bodyField}": "${text}" } }`,
      },
      rest,
    ),
  );
  const res = await request(`/api/v1/explore/${collectionId}/query?${urlParams}`);
  if (!res.response) {
    throw { message: res };
  }

  const { response } = res;
  const result: QueryResult = {
    numFound: response.numFound,
    docs: [] as ResultDocument[],
  };
  if (response.docs) {
    result.docs = response.docs.map((doc: ResultDocument) => {
      const { id, score, ...rest } = doc;
      const fields = fromPairs(
        Object.keys(rest).map(key => {
          const value = rest[key];
          return [key, isArray(value) ? value.join(', ') : value];
        }),
      );
      return { id, score, fields };
    });
  }

  return result;
};

/**
 * List collections
 *
 * @returns collections
 */
export const listCollections = async (): Promise<Collection[]> => {
  const { items } = await request('/api/v1/collections');

  return items.map(item => {
    const { id, name, fields, datasets } = item;
    return {
      id,
      name,
      fields: (fields[datasets[0]] as { [key: string]: string }[]).map(field =>
        pick(field, ['id', 'label']),
      ),
    };
  });
};

export default { query, listCollections };
