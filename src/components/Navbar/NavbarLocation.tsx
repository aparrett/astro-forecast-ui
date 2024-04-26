import { useState } from 'react';
import { AstroLocation } from '../../types/Locations';
import { useGetLocations } from '../../service/getLocations';
import { Drawer } from '../Drawer/Drawer';

interface NavbarLocationProps {
  setLocation: (l: AstroLocation) => void;
}

export const NavbarLocation = ({ setLocation }: NavbarLocationProps) => {
  const [locInput, setLocInput] = useState('');
  const [locSearch, setLocSearch] = useState('');
  const [showLocSearchDrawer, setShowLocSearchDrawer] = useState(false);
  const { data: searchLocations, isLoading: isGetLocationsLoading } = useGetLocations(locSearch);

  const handleLocSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowLocSearchDrawer(true);
    setLocSearch(locInput);
  };

  const handleLocChange = ({ currentTarget: { value } }: React.FormEvent<HTMLInputElement>) => setLocInput(value);

  const resetAndClose = () => {
    setLocSearch('');
    setLocInput('');
    setShowLocSearchDrawer(false);
  };

  const handleLocationSelect = (searchLocation: AstroLocation) => {
    setLocation(searchLocation);
    resetAndClose();
  };

  return (
    <div className="nav-loc-search">
      <form onSubmit={handleLocSubmit}>
        <input placeholder="Location" onChange={handleLocChange} value={locInput} />
        <button disabled={!locInput}>Search</button>
      </form>
      {showLocSearchDrawer && (
        <Drawer onClose={() => resetAndClose()}>
          <div>
            <div className="drawer-title">Search Locations</div>
            <div className="drawer-contents">
              {isGetLocationsLoading && <div>Loading...</div>}
              {!isGetLocationsLoading &&
                searchLocations &&
                searchLocations.map((searchLocation: AstroLocation) => (
                  <div className="search-location">
                    <div className="search-location-name">Name: {searchLocation.name}</div>
                    <div>
                      Coordinates: {searchLocation.coordinates.latitude}, {searchLocation.coordinates.longitude}
                    </div>
                    <button type="button" onClick={() => handleLocationSelect(searchLocation)}>
                      Select
                    </button>
                  </div>
                ))}
            </div>
          </div>
        </Drawer>
      )}
    </div>
  );
};
