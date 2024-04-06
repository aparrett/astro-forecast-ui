import { FC } from 'react';
import { useGetForecast } from '../service/getForecast';

const Home: FC = () => {
  const { data: forecast } = useGetForecast('38.91', '-91.7');
  return (
    <section>
      <h1>Welcome!</h1>
      {JSON.stringify(forecast)}
    </section>
  );
};

export default Home;
