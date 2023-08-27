import type * as CSS from 'csstype';

type MapConfig = {
  height: number;
  width: number;
  tileSize: number;
};

type Coords = {
  x: number;
  y: number;
};

type Feature = {
  name?: string;
  description?: string;
  className?: string;
  text?: string;
  textOrder?: number;
  appearance: CSS.Properties;
};

type Waypoint = {
  name?: string;
  coords: Coords;
  element?: HTMLElement;
};

export type MapFeature = {
  feature: Feature;
  coords: Coords;
  element: HTMLElement;
};

export type MapArray = Array<Array<number>>;
