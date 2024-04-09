import { Coordinates } from "astro-ws-types";

export interface CoordinatesState {
  curr: Coordinates;
  prev?: Coordinates;
}
