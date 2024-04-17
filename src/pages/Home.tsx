import { FC, useEffect, useState } from 'react';
import { ForecastTable } from '../components/ForecastTable/ForecastTable';
import { Navbar } from '../components/Navbar/Navbar';
import { useLocalStorage } from 'usehooks-ts';
import { Locations } from '../components/Locations/Locations';
import { Forecast } from '../components/Forecast/Forecast';
import { AstroLocation, LocationMap } from '../types/Locations';
import { useSearchParams } from 'react-router-dom';

const Home: FC = () => {
  const [locations, setLocations] = useLocalStorage('locations', '{}');
  const [location, setLocation] = useState<AstroLocation>();
  const parsedLocations: LocationMap = JSON.parse(locations);
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    const paramsLat = Number(searchParams.get('latitude'));
    const paramsLong = Number(searchParams.get('longitude'));
    // If valid query params exist
    if (paramsLat && !isNaN(paramsLat) && paramsLong && !isNaN(paramsLong)) {
      // if query param location matches a saved location, use that saved location.
      for (const name of Object.keys(parsedLocations)) {
        const { latitude, longitude } = parsedLocations[name].coordinates;
        if (latitude === paramsLat && longitude === paramsLong) {
          setLocation(parsedLocations[name]);
          return;
        }
      }
      // if query param location doesn't match a saved location, just use the coordinates.
      setLocation({ coordinates: { latitude: paramsLat, longitude: paramsLong } });
      return;
    }
    // If there are no query params and there are saved locations, use the first one.
    if (Object.keys(parsedLocations).length) {
      setLocation(parsedLocations[Object.keys(parsedLocations)[0]]);
    }
  }, []);

  const updateLocation = (location: AstroLocation) => {
    setSearchParams({
      latitude: location.coordinates.latitude.toString(),
      longitude: location.coordinates.longitude.toString(),
    });
    setLocation(location);
  };
  return (
    <div>
      <Navbar setLocation={updateLocation} />
      {location ? (
        <Forecast
          location={location}
          setLocations={setLocations}
          locations={parsedLocations}
          setLocation={updateLocation}
        />
      ) : (
        <div style={{ marginTop: '20px' }}>No locations found. Search for a location to get started.</div>
      )}
      {location && <ForecastTable location={location} />}
      {!!Object.keys(parsedLocations).length && (
        <Locations locations={parsedLocations} setLocation={updateLocation} setLocations={setLocations} />
      )}
    </div>
  );
};

export default Home;
