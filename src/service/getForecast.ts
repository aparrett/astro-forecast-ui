import { QueryObserverResult, useQuery } from '@tanstack/react-query';
import { config } from '../config';
import ky from 'ky';

// TODO: share types
export const useGetForecast = (
  lat: string,
  long: string,
  units?: string
): QueryObserverResult<{ test: string }[], unknown> => {
  const getForecast = async () =>
    ky.get(`${config.ASTRO_WS_URL}forecast?lat=${lat}&long=${long}&units=${units || ''}`).json<{ test: string }[]>();
  return useQuery({
    queryKey: ['useGetForecast', lat, long, units],
    queryFn: () => getForecast(),
    enabled: !!lat && !!long,
  });
};
