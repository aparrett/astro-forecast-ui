import { PropsWithChildren } from 'react';
import './Drawer.css';

interface DrawerProps {
  onClose: () => void;
}

export const Drawer = ({ onClose, children }: PropsWithChildren<DrawerProps>) => {
  const handleOutsideClick = (e: React.MouseEvent) => {
    e.preventDefault();
    onClose();
  };
  const handleContentsClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };
  return (
    <div className="drawer-overlay" onClick={handleOutsideClick}>
      <div className="drawer" onClick={handleContentsClick}>
        <div className="close-btn" onClick={onClose} />
        {children}
      </div>
    </div>
  );
};
