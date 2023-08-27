import { MapConfig, Coords } from './lib/types';
import { Waypoint, Feature, Actor } from './Items';
import { v4 as uuidv4 } from 'uuid';

export type MapFeature = {
  id: string;
  feature: Feature | Waypoint;
  coords: Coords;
  element: HTMLElement;
};

class GridMap {
  _height: number;
  _width: number;
  _tileSize: number;
  _features: Array<MapFeature>;
  _DOMObject: HTMLElement;

  constructor({ height, width, tileSize }: MapConfig) {
    this._height = height;
    this._width = width;
    this._tileSize = tileSize;
    this._DOMObject;
    this._features = [];
    this.create();
  }

  /* getters & setters */

  get width() {
    return this._height;
  }

  get height() {
    return this._width;
  }

  get tileSize() {
    return this._tileSize;
  }

  get DOMObject() {
    return this._DOMObject;
  }

  get features() {
    return this._features;
  }

  get waypoints() {
    return this._features.filter(({ feature }) => feature instanceof Waypoint);
  }

  get actor() {
    return this.features.find(({ feature }) => feature instanceof Actor);
  }

  get start() {
    return this.features.find(({ feature }) => feature.name === 'start');
  }

  get goal() {
    return this.features.find(({ feature }) => feature.name === 'goal');
  }

  /* error handling */
  checkBounds(coords: Coords) {
    if (coords.x > this.width || coords.y > this.height || coords.x < 0 || coords.y < 0) {
      throw new Error('out of bounds!');
    }

    if (coords.x === undefined || coords.y === undefined) {
      throw new Error('missing coords!');
    }
  }

  checkMap() {
    if (!(this.DOMObject instanceof HTMLElement)) {
      throw new Error('No map!');
    }
  }

  addFeature(feature: Feature, coords: Coords) {
    try {
      this.checkBounds(coords);
      const element = this.drawFeature(feature, coords);
      const mapFeature = {
        id: uuidv4(),
        feature,
        coords,
        element,
      };
      this._features.push(mapFeature);
      return mapFeature;
    } catch (e) {
      throw new Error(e.message);
    }
  }

  getFeaturesAt(coords: Coords) {
    if (coords.x === undefined || coords.y === undefined || coords.x < 0 || coords.y < 0) {
      throw new Error('missing or invalid coords!');
    }
    return this.features.filter((feature) => {
      return feature.coords.x === coords.x && feature.coords.y === coords.y;
    });
  }

  removeFeature(id: string) {
    try {
      const featureIndex = this.features.findIndex((feature) => feature.id === id);
      const feature = this.features.splice(featureIndex, 1)[0];
      feature.element.remove();
      return feature;
    } catch (e) {
      throw new Error(`no such feature or ${e.message}`);
    }
  }

  moveFeature(id: string, coords: Coords) {
    try {
      const feature = this.features.find((feature) => feature.id === id);
      if (feature) {
        feature.element.style.left = `${coords.x * this.tileSize}px`;
        feature.element.style.top = `${coords.y * this.tileSize}px`;
      }
      return feature;
    } catch (e) {
      throw new Error(e.message);
    }
  }

  drawFeature(feature: Feature, coords: Coords) {
    try {
      this.checkBounds(coords);
      const featureObj = document.createElement('div');
      const featureStyle = {
        boxSizing: 'border-box',
        position: 'absolute',
        width: `${this.tileSize}px`,
        height: `${this.tileSize}px`,
        left: `${coords.x * this.tileSize}px`,
        top: `${coords.y * this.tileSize}px`,
        ...feature.appearance,
      };

      if (feature.text) featureObj.innerText = feature.text;

      const featuresAtPosition = this.getFeaturesAt(coords);
      featureObj.classList.add(`label-order-${featuresAtPosition.length}`);

      featureObj.classList.add(feature.className);
      Object.assign(featureObj.style, featureStyle);
      this.DOMObject.append(featureObj);
      return featureObj;
    } catch (e) {
      throw new Error(e.message);
    }
  }

  create() {
    const mapElem = document.createElement('div');
    mapElem.className = 'map';
    const mapStyle = {
      position: 'relative',
      background: '#e6e6e6',
      border: '1px solid black',
      width: `${this.width * this.tileSize}px`,
      height: `${this.height * this.tileSize}px`,
    };
    Object.assign(mapElem.style, mapStyle);
    this._DOMObject = mapElem;
  }
}

export { GridMap };
