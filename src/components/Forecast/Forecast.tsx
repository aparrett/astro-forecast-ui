import { CurrentLocation } from '../../types/Locations';
import { SaveLocation } from '../SaveLocation/SaveLocation';
import './Forecast.css';

interface ForecastProps {
  location: CurrentLocation;
  setLocations: React.Dispatch<React.SetStateAction<string>>;
  /** stringified JSON */
  locations: string;
}
export const Forecast = ({ location, locations, setLocations }: ForecastProps) => {
  const key = location.coordinates.latitude + ',' + location.coordinates.longitude;
  const parsedLocations = JSON.parse(locations);
  return (
    <div>
      <div className="header">
        {location.name || `Latitude ${location.coordinates.latitude}, Longitude ${location.coordinates.longitude}`}
      </div>
      {/* Remove save button when location is alredy saved. */}
      {!parsedLocations[key] && <SaveLocation location={location} setLocations={setLocations} locations={locations} />}
    </div>
  );
};
