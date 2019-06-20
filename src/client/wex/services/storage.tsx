import localforage from 'localforage';

/**
 * Retrive all key-value pairs in indexed db
 *
 * @returns key-value pairs
 */
export const load = async () => {
  const keys = await localforage.keys();
  return Object.fromEntries(
    await Promise.all(keys.map(async key => [key, await localforage.getItem(key)])),
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
