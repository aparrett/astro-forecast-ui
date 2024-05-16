import { GetSolarDetailsResponse } from 'astro-ws-types';
import dayjs, { Dayjs } from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { CELL_WIDTH } from './constants';

dayjs.extend(utc);

export const getSolarDetailsForHour = (
  now: Dayjs,
  offset: number,
  solarDetails: GetSolarDetailsResponse[]
): SolarDetailsForHourFull | SolarDetailsForHourSlim | null => {
  const columnHour = now.add(offset, 'hours');
  const daysAfterToday = columnHour.startOf('day').diff(now.startOf('day'), 'days');
  const daySolarDetails = solarDetails[daysAfterToday];

  if (!daySolarDetails) return null;

  const columnHourStart = columnHour.startOf('hour');
  const columnHourEnd = columnHour.endOf('hour');

  const astronomicalTwilightBegin = dayjs.utc(daySolarDetails.astronomicalTwilightBegin).local();
  const astronomicalTwilightEnd = dayjs.utc(daySolarDetails.astronomicalTwilightEnd).local();
  const nauticalTwilightBegin = dayjs.utc(daySolarDetails.nauticalTwilightBegin).local();
  const nauticalTwilightEnd = dayjs.utc(daySolarDetails.nauticalTwilightEnd).local();
  const sunrise = dayjs.utc(daySolarDetails.sunrise).local();
  const sunset = dayjs.utc(daySolarDetails.sunset).local();

  const isDuringTotalDarkness =
    columnHourEnd.isBefore(astronomicalTwilightBegin) || columnHourStart.isAfter(astronomicalTwilightEnd);
  const isDuringSunup = columnHourStart.isAfter(sunrise) && columnHourEnd.isBefore(sunset);

  if (isDuringTotalDarkness || isDuringSunup) {
    return { isDuringSunup, isDuringTotalDarkness };
  }

  const hourContains = (time: Dayjs) => time.isAfter(columnHourStart) && time.isBefore(columnHourEnd);

  const isMorning = columnHourStart.isBefore(sunrise);
  if (isMorning) {
    const containsTotalDarkness = hourContains(astronomicalTwilightBegin);
    const containsAstroTwilight =
      hourContains(astronomicalTwilightBegin) ||
      (columnHourStart.isAfter(astronomicalTwilightBegin) && columnHourStart.isBefore(nauticalTwilightBegin));
    const containsNautTwilight =
      hourContains(nauticalTwilightBegin) ||
      (columnHourStart.isAfter(nauticalTwilightBegin) && columnHourStart.isBefore(sunrise));
    const containsSunrise = hourContains(sunrise);

    const totalDarknessMinutes = containsTotalDarkness
      ? Math.abs(columnHourStart.diff(astronomicalTwilightBegin, 'minutes'))
      : 0;
    let astroMinutes = 0;
    if (containsAstroTwilight) {
      // if astro twilight starts within the hour
      if (columnHourStart.isBefore(astronomicalTwilightBegin)) {
        if (containsNautTwilight) {
          astroMinutes = Math.abs(astronomicalTwilightBegin.diff(nauticalTwilightBegin, 'minutes'));
        } else {
          astroMinutes = Math.abs(columnHourEnd.diff(astronomicalTwilightBegin, 'minutes'));
        }
      } else if (containsNautTwilight) {
        astroMinutes = Math.abs(columnHourStart.diff(nauticalTwilightBegin, 'minutes'));
      } else {
        astroMinutes = 60;
      }
    }
    let nautMinutes = 0;
    if (containsNautTwilight) {
      // If naut twilight starts within the hour
      if (columnHourStart.isBefore(nauticalTwilightBegin)) {
        if (containsSunrise) {
          nautMinutes = Math.abs(sunrise.diff(nauticalTwilightBegin, 'minutes'));
        } else {
          nautMinutes = Math.abs(nauticalTwilightBegin.diff(columnHourEnd, 'minutes'));
        }
      } else if (containsSunrise) {
        nautMinutes = Math.abs(columnHourStart.diff(sunrise, 'minutes'));
      } else {
        nautMinutes = 60;
      }
    }
    const sunriseMinutes = containsSunrise ? Math.abs(columnHourEnd.diff(sunrise, 'minutes')) : 0;

    const totalDarkWidth = Math.round((CELL_WIDTH * totalDarknessMinutes) / 60);
    const astroWidth = Math.round((CELL_WIDTH * astroMinutes) / 60);
    const nautWidth = Math.round((CELL_WIDTH * nautMinutes) / 60);
    const sunupWidth = Math.round((CELL_WIDTH * sunriseMinutes) / 60);
    // since we are using percentages of pixels, we round and add a pixel to ensure there are no missing pixels, the data looks correct, and
    // the length of the row is equal to the others
    const missingPixelWidth = CELL_WIDTH - totalDarkWidth - astroWidth - nautWidth - sunupWidth;
    const missingPixelColor = containsSunrise ? 'light-blue' : containsNautTwilight ? 'blue' : 'dark-blue';

    return {
      isMorning,
      totalDarkWidth,
      astroWidth,
      nautWidth,
      sunupWidth,
      missingPixelWidth,
      missingPixelColor,
    };
  }

  const containsSunset = hourContains(sunset);
  const containsNautTwilight =
    hourContains(sunset) || (columnHourStart.isAfter(sunset) && columnHourStart.isBefore(nauticalTwilightEnd));
  const containsAstroTwilight =
    hourContains(nauticalTwilightEnd) ||
    (columnHourStart.isAfter(nauticalTwilightEnd) && columnHourStart.isBefore(astronomicalTwilightEnd));
  const containsTotalDarkness = hourContains(astronomicalTwilightEnd);

  const sunsetMinutes = containsSunset ? Math.abs(columnHourStart.diff(sunset, 'minutes')) : 0;
  let nautMinutes = 0;
  // time between sunset and nautTwilightEnd
  if (containsNautTwilight) {
    // if nautTwilight ends within the hour
    if (nauticalTwilightEnd.isBefore(columnHourEnd)) {
      if (containsSunset) {
        nautMinutes = Math.abs(sunset.diff(nauticalTwilightEnd, 'minutes'));
      } else {
        nautMinutes = Math.abs(nauticalTwilightEnd.diff(columnHourStart, 'minutes'));
      }
    } else if (containsSunset) {
      nautMinutes = Math.abs(columnHourEnd.diff(sunset, 'minutes'));
    } else {
      nautMinutes = 60;
    }
  }
  let astroMinutes = 0;
  // Time between nautTwilightEnd and astroTwilightEnd
  if (containsAstroTwilight) {
    // if astro twilight ends within the hour
    if (astronomicalTwilightEnd.isBefore(columnHourEnd)) {
      if (containsNautTwilight) {
        astroMinutes = Math.abs(astronomicalTwilightEnd.diff(nauticalTwilightEnd, 'minutes'));
      } else {
        astroMinutes = Math.abs(columnHourStart.diff(astronomicalTwilightEnd, 'minutes'));
      }
    } else if (containsNautTwilight) {
      astroMinutes = Math.abs(columnHourEnd.diff(nauticalTwilightEnd, 'minutes'));
    } else {
      astroMinutes = 60;
    }
  }
  const totalDarknessMinutes = containsTotalDarkness
    ? Math.abs(columnHourEnd.diff(astronomicalTwilightEnd, 'minutes'))
    : 0;
  const sunupWidth = Math.round((CELL_WIDTH * sunsetMinutes) / 60);
  const nautWidth = Math.round((CELL_WIDTH * nautMinutes) / 60);
  const astroWidth = Math.round((CELL_WIDTH * astroMinutes) / 60);
  const totalDarkWidth = Math.round((CELL_WIDTH * totalDarknessMinutes) / 60);

  // since we are using percentages of pixels, we round and add a pixel to ensure there are no missing pixels, the data looks correct, and
  // the length of the row is equal to the others
  const missingPixelWidth = CELL_WIDTH - totalDarkWidth - astroWidth - nautWidth - sunupWidth;
  const missingPixelColor = containsTotalDarkness ? 'black' : containsAstroTwilight ? 'dark-blue' : 'blue';

  return {
    isMorning,
    totalDarkWidth,
    astroWidth,
    nautWidth,
    sunupWidth,
    missingPixelWidth,
    missingPixelColor,
  };
};
