import { FC, useEffect, useState } from 'react';
import { ForecastTable } from '../components/ForecastTable/ForecastTable';
import { Navbar } from '../components/Navbar/Navbar';
import { useLocalStorage } from 'usehooks-ts';
import { Locations } from '../components/Locations/Locations';
import { Forecast } from '../components/Forecast/Forecast';
import { AstroLocation, LocationMap } from '../types/Locations';

const Home: FC = () => {
  const [locations, setLocations] = useLocalStorage('locations', '{}');
  const [location, setLocation] = useState<AstroLocation>();
  const parsedLocations: LocationMap = JSON.parse(locations);

  useEffect(() => {
    if (Object.keys(parsedLocations).length) {
      setLocation(parsedLocations[Object.keys(parsedLocations)[0]]);
    }
  }, []);
  return (
    <div>
      <Navbar setLocation={setLocation} />
      {location ? (
        <Forecast
          location={location}
          setLocations={setLocations}
          locations={parsedLocations}
          setLocation={setLocation}
        />
      ) : (
        <div style={{ marginTop: '20px' }}>No locations found. Search for a location to get started.</div>
      )}
      {location && <ForecastTable location={location} />}
      {!!Object.keys(parsedLocations).length && (
        <Locations locations={parsedLocations} setLocation={setLocation} setLocations={setLocations} />
      )}
    </div>
  );
};

export default Home;
