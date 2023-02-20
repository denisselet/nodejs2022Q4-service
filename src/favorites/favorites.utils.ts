export const arrayIds = (array: any[], attribute: string) => {
  return array
    .map((favorite) => favorite[attribute])
    .filter((item) => item !== null);
};
