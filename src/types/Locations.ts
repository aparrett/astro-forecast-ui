import { Coordinates } from "astro-ws-types";

export interface CurrentLocation {
  name?: string;
  coordinates: Coordinates;
}

export interface CoordinatesState {
  curr: Coordinates;
  prev?: Coordinates;
}
