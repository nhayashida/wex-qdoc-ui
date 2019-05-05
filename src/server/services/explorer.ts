import { forIn, isArray, pick } from 'lodash';
import rp, { RequestPromise } from 'request-promise';
import logger from '../utils/logger';

/**
 * Send a http request
 *
 * @param path
 * @param options
 * @returns promise
 */
const request = (path: string, options?: { method: string; body?: {} }): RequestPromise => {
  return rp(
    Object.assign({}, options, {
      uri: `${process.env.WEX_ORIGIN}/${path}`,
      auth: {
        user: process.env.WEX_USERNAME,
        password: process.env.WEX_PASSWORD,
      },
      json: true,
      rejectUnauthorized: false,
    }),
  );
};

/**
 * Query similar documents in a collection
 *
 * @param collectionId
 * @param bodyField
 * @param text
 * @param options
 */
export const query = async (
  collectionId: string,
  bodyField: string,
  text: string,
  options?: { [key: string]: string },
): Promise<QueryResult> => {
  logger.debug(Object.assign({ collectionId, bodyField, text }, options));

  const path = `/api/v1/explore/${collectionId}/query`;
  const props = Object.assign(
    {
      fl: 'score, *',
      rq: '{!sss}',
      qdoc: `{ "fields": { "${bodyField}": "${text}" } }`,
    },
    options,
  );
  const params = Object.keys(props)
    .map(key => `&${key}=${encodeURIComponent(props[key])}`)
    .join('');

  const res = await request(`${path}?q=*${params}`);
  if (!res.response) {
    throw { message: res };
  }

  const result: QueryResult = {
    numFound: res.response.numFound,
    docs: [],
  };
  if (res.response.docs) {
    result.docs = res.response.docs.map(doc => {
      const obj = {
        id: doc.id,
        score: doc.score,
        fields: {},
      };
      forIn(doc, (value, key) => {
        if (!['id', 'score'].includes(key)) {
          obj.fields[key] = isArray(value) ? value.join(', ') : value;
        }
      });
      return obj;
    });
  }

  return result;
};

/**
 * List collections
 */
export const listCollections = async (): Promise<Collection[]> => {
  const res = await request('/api/v1/collections');
  logger.trace(res);

  return res.items.map(item => {
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
