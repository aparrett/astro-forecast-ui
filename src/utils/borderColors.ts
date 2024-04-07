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

export const getWindSpeedColor = (s: number) => {
  if (s < 9) {
    return 'black';
  } else if (s < 18) {
    return 'medium-gray';
  } else {
    return 'white';
  }
};

export const getTemperatureColor = (t: number) => {
  if (t < 25) {
    return 'blue';
  } else if (t < 45) {
    return 'light-blue';
  } else if (t < 55) {
    return 'light-yellow';
  } else if (t < 76) {
    return 'orange';
  } else if (t < 90) {
    return 'red';
  } else {
    return 'dark-red';
  }
};

export const getPrecipitationColor = (p: number) => {
  if (p < 9) {
    return 'black';
  } else if (p < 25) {
    return 'light-green';
    // } else if (p < 51) {
    //   return 'green'
  } else if (p < 76) {
    return 'medium-green';
  } else {
    return 'dark-green';
  }
};
