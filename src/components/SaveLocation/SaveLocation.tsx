import { useState } from 'react';
import { CoordinatesState } from '../../types';
import { Drawer } from '../Drawer/Drawer';

interface SaveLocationProps {
  coordinates?: CoordinatesState;
  setLocations: React.Dispatch<React.SetStateAction<string>>;
  /** stringified JSON */
  locations: string;
}

export const SaveLocation = ({ coordinates, setLocations, locations }: SaveLocationProps) => {
  const [showLocationDrawer, setShowLocationDrawer] = useState(false);
  const [name, setName] = useState('');
  const resetAndClose = () => {
    setName('');
    setShowLocationDrawer(false);
  };
  const handleSaveLocation = () => {
    const key = coordinates?.curr.latitude + ',' + coordinates?.curr.longitude;
    const updatedLocations = JSON.parse(locations);
    if (updatedLocations[key]) {
      // TODO: toast
      alert(`Location already exists at these coordinates with the name ${updatedLocations[key].name}.`);
      resetAndClose();
      return;
    } else {
      setLocations(JSON.stringify({ ...updatedLocations, [key]: { name, coordinates: coordinates?.curr } }));
      // TODO: toast
      alert(`Saved location ${name} at ${key}.`);
      resetAndClose();
    }
  };
  const handleNameChange = ({ currentTarget: { value } }: React.FormEvent<HTMLInputElement>) => {
    setName(value);
  };

  return (
    <div>
      <div className="location-details">
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
                Coordinates: {coordinates?.curr.latitude}, {coordinates?.curr.longitude}
              </div>
              <div className="field">
                <label>Name</label>
                <input type="string" onChange={handleNameChange} value={name} />
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
