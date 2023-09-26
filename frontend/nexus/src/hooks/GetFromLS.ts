const GetFromLS = (
  key: string,
  defaultValue: string | null = null
): string | null => {
  if (defaultValue !== null) {
    const localValue = localStorage.getItem(key);

    if (localValue === null) {
      localStorage.setItem(key, JSON.stringify(defaultValue));
      return defaultValue;
    } else {
      return JSON.parse(localValue);
    }
  }

  const localValue = localStorage.getItem(key);

  if (localValue !== null) {
    return JSON.parse(localValue);
  }
  return null;
};

export default GetFromLS;
