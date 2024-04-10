import { AstroLocation } from '../types/Locations';

export const getLocationKey = (location: AstroLocation) =>
  location.coordinates.latitude + ',' + location.coordinates.longitude;
