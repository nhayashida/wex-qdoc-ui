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
 * List collections
 *
 * @returns collections
 */
export const listCollections = async () => {
  const { items } = await request('/api/v1/collections');

  return items.map(item => {
    const { id, name, tags, fields, datasets } = item;
    return {
      id,
      name,
      bodyFieldId: tags.defaultBodyFieldId,
      fields: (fields[datasets[0]] as { [key: string]: string }[]).map(field =>
        pick(field, ['id', 'label']),
      ),
    };
  });
};

/**
 * Query similar documents in a collection
 *
 * @param payload
 * @returns result
 */
export const query = async (payload: {
  collectionId: string;
  bodyFieldId: string;
  q: string;
  start?: number;
  rows?: number;
}) => {
  logger.debug(payload);

  const { collectionId, bodyFieldId, q, ...rest } = payload;
  const urlParams = new URLSearchParams(
    Object.assign(
      {
        q: '*',
        fl: 'score, *',
        rq: '{!sss}',
        qdoc: `{ "fields": { "${bodyFieldId}": "${q}" } }`,
      },
      rest,
    ),
  );
  const res = await request(`/api/v1/explore/${collectionId}/query?${urlParams}`);
  if (!res.response) {
    throw { message: res };
  }

  const { response } = res;
  const result = {
    numFound: response.numFound,
    docs: [],
  };
  if (response.docs) {
    result.docs = response.docs.map(doc => {
      const { id, score, ...rest } = doc;
      const fields = Object.fromEntries(
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

export default { listCollections, query };
