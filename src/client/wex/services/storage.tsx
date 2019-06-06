import { fromPairs } from 'lodash';
import localforage from 'localforage';

/**
 * Retrive all key-value pairs in indexed db
 *
 * @returns key-value pairs
 */
export const load = async () => {
  const keys = await localforage.keys();
  return fromPairs(
    await Promise.all(
      keys.map(async key => {
        const value = await localforage.getItem(key);
        return [key, value];
      }),
    ),
  );
};

/**
 * Store key-value pairs into indexed db
 *
 * @param settings
 */
export const set = (settings: { [key: string]: string }) => {
  Object.keys(settings).forEach(key => {
    localforage.setItem(key, settings[key].toString());
  });
};

export default { load, set };
