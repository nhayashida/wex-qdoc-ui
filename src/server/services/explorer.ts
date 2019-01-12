import { forIn, isArray, pick, zip } from 'lodash';
import rp, { RequestPromise } from 'request-promise';
import logger from '../utils/logger';

export type Document = {
  id: string;
  fields: { [key: string]: string };
  score?: number;
};

export type QueryResult = {
  numFound: number;
  docs?: Document[];
};

export type Collection = {
  id: string;
  name: string;
  fields: { id: string; label: string }[];
};

namespace Explorer {
  /**
   * Send a http request
   *
   * @param method
   * @param path
   * @param body
   * @returns promise
   */
  const request = (method: string, path: string, body?: {}): RequestPromise => {
    const options = {
      method,
      body,
      uri: `${process.env.WEX_ORIGIN}/${path}`,
      auth: {
        user: process.env.WEX_USERNAME,
        password: process.env.WEX_PASSWORD,
      },
      json: true,
      rejectUnauthorized: false,
    };
    return rp(options);
  };

  /**
   * Query a collection to find similar documents
   *
   * @param collectionId
   * @param bodyField
   * @param q
   * @param options
   */
  export const query = async (
    collectionId: string,
    bodyField: string,
    q: string,
    options?: { [key: string]: string },
  ): Promise<QueryResult> => {
    logger.debug(Object.assign({ collectionId, bodyField, q }, options));

    const path = `/api/v1/explore/${collectionId}/query`;
    const props = Object.assign(
      {
        fl: 'score, *',
        rq: '{!sss}',
        qdoc: `{ "fields": { "${bodyField}": "${q}" } }`,
      },
      options,
    );
    const params = Object.keys(props)
      .map(key => `&${key}=${encodeURIComponent(props[key])}`)
      .join('');

    const res = await request('GET', `${path}?q=*${params}`);
    logger.trace(res);

    const result: QueryResult = {
      numFound: res.response.numFound,
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

  export const listCollections = async (): Promise<Collection[]> => {
    const res = await request('GET', '/api/v1/collections');
    logger.trace(res);

    return res.items.map(item => {
      const { id, name, datasets } = item;
      return {
        id,
        name,
        fields: (item.fields[datasets[0]] as { [key: string]: string }[]).map(field =>
          pick(field, ['id', 'label']),
        ),
      };
    });
  };
}

export default Explorer;
