import { QueryObserverResult, useQuery } from '@tanstack/react-query';
import ky from 'ky';
import { config } from '../config';
import { AstroLocation } from '../types/Locations';

export const useGetLocations = (location: string): QueryObserverResult<AstroLocation[]> => {
  const getLocations = async () => {
    try {
      return await ky.get(`${config.ASTRO_WS_URL}locations?location=${location}`).json<AstroLocation[]>();
    } catch (e) {
      console.log(e);
      throw e;
    }
  };
  return useQuery({
    queryKey: ['useGetLocations', location],
    queryFn: () => getLocations(),
    enabled: !!location,
  });
};
