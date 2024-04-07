import { FC } from 'react';
import './ForecastTable.css';
import { useGetForecast } from '../../service/getForecast';

export const ForecastTable: FC = () => {
  const { data: forecast } = useGetForecast('38.91', '-91.7');
  return (
    <div className="forecast-table">
      <div className="row">
        {forecast?.skyCover.map((v, i) => (
          <div className="cell" key={i}>
            {v.value}
          </div>
        ))}
      </div>
    </div>
  );
};
