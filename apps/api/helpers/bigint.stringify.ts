export const bigintStringify = (param: any): any => {
  return JSON.stringify(
    param,
    (key, value) => (typeof value === 'bigint' ? value.toString() : value), // return everything else unchanged
  );
};
