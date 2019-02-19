/**
 * Retrive all values in localStorage
 *
 * @returns key-value pairs
 */
export const load = () => {
  const props: { [key: string]: string } = {};
  for (let i = 0; i < localStorage.length; i = i + 1) {
    const key = localStorage.key(i);
    if (key) {
      props[key] = localStorage.getItem(key) || '';
    }
  }
  return props;
};

/**
 * Store key-value pairs into localStorage
 *
 * @param settings
 */
export const set = (settings: { [key: string]: string }) => {
  Object.keys(settings).forEach(key => {
    localStorage.setItem(key, settings[key].toString());
  });
};

export default { load, set };
