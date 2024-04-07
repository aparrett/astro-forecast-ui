import { FC } from 'react';
import './ForecastTable.css';
import { useGetForecast } from '../../service/getForecast';
import { getCloudColor } from '../../utils/borderColors';

export const ForecastTable: FC = () => {
  const { data: forecast } = useGetForecast('38.91', '-91.7');

  return (
    <div className="forecast-table">
      <div className="y-headers">
        <div className="y-header">c</div>
      </div>
      <div className="forecast-data">
        <div className="row">
          {forecast?.skyCover.map((v, i) => (
            <div className={`cell ${getCloudColor(v)}-border`} key={i}>
              {v}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
