import { Coordinates } from 'astro-ws-types';
import './Locations.css';
import { CurrentLocation } from '../../types/Locations';

interface LocationsProps {
  locations: string;
  setLocation: (l: CurrentLocation) => void;
}

export const Locations = ({ locations: l, setLocation }: LocationsProps) => {
  const parsedLocations = JSON.parse(l);
  const locations: CurrentLocation[] = Object.keys(JSON.parse(l)).map((key) => parsedLocations[key]);

  return (
    <div className="locations">
      <div className="header">Locations</div>
      {locations.map((location, i) => (
        <div key={i} className="location">
          <div className="location-name">{location.name}</div>
          <div>
            {location.coordinates.latitude}, {location.coordinates.longitude}
          </div>
          <button type="button" onClick={() => setLocation(location)}>
            View
          </button>
        </div>
      ))}
    </div>
  );
};
