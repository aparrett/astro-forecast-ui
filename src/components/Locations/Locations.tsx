import './Locations.css';
import { AstroLocation, LocationMap } from '../../types/Locations';
import { getLocationKey } from '../../utils/getLocationKey';
import omit from 'lodash.omit';

interface LocationsProps {
  locations: LocationMap;
  setLocation: (l: AstroLocation) => void;
  setLocations: (locations: string) => void;
}

export const Locations = ({ locations, setLocation, setLocations }: LocationsProps) => {
  const locationsArr: AstroLocation[] = Object.keys(locations).map((key) => locations[key]);
  const handleDeleteLocation = (key: string) => {
    setLocations(JSON.stringify(omit(locations, key)));
  };
  return (
    <div className="locations">
      <div className="header">Locations</div>
      {locationsArr.map((location, i) => {
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
