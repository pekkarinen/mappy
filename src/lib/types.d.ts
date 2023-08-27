type MapConfig = {
  height: number;
  width: number;
  tileSize: number;
};

type Coords = {
  x: number;
  y: number;
};

export type MapFeature = {
  feature: Feature;
  coords: Coords;
  element: HTMLElement;
};

export type MapArray = Array<Array<number>>;
