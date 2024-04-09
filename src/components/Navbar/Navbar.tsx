import { FC, useEffect, useState } from 'react';
import './Navbar.css';
import { Coordinates } from 'astro-ws-types';

export const Navbar: FC<{ setCoordinates: (c: Coordinates) => void }> = ({ setCoordinates }) => {
  const [lat, setLat] = useState<number | string>('');
  const [long, setLong] = useState<number | string>('');

  const handleSearchSubmit = () => {
    setCoordinates({ latitude: Number(lat), longitude: Number(long) });
  };

  const handleSearchKeypress = ({ key }: React.KeyboardEvent<HTMLInputElement>) => {
    if (key === 'Enter' && lat && long) {
      handleSearchSubmit();
    }
  };

  const handleLatChange = ({ currentTarget: { value } }: React.FormEvent<HTMLInputElement>) => {
    setLat(Number(value));
  };

  const handleLongChange = ({ currentTarget: { value } }: React.FormEvent<HTMLInputElement>) => {
    setLong(Number(value));
  };

  return (
    <div className="navbar">
      <div></div>
      <div className="fake-logo">AstroWS</div>
      <div className="nav-search">
        <form>
          <input
            type="number"
            placeholder="Lat"
            onChange={handleLatChange}
            value={lat}
            onKeyUp={handleSearchKeypress}
          />
          <input
            type="number"
            placeholder="Long"
            onChange={handleLongChange}
            value={long}
            onKeyUp={handleSearchKeypress}
          />
          <button type="button" disabled={!lat && !long} onClick={handleSearchSubmit}>
            Go
          </button>
        </form>
      </div>
    </div>
  );
};
