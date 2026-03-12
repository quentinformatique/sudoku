export const serializeGrid = (grid: number[]) =>
  grid.map((value) => value.toString()).join('');

export const deserializeGrid = (value: string) =>
  value.split('').map((char) => Number(char));
