import { useState } from 'react';
import { Drawer } from '../Drawer/Drawer';
import { AstroLocation } from '../../types/Locations';
import './SaveLocation.css';
import { getLocationKey } from '../../utils/getLocationKey';

interface SaveLocationProps {
  location: AstroLocation;
  setLocations: React.Dispatch<React.SetStateAction<string>>;
  /** stringified JSON */
  locations: string;
  setLocation: (l: AstroLocation) => void;
}

export const SaveLocation = ({
  location: { coordinates },
  setLocations,
  locations,
  setLocation,
}: SaveLocationProps) => {
  const [showLocationDrawer, setShowLocationDrawer] = useState(false);
  const [name, setName] = useState('');
  const resetAndClose = () => {
    setName('');
    setShowLocationDrawer(false);
  };
  const handleSaveLocation = () => {
    if (!name) {
      return alert('Name required.');
    }
    const key = getLocationKey({ coordinates });
    const updatedLocations = JSON.parse(locations);
    if (updatedLocations[key]) {
      // TODO: toast
      alert(`Location already exists at these coordinates with the name ${updatedLocations[key].name}.`);
      resetAndClose();
      return;
    } else {
      setLocations(JSON.stringify({ ...updatedLocations, [key]: { name, coordinates } }));
      setLocation({ name, coordinates });
      // TODO: toast
      alert(`Saved location ${name} at ${key}.`);
      resetAndClose();
    }
  };
  const handleNameChange = ({ currentTarget: { value } }: React.FormEvent<HTMLInputElement>) => {
    setName(value);
  };

  const handleSearchKeypress = ({ key }: React.KeyboardEvent<HTMLInputElement>) => {
    if (key === 'Enter' && name) {
      handleSaveLocation();
    }
  };

  return (
    <div>
      <div className="save-location">
        <button type="button" onClick={() => setShowLocationDrawer(true)}>
          Save Location
        </button>
      </div>
      {showLocationDrawer && (
        <Drawer onClose={() => setShowLocationDrawer(false)}>
          <div>
            <div className="drawer-title">Save Location</div>
            <div className="drawer-contents">
              <div>
                Coordinates: {coordinates.latitude}, {coordinates.longitude}
              </div>
              <div className="field">
                <label>Name</label>
                <input type="string" onChange={handleNameChange} onKeyUp={handleSearchKeypress} value={name} />
              </div>
            </div>
            <div className="drawer-actions">
              <button type="button" onClick={handleSaveLocation}>
                Save
              </button>
            </div>
            <p className="small">Note: clearing your cache will delete your saved locations.</p>
          </div>
        </Drawer>
      )}
    </div>
  );
};
