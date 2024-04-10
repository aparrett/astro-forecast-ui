import { FC, useState } from 'react';
import { ForecastTable } from '../components/ForecastTable/ForecastTable';
import { Navbar } from '../components/Navbar/Navbar';
import { Coordinates } from 'astro-ws-types';
import { CoordinatesState } from '../types';
import { useLocalStorage } from 'usehooks-ts';
import { SaveLocation } from '../components/SaveLocation/SaveLocation';
import { Locations } from '../components/Locations/Locations';

const Home: FC = () => {
  const [coordinates, updateCoordinates] = useState<CoordinatesState>({ curr: { latitude: 38.92, longitude: -91.7 } });
  const [locations, setLocations] = useLocalStorage('locations', '{}');
  const setCoordinates = (newCoordinates: Coordinates) => {
    updateCoordinates({ prev: coordinates?.curr, curr: newCoordinates });
  };
  return (
    <div>
      <Navbar setCoordinates={setCoordinates} />
      <SaveLocation coordinates={coordinates} setLocations={setLocations} locations={locations} />
      <ForecastTable coordinates={coordinates} />
      <Locations locations={locations} setCoordinates={setCoordinates} />
    </div>
  );
};

export default Home;
