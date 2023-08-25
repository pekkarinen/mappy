type MapConfig = {
  height: number;
  width: number;
  tileSize: number;
};

type Coords = {
  x: number;
  y: number;
};

type MapArray = Array<Array<number>>;

type Feature = {
  name?: string;
  description?: string;
  backgroundColor?: string;
  border?: string;
  className?: string;
  text?: string;
  textOrder?: number;
};

type Waypoint = {
  name: string;
  coords: Coords;
  element: HTMLElement;
};

type MapFeature = {
  feature: Feature;
  coords: Coords;
  element: HTMLElement;
};
