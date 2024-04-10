import { AstroLocation } from '../../types/Locations';
import { getLocationKey } from '../../utils/getLocationKey';
import { SaveLocation } from '../SaveLocation/SaveLocation';
import './Forecast.css';

interface ForecastProps {
  location: AstroLocation;
  setLocations: React.Dispatch<React.SetStateAction<string>>;
  /** stringified JSON */
  locations: string;
}

export const Forecast = ({ location, locations, setLocations }: ForecastProps) => {
  const key = getLocationKey(location);
  const parsedLocations = JSON.parse(locations);
  return (
    <div className="forecast">
      <div className="header">
        {location.name || `Latitude ${location.coordinates.latitude}, Longitude ${location.coordinates.longitude}`}
      </div>
      {/* Remove save button when location is alredy saved. */}
      {!parsedLocations[key] && <SaveLocation location={location} setLocations={setLocations} locations={locations} />}
    </div>
  );
};
