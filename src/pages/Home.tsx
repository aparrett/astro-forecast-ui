import { FC } from 'react';
import { ForecastTable } from '../components/ForecastTable/ForecastTable';
import './Home.css'

const Home: FC = () => {
  // TODO: Header, footer, etc.
  return (
    <div>
      <div className='fake-logo'>Astro Weather Service</div>
      <ForecastTable />
    </div>
  );
};

export default Home;
