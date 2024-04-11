import { AstroLocation, LocationMap } from '../../types/Locations';
import { getLocationKey } from '../../utils/getLocationKey';
import { SaveLocation } from '../SaveLocation/SaveLocation';
import './Forecast.css';

interface ForecastProps {
  location: AstroLocation;
  setLocations: React.Dispatch<React.SetStateAction<string>>;
  setLocation: (location: AstroLocation) => void;
  locations: LocationMap;
}

export const Forecast = ({ location, locations, setLocations, setLocation }: ForecastProps) => {
  const key = getLocationKey(location);
  return (
    <div className="forecast">
      <div className="header">
        {location.name || `Latitude ${location.coordinates.latitude}, Longitude ${location.coordinates.longitude}`}
      </div>
      {/* Remove save button when location is already saved. */}
      {!locations[key] && (
        <SaveLocation location={location} setLocations={setLocations} locations={locations} setLocation={setLocation} />
      )}
    </div>
  );
};
