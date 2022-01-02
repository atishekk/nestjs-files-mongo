export const toPromise = <T>(value: T): Promise<T> => {
  return new Promise((resolve) => {
    return resolve(value);
  });
};
