import.meta.env.VITE_ENV;

const local = {
  ASTRO_WS_URL: 'http://localhost:3000/local',
};

const production = {
  ASTRO_WS_URL: 'https://9z846rjdn0.execute-api.us-east-1.amazonaws.com/prod/',
};

export const config = import.meta.env.VITE_ENV === 'production' ? production : local;
