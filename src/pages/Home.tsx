import { FC, useState } from 'react';
import { ForecastTable } from '../components/ForecastTable/ForecastTable';
import { Navbar } from '../components/Navbar/Navbar';
import { Coordinates } from 'astro-ws-types';
import { CoordinatesState } from '../types';

const Home: FC = () => {
  const [coordinates, updateCoordinates] = useState<CoordinatesState>({ curr: { latitude: 38.92, longitude: -91.7 } });
  const setCoordinates = (newCoordinates: Coordinates) => {
    updateCoordinates({ prev: coordinates?.curr, curr: newCoordinates });
  };
  return (
    <div>
      <Navbar setCoordinates={setCoordinates} />
      <ForecastTable coordinates={coordinates} />
    </div>
  );
};

export default Home;
