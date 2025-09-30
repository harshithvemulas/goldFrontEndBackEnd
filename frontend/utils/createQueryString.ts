type TQueryString = {
  [key: string]: string;
};

export const createQueryString = (rest: TQueryString): string => {
  const params = new URLSearchParams(window?.location?.search);
  for (const [name, value] of Object.entries(rest)) {
    params.set(name, value);
  }
  return params.toString();
};

export const removeQueryString = (name: string): string => {
  const params = new URLSearchParams(window?.location?.search);
  params.delete(name);
  return params.toString();
};
