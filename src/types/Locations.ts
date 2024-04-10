import { Coordinates } from 'astro-ws-types';

export interface AstroLocation {
  name?: string;
  coordinates: Coordinates;
}

export interface CoordinatesState {
  curr: Coordinates;
  prev?: Coordinates;
}
