import { Coordinates } from 'astro-ws-types';
import './Locations.css';

interface LocationsProps {
  locations: string;
  setCoordinates: (c: Coordinates) => void;
}

interface Location {
  name: string;
  coordinates: Coordinates;
}

export const Locations = ({ locations: l, setCoordinates }: LocationsProps) => {
  const parsedLocations = JSON.parse(l);
  const locations: Location[] = Object.keys(JSON.parse(l)).map((key) => parsedLocations[key]);

  return (
    <div className="locations">
      <div className="header">Locations</div>
      {locations.map((location, i) => (
        <div key={i} className="location">
          <div className="location-name">{location.name}</div>
          <div>
            {location.coordinates.latitude}, {location.coordinates.longitude}
          </div>
          <button type="button" onClick={() => setCoordinates(location.coordinates)}>
            View
          </button>
        </div>
      ))}
    </div>
  );
};
