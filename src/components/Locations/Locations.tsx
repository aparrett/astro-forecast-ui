import './Locations.css';
import { AstroLocation } from '../../types/Locations';
import { getLocationKey } from '../../utils/getLocationKey';
import omit from 'lodash.omit';

interface LocationsProps {
  locations: string;
  setLocation: (l: AstroLocation) => void;
  setLocations: (locations: string) => void;
}

export const Locations = ({ locations: l, setLocation, setLocations }: LocationsProps) => {
  const parsedLocations = JSON.parse(l);
  const locations: AstroLocation[] = Object.keys(JSON.parse(l)).map((key) => parsedLocations[key]);
  const handleDeleteLocation = (key: string) => {
    setLocations(JSON.stringify(omit(parsedLocations, key)));
  };
  return (
    <div className="locations">
      <div className="header">Locations</div>
      {locations.map((location, i) => {
        const key = getLocationKey(location);
        return (
          <div key={key} className="location">
            <div className="location-name">{location.name}</div>
            <div>
              {location.coordinates.latitude}, {location.coordinates.longitude}
            </div>
            <button type="button" onClick={() => setLocation(location)}>
              View
            </button>
            <button type="button" onClick={() => handleDeleteLocation(key)}>
              Delete
            </button>
          </div>
        );
      })}
    </div>
  );
};
