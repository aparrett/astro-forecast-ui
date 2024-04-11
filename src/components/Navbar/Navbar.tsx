import { useState } from 'react';
import './Navbar.css';
import { AstroLocation } from '../../types/Locations';
import { isValidLatitude, isValidLongitude, toLatitudeNum, toLongitudeNum } from '../../utils/coordinates';

interface NavbarProps {
  setLocation: (l: AstroLocation) => void;
}

export const Navbar = ({ setLocation }: NavbarProps) => {
  const [lat, setLat] = useState<string>('');
  const [long, setLong] = useState<string>('');

  const handleSearchSubmit = () => {
    if (!isValidLatitude(lat)) {
      return alert(`${lat} is not a valid latitude.`);
    }
    if (!isValidLongitude(long)) {
      return alert(`${long} is not a valid longitude.`);
    }
    setLocation({ coordinates: { latitude: toLatitudeNum(lat), longitude: toLongitudeNum(long) } });
    setLat('');
    setLong('');
  };

  const handleSearchKeypress = ({ key }: React.KeyboardEvent<HTMLInputElement>) => {
    if (key === 'Enter' && lat && long) {
      handleSearchSubmit();
    }
  };

  const handleLatChange = ({ currentTarget: { value } }: React.FormEvent<HTMLInputElement>) => {
    setLat(value);
  };

  const handleLongChange = ({ currentTarget: { value } }: React.FormEvent<HTMLInputElement>) => {
    setLong(value);
  };

  return (
    <div className="navbar">
      <div></div>
      <div className="fake-logo">AstroWS</div>
      <div className="nav-search">
        <form>
          <input placeholder="Lat" onChange={handleLatChange} value={lat} onKeyUp={handleSearchKeypress} />
          <input placeholder="Long" onChange={handleLongChange} value={long} onKeyUp={handleSearchKeypress} />
          <button type="button" disabled={!lat || !long} onClick={handleSearchSubmit}>
            Go
          </button>
        </form>
      </div>
    </div>
  );
};
