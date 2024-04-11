const latRegex = /^-?\d+(\.\d+)?[NS]?$/i;
const longRegex = /^-?\d+(\.\d+)?[EW]?$/i;

export const isValidLatitude = (s: string) => latRegex.test(s);
export const isValidLongitude = (s: string) => longRegex.test(s);

export const toLatitudeNum = (s: string) => {
  if (!isValidLatitude(s)) {
    throw 'Unexpected latitude given.';
  }
  if (!/[NS]/i.test(s)) {
    return Number(s);
  }
  const latitude = s.slice(0, s.length - 1);
  const direction = s[s.length - 1];
  if (direction === 'N') {
    return Math.abs(Number(latitude));
  } else {
    return -Math.abs(Number(latitude));
  }
};

export const toLongitudeNum = (s: string) => {
  if (!isValidLongitude(s)) {
    throw 'Unexpected latitude given.';
  }
  if (!/[EW]/i.test(s)) {
    return Number(s);
  }
  const longitude = s.slice(0, s.length - 1);
  const direction = s[s.length - 1];
  if (direction === 'E') {
    return Math.abs(Number(longitude));
  } else {
    return -Math.abs(Number(longitude));
  }
};
