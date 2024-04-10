import { QueryObserverResult, useQuery } from '@tanstack/react-query';
import { config } from '../config';
import ky from 'ky';
import { GetForecastResponse } from 'astro-ws-types';
import { TransformedForecast, transformForecast } from '../utils/transformForecast';

export const useGetForecast = (
  lat?: number,
  long?: number,
  units?: string
): QueryObserverResult<TransformedForecast, unknown> => {
  const getForecast = async () => {
    try {
      const f = await ky
        .get(`${config.ASTRO_WS_URL}forecast?lat=${lat}&long=${long}&units=${units || ''}`, { retry: 0 })
        .json<GetForecastResponse>();

      return transformForecast(f);
    } catch (e) {
      console.log(e);
      throw e;
    }
  };
  return useQuery({
    queryKey: ['useGetForecast', lat, long, units],
    queryFn: () => getForecast(),
    enabled: !!lat && !!long,
  });
};
