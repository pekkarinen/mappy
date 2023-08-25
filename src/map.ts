class Map {
  _height: number;
  _width: number;
  _tileSize: number;
  _features: Array<MapFeature>;
  _DOMObject: HTMLElement;
  _waypoints: Array<Waypoint>;

  constructor({ height, width, tileSize }: MapConfig) {
    this._height = height;
    this._width = width;
    this._tileSize = tileSize;
    this._DOMObject;
    this._features = [];
    this._waypoints = [];
    this.create();
  }

  /* getters & setters */

  get width() {
    return this._height;
  }

  get height() {
    return this._width;
  }

  get features() {
    return this._features;
  }

  get tileSize() {
    return this._tileSize;
  }

  get DOMObject() {
    return this._DOMObject;
  }

  get waypoints() {
    return this._waypoints;
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
      this._features.push({
        feature,
        coords,
        element,
      });
    } catch (e) {
      console.error(e.message);
    }
  }

  getWaypointsAt(coords: Coords) {
    if (coords.x === undefined || coords.y === undefined || coords.x < 0 || coords.y < 0) {
      console.error('missing or invalid coords!');
      return;
    }
    return this._waypoints.filter((waypoint) => {
      return waypoint.coords.x === coords.x && waypoint.coords.y === coords.y;
    });
  }

  addWaypoint(name: string, coords: Coords) {
    try {
      this.checkBounds(coords);
      const textOrder = this.getWaypointsAt(coords).length;
      const element = this.drawFeature(
        {
          border: `${textOrder + 1}px inset rgba(0,200,0,0.7)`,
          className: 'waypoint',
          text: name,
          textOrder,
        },
        coords
      );
      this._waypoints.push({
        name,
        coords,
        element,
      });
    } catch (e) {
      console.error(e.message);
    }
  }

  removeWaypoint(index: number) {
    try {
      const waypoint = this._waypoints.splice(index, 1)[0];
      waypoint.element.remove();
      return waypoint;
    } catch (e) {
      console.error('no such waypoint or', e.message);
      return false;
    }
  }

  drawFeature(feature: Feature, coords: Coords) {
    try {
      const featureObj = document.createElement('div');
      const featureStyle = {
        boxSizing: 'border-box',
        position: 'absolute',
        backgroundColor: feature.backgroundColor,
        border: feature.border ? feature.border : '1px solid darkgray',
        width: `${this.tileSize}px`,
        height: `${this.tileSize}px`,
        left: `${coords.x * this.tileSize}px`,
        top: `${coords.y * this.tileSize}px`,
      };
      if (feature.text) {
        featureObj.innerText = feature.text;
        featureObj.classList.add(`label-order-${feature.textOrder}`);
      }
      featureObj.classList.add(feature.className || 'feature');
      Object.assign(featureObj.style, featureStyle);
      this.DOMObject.append(featureObj);
      return featureObj;
    } catch (e) {
      console.error(e.message);
    }
  }

  create() {
    const mapElem = document.createElement('div');
    mapElem.className = 'map';
    const mapStyle = {
      position: 'relative',
      backgroundColor: '#e6e6e6',
      border: '1px solid black',
      width: `${this.width * this.tileSize}px`,
      height: `${this.height * this.tileSize}px`,
    };
    Object.assign(mapElem.style, mapStyle);
    this._DOMObject = mapElem;
  }
}

export { Map };