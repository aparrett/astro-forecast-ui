import { ForecastGridResponse, ForecastValue, GetForecastResponse } from 'astro-ws-types';
import dayjs from 'dayjs';

export interface TransformedForecast {
  updateTime: string;
  elevation: ForecastGridResponse['properties']['elevation'];
  temperature: number[];
  dewpoint: number[];
  relativeHumidity: number[];
  windChill: number[];
  skyCover: number[];
  windDirection: number[];
  windSpeed: number[];
  windGust: number[];
  probabilityOfPrecipitation: number[];
  // if new datasets are added, must update dataSets below
}

export const dataSets: (keyof TransformedForecast)[] = [
  'temperature',
  'dewpoint',
  'relativeHumidity',
  'windChill',
  'skyCover',
  'windDirection',
  'windSpeed',
  'windGust',
  'probabilityOfPrecipitation',
];

/** Duplicates values depending on the duration given by the NWS. Also removes the durations after expanding. */
export const expand = (values: ForecastValue[]) => {
  const result: ForecastValue[] = [];
  values.forEach((v) => {
    const duration = v.validTime.split('/')[1]; // P1DT12H or PT14H format
    const length =
      duration.includes('D') && duration.includes('H')
        ? Number(duration[1]) * 24 + Number(duration.split('T')[1].split('H')[0])
        : duration.includes('D')
        ? Number(duration[1]) * 24
        : Number(duration.split('T')[1].split('H')[0]);
    for (let i = 0; i < length; i++) {
      result.push({ value: v.value, validTime: dayjs(v.validTime.split('/')[0]).add(i, 'hour').toISOString() });
    }
  });
  return result;
};

/** Removes any data from the past and returns the raw data */
export const removePast = (values: ForecastValue[]) => {
  const result: number[] = [];
  values.forEach((v) => {
    if (!dayjs(v.validTime.split('/')[0]).isBefore(dayjs().startOf('hour'))) {
      result.push(v.value);
    }
  });
  return result;
};

/** Expands time windows given by the NWS API and trims past data */
export const transformForecast = (forecast: GetForecastResponse): TransformedForecast => {
  const expanded = {
    temperature: removePast(expand(forecast.temperature)),
    dewpoint: removePast(expand(forecast.dewpoint)),
    relativeHumidity: removePast(expand(forecast.relativeHumidity)),
    windChill: removePast(expand(forecast.windChill)),
    skyCover: removePast(expand(forecast.skyCover)),
    windDirection: removePast(expand(forecast.windDirection)),
    windSpeed: removePast(expand(forecast.windSpeed)),
    windGust: removePast(expand(forecast.windGust)),
    probabilityOfPrecipitation: removePast(expand(forecast.probabilityOfPrecipitation)).filter(
      (_, i, a) => i < a.length - 5
    ),
  } as TransformedForecast;
  const minHours = getMinHours(expanded);

  // Slicing the datasets is necessary because the NWS randomly gives a few more hours worth of data for certain datasets.
  return {
    updateTime: forecast.updateTime,
    elevation: forecast.elevation,
    temperature: expanded.temperature.slice(0, minHours),
    dewpoint: expanded.dewpoint.slice(0, minHours),
    relativeHumidity: expanded.relativeHumidity.slice(0, minHours),
    windChill: expanded.windChill.slice(0, minHours),
    skyCover: expanded.skyCover.slice(0, minHours),
    windDirection: expanded.windDirection.slice(0, minHours),
    windSpeed: expanded.windSpeed.slice(0, minHours),
    windGust: expanded.windGust.slice(0, minHours),
    probabilityOfPrecipitation: expanded.probabilityOfPrecipitation.slice(0, minHours),
  };
};

/**
 * Gets the minimum number of hours that we have data for for any given dataset.
 */
export const getMinHours = (forecast: TransformedForecast) => {
  return Math.min(...dataSets.map((d) => (forecast[d] as number[]).length));
};
