import { QueryObserverResult, useQuery } from '@tanstack/react-query';
import { config } from '../config';
import ky from 'ky';
import { GetSolarDetailsResponse } from 'astro-ws-types';
import dayjs from 'dayjs';

const getSolarDetails = async (lat: number, long: number, date: string) => {
  try {
    const res = await ky
      .get(`${config.ASTRO_WS_URL}solarDetails?lat=${lat}&long=${long}&date=${date}`, { retry: 0 })
      .json<GetSolarDetailsResponse>();

    return res;
  } catch (e) {
    console.log(e);
    throw e;
  }
};

export const useGetSolarDetails = (
  lat: number,
  long: number
): QueryObserverResult<GetSolarDetailsResponse[], unknown> => {
  const getAllSolarDetails = async () => {
    const requests = [];
    const today = dayjs();
    // Retrieve solar data for 8 days, including today.
    for (let i = 0; i < 8; i++) {
      const date = today.add(i, 'days').format('YYYY-MM-DD');
      requests.push(getSolarDetails(lat, long, date));
    }
    return await Promise.all(requests);
  };
  return useQuery({
    queryKey: ['useGetSolarDetails', lat, long],
    queryFn: () => getAllSolarDetails(),
    enabled: !!lat && !!long,
  });
};
