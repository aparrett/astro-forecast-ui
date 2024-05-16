import './ForecastTable.css';
import { useGetForecast } from '../../service/getForecast';
import { getCloudColor, getPrecipitationColor, getTemperatureColor, getWindSpeedColor } from '../../utils/borderColors';
import dayjs, { Dayjs } from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { AstroLocation } from '../../types/Locations';
import { useGetSolarDetails } from '../../service/getSolarDetails';
import { CELL_WIDTH } from '../../utils/constants';

dayjs.extend(utc);

interface ForecastTableProps {
  location: AstroLocation;
}

export const ForecastTable = ({ location: { coordinates } }: ForecastTableProps) => {
  const { data: forecast, isLoading: isForecastLoading } = useGetForecast(coordinates.latitude, coordinates.longitude);
  const { data: solarDetails, isLoading: isSolarDetailsLoading } = useGetSolarDetails(
    coordinates.latitude,
    coordinates.longitude
  );

  if (isForecastLoading || isSolarDetailsLoading) {
    // TODO
    return <></>;
  }
  if (!forecast || !solarDetails) {
    // TODO: beautify
    return <div style={{ marginTop: '12px' }}>Unable to retrieve forecast. Please try again.</div>;
  }

  const now = dayjs();
  const hoursLeftInDay = 24 - now.hour();
  const initialDayWidth = CELL_WIDTH * hoursLeftInDay;
  const totalHours = forecast.skyCover.length;
  const lastDayWidth = CELL_WIDTH * ((totalHours - hoursLeftInDay) % 24);
  const remainingDays = Math.ceil((totalHours - hoursLeftInDay) / 24);

  return (
    <div>
      <div className="forecast-table">
        <div className="y-headers">
          <div className="y-header" style={{ height: '46px' }}></div>
          <div className="y-header">S</div>
          <div className="y-header">
            <img src="/images/cloud.png" className="icon" alt="Created by kosonicon - Flaticon" />
          </div>
          <div className="y-header">
            <img src="/images/wind.png" className="icon" alt="Vitaly Gorbachev - Flaticon" />
          </div>
          <div className="y-header">
            <img src="/images/windStrong.png" className="icon" alt="Freepik - Flaticon" />
          </div>
          <div className="y-header">
            <img src="/images/windDirection.png" className="icon" alt="Only Srikanth - Flaticon" />
          </div>
          <div className="y-header">
            <img src="/images/thermometer.png" className="icon" alt="Freepik - Flaticon" />
          </div>
          <div className="y-header">
            <img src="/images/dew.png" className="icon" alt="Dew - me" />
          </div>
          <div className="y-header">
            <img src="/images/raindrop.png" className="icon" alt="Good Ware - Flaticon" />
          </div>
        </div>
        <div className="forecast-data">
          {/* Days of the week row */}
          <div className="row">
            {/* first day */}
            <div className="dow" style={{ width: initialDayWidth + 'px' }}>
              {/* only show abbreviation if there is enough room */}
              {hoursLeftInDay > 1 && now.format('ddd')}
              {hoursLeftInDay > 3 && ` - ${now.format('D')}`}
            </div>
            {new Array(remainingDays - 1).fill('x').map((_, i) => (
              <div key={i} className="dow">
                {now.add(i + 1, 'day').format('ddd')}
                {hoursLeftInDay > 3 && ` - ${now.add(i + 1, 'day').format('D')}`}
              </div>
            ))}
            {/* last day */}
            <div className="dow" style={{ width: lastDayWidth + 'px' }}>
              {/* only show abbreviation if there is enough room */}
              {lastDayWidth > 1 && now.add(remainingDays, 'day').format('ddd')}
              {lastDayWidth > 3 && ` - ${now.add(remainingDays, 'day').format('D')}`}
            </div>
          </div>

          {/* Time of day row */}
          <div className="row">
            {new Array(totalHours).fill('x').map((_, i) => {
              if (i < hoursLeftInDay) {
                if (hoursLeftInDay - i === 12) {
                  return (
                    <div className="cell tod" key={i}>
                      12
                    </div>
                  );
                } else {
                  return (
                    <div className="cell tod" key={i}>
                      {(24 - hoursLeftInDay + i) % 12}
                    </div>
                  );
                }
              } else {
                if ((i - hoursLeftInDay) % 24 === 12) {
                  return (
                    <div className="cell tod" key={i}>
                      12
                    </div>
                  );
                } else {
                  return (
                    <div className="cell tod" key={i}>
                      {(i - hoursLeftInDay) % 12}
                    </div>
                  );
                }
              }
            })}
          </div>

          {/* Sunrise Sunset row */}
          <div className="row">
            {new Array(totalHours).fill('x').map((_, i) => {
              const columnHour = now.add(i, 'hours');
              const columnHourStart = columnHour.startOf('hour');
              const columnHourEnd = columnHour.endOf('hour');
              const daysAfterToday = columnHour.startOf('day').diff(now.startOf('day'), 'days');
              const daySolarDetails = solarDetails[daysAfterToday];
              if (!daySolarDetails) {
                // This should only ever display if we start getting more forecast data than 8 days out (9 days total)
                console.error('Error retrieving all details');
                return <></>;
              }

              const astronomicalTwilightBegin = dayjs.utc(daySolarDetails.astronomicalTwilightBegin).local();
              const astronomicalTwilightEnd = dayjs.utc(daySolarDetails.astronomicalTwilightEnd).local();
              const nauticalTwilightBegin = dayjs.utc(daySolarDetails.nauticalTwilightBegin).local();
              const nauticalTwilightEnd = dayjs.utc(daySolarDetails.nauticalTwilightEnd).local();
              const sunrise = dayjs.utc(daySolarDetails.sunrise).local();
              const sunset = dayjs.utc(daySolarDetails.sunset).local();

              const isDuringTotalDarkness =
                columnHourEnd.isBefore(astronomicalTwilightBegin) || columnHourStart.isAfter(astronomicalTwilightEnd);
              const isDuringSunup = columnHourStart.isAfter(sunrise) && columnHourEnd.isBefore(sunset);

              const color = isDuringTotalDarkness ? 'black' : 'light-blue';
              if (isDuringTotalDarkness || isDuringSunup) {
                return <div className={`cell border ${color}-border`} key={i} />;
              }

              const hourContains = (time: Dayjs) => time.isAfter(columnHourStart) && time.isBefore(columnHourEnd);

              const isMorning = columnHourStart.isBefore(sunrise);
              if (isMorning) {
                const containsTotalDarkness = hourContains(astronomicalTwilightBegin);
                const containsAstroTwilight =
                  hourContains(astronomicalTwilightBegin) ||
                  (columnHourStart.isAfter(astronomicalTwilightBegin) &&
                    columnHourStart.isBefore(nauticalTwilightBegin));
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
                const sunriseWidth = Math.round((CELL_WIDTH * sunriseMinutes) / 60);
                // since we are using percentages of pixels, we round and add a pixel to ensure there are no missing pixels, the data looks correct, and
                // the length of the row is equal to the others
                const missingPixelWidth = CELL_WIDTH - totalDarkWidth - astroWidth - nautWidth - sunriseWidth;
                const missingPixelColor = containsSunrise ? 'light-blue' : containsNautTwilight ? 'blue' : 'dark-blue';

                return (
                  <>
                    <div
                      className={`cell border black-border`}
                      style={{ width: `${totalDarkWidth}px` }}
                      key={i + 'total'}
                    />
                    <div
                      className={`cell border dark-blue-border`}
                      style={{ width: `${astroWidth}px` }}
                      key={i + 'astro'}
                    />
                    <div className={`cell border blue-border`} style={{ width: `${nautWidth}px` }} key={i + 'naut'} />
                    <div
                      className={`cell border light-blue-border`}
                      style={{ width: `${sunriseWidth}px` }}
                      key={i + 'sunrise'}
                    />
                    {missingPixelWidth > 0 && (
                      <div
                        className={`cell border ${missingPixelColor}-border`}
                        style={{ width: `${missingPixelWidth}px` }}
                        key={i + 'missingPixel'}
                      />
                    )}
                  </>
                );
              }

              const containsSunset = hourContains(sunset);
              const containsNautTwilight =
                hourContains(sunset) ||
                (columnHourStart.isAfter(sunset) && columnHourStart.isBefore(nauticalTwilightEnd));
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
              const sunsetWidth = Math.round((CELL_WIDTH * sunsetMinutes) / 60);
              const nautWidth = Math.round((CELL_WIDTH * nautMinutes) / 60);
              const astroWidth = Math.round((CELL_WIDTH * astroMinutes) / 60);
              const totalDarkWidth = Math.round((CELL_WIDTH * totalDarknessMinutes) / 60);

              // since we are using percentages of pixels, we round and add a pixel to ensure there are no missing pixels, the data looks correct, and
              // the length of the row is equal to the others
              const missingPixelWidth = CELL_WIDTH - totalDarkWidth - astroWidth - nautWidth - sunsetWidth;
              const missingPixelColor = containsTotalDarkness ? 'black' : containsAstroTwilight ? 'dark-blue' : 'blue';

              return (
                <>
                  <div
                    className={`cell border light-blue-border`}
                    style={{ width: `${sunsetWidth}px` }}
                    key={i + 'sunset'}
                  />
                  <div className={`cell border blue-border`} style={{ width: `${nautWidth}px` }} key={i + 'naut'} />
                  <div
                    className={`cell border dark-blue-border`}
                    style={{ width: `${astroWidth}px` }}
                    key={i + 'astro'}
                  />
                  <div
                    className={`cell border black-border`}
                    style={{ width: `${totalDarkWidth}px` }}
                    key={i + 'total'}
                  />
                  {missingPixelWidth > 0 && (
                    <div
                      className={`cell border ${missingPixelColor}-border`}
                      style={{ width: `${missingPixelWidth}px` }}
                      key={i + 'missingPixel'}
                    />
                  )}
                </>
              );
            })}
          </div>

          {/* Sky cover */}
          <div className="row data-point">
            {forecast?.skyCover.map((v, i) => (
              <div className={`cell border ${getCloudColor(v)}-border`} key={i}>
                {v}
              </div>
            ))}
          </div>

          {/* Wind speed */}
          <div className="row data-point">
            {forecast?.windSpeed.map((v, i) => (
              <div className={`cell border ${getWindSpeedColor(v)}-border`} key={i}>
                {v}
              </div>
            ))}
          </div>

          {/* Wind gust */}
          <div className="row data-point">
            {forecast?.windGust.map((v, i) => (
              <div className={`cell border ${getWindSpeedColor(v)}-border`} key={i}>
                {v}
              </div>
            ))}
          </div>

          {/* Wind direction */}
          <div className="row data-point">
            {forecast?.windDirection.map((v, i) => (
              <div className={`cell border wind-direction`} key={i}>
                <div style={{ rotate: `${v + 180}deg` }}>&#8593;</div>
              </div>
            ))}
          </div>

          {/* Temperature */}
          <div className="row data-point">
            {forecast?.temperature.map((v, i) => (
              <div className={`cell border ${getTemperatureColor(v)}-border`} key={i}>
                {v}
              </div>
            ))}
          </div>

          {/* Dewpoint */}
          <div className="row data-point">
            {forecast?.dewpoint.map((v, i) => (
              <div className={`cell border ${getTemperatureColor(v)}-border`} key={i}>
                {v}
              </div>
            ))}
          </div>

          {/* Precipiation */}
          <div className="row data-point">
            {forecast?.probabilityOfPrecipitation.map((v, i) => (
              <div className={`cell border ${getPrecipitationColor(v)}-border`} key={i}>
                {v}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
