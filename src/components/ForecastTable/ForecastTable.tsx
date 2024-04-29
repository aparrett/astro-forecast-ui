import './ForecastTable.css';
import { useGetForecast } from '../../service/getForecast';
import { getCloudColor, getPrecipitationColor, getTemperatureColor, getWindSpeedColor } from '../../utils/borderColors';
import dayjs from 'dayjs';
import { AstroLocation } from '../../types/Locations';

interface ForecastTableProps {
  location: AstroLocation;
}

export const ForecastTable = ({ location: { coordinates } }: ForecastTableProps) => {
  const { data: forecast, isLoading } = useGetForecast(coordinates.latitude, coordinates.longitude);

  if (isLoading) {
    // TODO
    return <></>;
  }
  if (!forecast) {
    // TODO: beautify
    return <div style={{ marginTop: '12px' }}>Unable to retrieve forecast. Please try again.</div>;
  }

  const day = dayjs();
  const cellWidth = 26;
  const hoursLeftInDay = 24 - day.hour();
  const initialDayWidth = cellWidth * hoursLeftInDay;
  const totalHours = forecast.skyCover.length;
  const lastDayWidth = cellWidth * ((totalHours - hoursLeftInDay) % 24);
  const remainingDays = Math.ceil((totalHours - hoursLeftInDay) / 24);

  return (
    <div>
      <div className="forecast-table">
        <div className="y-headers">
          <div className="y-header" style={{ height: '46px' }}></div>
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
              {hoursLeftInDay > 1 && day.format('ddd')}
            </div>
            {new Array(remainingDays - 1).fill('x').map((_, i) => (
              <div key={i} className="dow">
                {day.add(i + 1, 'day').format('ddd')}
              </div>
            ))}
            {/* last day */}
            <div className="dow" style={{ width: lastDayWidth + 'px' }}>
              {/* only show abbreviation if there is enough room */}
              {lastDayWidth > 1 && day.add(remainingDays, 'day').format('ddd')}
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

          {/* Sky cover */}
          <div className="row">
            {forecast?.skyCover.map((v, i) => (
              <div className={`cell border ${getCloudColor(v)}-border`} key={i}>
                {v}
              </div>
            ))}
          </div>

          {/* Wind speed */}
          <div className="row">
            {forecast?.windSpeed.map((v, i) => (
              <div className={`cell border ${getWindSpeedColor(v)}-border`} key={i}>
                {v}
              </div>
            ))}
          </div>

          {/* Wind gust */}
          <div className="row">
            {forecast?.windGust.map((v, i) => (
              <div className={`cell border ${getWindSpeedColor(v)}-border`} key={i}>
                {v}
              </div>
            ))}
          </div>

          {/* Wind direction */}
          <div className="row">
            {forecast?.windDirection.map((v, i) => (
              <div className={`cell border wind-direction`}>
                <div style={{ rotate: `${v + 180}deg` }}>&#8593;</div>
              </div>
            ))}
          </div>

          {/* Temperature */}
          <div className="row">
            {forecast?.temperature.map((v, i) => (
              <div className={`cell border ${getTemperatureColor(v)}-border`} key={i}>
                {v}
              </div>
            ))}
          </div>

          {/* Dewpoint */}
          <div className="row">
            {forecast?.dewpoint.map((v, i) => (
              <div className={`cell border ${getTemperatureColor(v)}-border`} key={i}>
                {v}
              </div>
            ))}
          </div>

          {/* Precipiation */}
          <div className="row">
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
