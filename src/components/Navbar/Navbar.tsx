import './Navbar.css';
import { AstroLocation } from '../../types/Locations';
import { NavbarCoord } from './NavbarCoord';
import { NavbarLocation } from './NavbarLocation';

interface NavbarProps {
  setLocation: (l: AstroLocation) => void;
}

export const Navbar = ({ setLocation }: NavbarProps) => {

  return (
    <div className="navbar">
      <div></div>
      <div className="fake-logo">AstroWS</div>
      <div className="nav-search">
        <NavbarCoord setLocation={setLocation} />
        <NavbarLocation setLocation={setLocation} />
      </div>
    </div>
  );
};
