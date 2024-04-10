import { FC, useEffect, useState } from 'react';
import { ForecastTable } from '../components/ForecastTable/ForecastTable';
import { Navbar } from '../components/Navbar/Navbar';
import { useLocalStorage } from 'usehooks-ts';
import { Locations } from '../components/Locations/Locations';
import { Forecast } from '../components/Forecast/Forecast';
import { AstroLocation } from '../types/Locations';

const Home: FC = () => {
  const [locations, setLocations] = useLocalStorage('locations', '{}');
  const [location, setLocation] = useState<AstroLocation>();

  useEffect(() => {
    const parsedLocations = JSON.parse(locations);
    if (Object.keys(parsedLocations).length) {
      setLocation(parsedLocations[Object.keys(parsedLocations)[0]]);
    }
  }, []);
  return (
    <div>
      <Navbar setLocation={setLocation} />
      {location ? (
        <Forecast location={location} setLocations={setLocations} locations={locations} setLocation={setLocation} />
      ) : (
        <div>No locations found. Search for a location to get started.</div>
      )}
      {location && <ForecastTable location={location} />}
      <Locations locations={locations} setLocation={setLocation} setLocations={setLocations} />
    </div>
  );
};

export default Home;
