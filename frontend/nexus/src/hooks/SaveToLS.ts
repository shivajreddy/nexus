import { GetFromLS } from "@hooks/index";

const SaveToLS = (key: string, value: object | string, override: boolean = true): [string, string] | undefined => {

  const existingLocalvalue = GetFromLS(key);

  const newLocalValue = JSON.stringify(value);

  if (existingLocalvalue !== null && !override) {
    return undefined;
  }
  localStorage.setItem(key, newLocalValue);
  return undefined;
}

export default SaveToLS
