export const getCloudColor = (p: number) => {
  if (p < 6) {
    return 'black';
  } else if (p < 15) {
    return 'dark-gray';
  } else if (p < 60) {
    return 'medium-gray';
  } else if (p < 85) {
    return 'light-gray';
  } else {
    return 'white';
  }
};
