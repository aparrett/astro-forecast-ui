import './ForecastTable.css';
import { useGetForecast } from '../../service/getForecast';
import { getCloudColor, getPrecipitationColor, getTemperatureColor, getWindSpeedColor } from '../../utils/borderColors';
import dayjs, { Dayjs } from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { AstroLocation } from '../../types/Locations';
import { useGetSolarDetails } from '../../service/getSolarDetails';
import { CELL_WIDTH, solarTimeframes } from '../../utils/constants';
import { Fragment } from 'react/jsx-runtime';
import { getSolarDetailsForHour } from '../../utils/getSolarDetailsForHour';

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
            <div className="dow" style={{ width: initialDayWidth + 'px' }} key="first-day">
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
            <div className="dow" style={{ width: lastDayWidth + 'px' }} key="last-day">
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
              const solarDetailsForHour = getSolarDetailsForHour(now, i, solarDetails);
              if (!solarDetailsForHour) {
                // This should only ever display if we start getting more forecast data than 8 days out (9 days total) from NWS
                // because then we wouldn't have enough solar data.
                console.error('Error retrieving all details');
                return <></>;
              }

              if (
                ('isDuringTotalDarkness' in solarDetailsForHour && solarDetailsForHour.isDuringTotalDarkness) ||
                ('isDuringSunup' in solarDetailsForHour && solarDetailsForHour.isDuringSunup)
              ) {
                const color = solarDetailsForHour.isDuringTotalDarkness ? 'black' : 'light-blue';
                return <div className={`cell border ${color}-border`} key={i} />;
              }

              const {
                isMorning,
                totalDarkWidth,
                astroWidth,
                nautWidth,
                sunupWidth,
                missingPixelWidth,
                missingPixelColor,
              } = solarDetailsForHour as SolarDetailsForHourFull;

              // const timeframes = isMorning ? solarTimeframes : solarTimeframes.reverse();
              if (isMorning) {
                return (
                  <Fragment key={i}>
                    {!!totalDarkWidth && (
                      <div
                        className={`cell border black-border`}
                        style={{ width: `${totalDarkWidth}px` }}
                        test-data={totalDarkWidth}
                        key={i + 'total'}
                      />
                    )}
                    {!!astroWidth && (
                      <div
                        className={`cell border dark-blue-border`}
                        style={{ width: `${astroWidth}px` }}
                        test-data={astroWidth}
                        key={i + 'astro'}
                      />
                    )}
                    {!!nautWidth && (
                      <div
                        className={`cell border blue-border`}
                        style={{ width: `${nautWidth}px` }}
                        test-data={nautWidth}
                        key={i + 'naut'}
                      />
                    )}
                    {!!sunupWidth && (
                      <div
                        className={`cell border light-blue-border`}
                        style={{ width: `${sunupWidth}px` }}
                        test-data={sunupWidth}
                        key={i + 'sunrise'}
                      />
                    )}
                    {!!missingPixelWidth && (
                      <div
                        className={`cell border ${missingPixelColor}-border`}
                        style={{ width: `${missingPixelWidth}px` }}
                        test-data={missingPixelWidth}
                        key={i + 'missingPixel'}
                      />
                    )}
                  </Fragment>
                );
              }

              return (
                <Fragment key={i}>
                  {!!sunupWidth && (
                    <div
                      className={`cell border light-blue-border`}
                      style={{ width: `${sunupWidth}px` }}
                      test-data={sunupWidth}
                      key={i + 'sunset'}
                    />
                  )}
                  {!!nautWidth && (
                    <div
                      className={`cell border blue-border`}
                      style={{ width: `${nautWidth}px` }}
                      test-data={nautWidth}
                      key={i + 'naut'}
                    />
                  )}
                  {!!astroWidth && (
                    <div
                      className={`cell border dark-blue-border`}
                      style={{ width: `${astroWidth}px` }}
                      test-data={astroWidth}
                      key={i + 'astro'}
                    />
                  )}
                  {!!totalDarkWidth && (
                    <div
                      className={`cell border black-border`}
                      style={{ width: `${totalDarkWidth}px` }}
                      test-data={totalDarkWidth}
                      key={i + 'total'}
                    />
                  )}
                  {!!missingPixelWidth && (
                    <div
                      className={`cell border ${missingPixelColor}-border`}
                      style={{ width: `${missingPixelWidth}px` }}
                      test-data={missingPixelWidth}
                      key={i + 'missingPixel'}
                    />
                  )}
                </Fragment>
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
