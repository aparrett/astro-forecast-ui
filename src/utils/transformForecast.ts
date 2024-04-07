import { ForecastGridResponse, ForecastValue, GetForecastResponse } from 'astro-ws-types';

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
}

export const expand = (values: ForecastValue[]) => {
  const result: number[] = [];
  values.forEach((v) => {
    const length = Number(v.validTime.split('/')[1].split('PT')[1].split('H')[0]);
    for (let i = 0; i < length; i++) {
      result.push(v.value);
    }
  });
  return result;
};

/** Expands time windows given by the NWS API and trims past data */
export const transformForecast = (forecast: GetForecastResponse): TransformedForecast => ({
  updateTime: forecast.updateTime,
  elevation: forecast.elevation,
  temperature: expand(forecast.temperature),
  dewpoint: expand(forecast.dewpoint),
  relativeHumidity: expand(forecast.relativeHumidity),
  windChill: expand(forecast.windChill),
  skyCover: expand(forecast.skyCover),
  windDirection: expand(forecast.windDirection),
  windSpeed: expand(forecast.windSpeed),
  windGust: expand(forecast.windGust),
  probabilityOfPrecipitation: expand(forecast.probabilityOfPrecipitation),
});
