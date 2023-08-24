/*
 * @prettier
 */

class Map {
  constructor({ height, width, tileSize }) {
    this._height = height;
    this._width = width;
    this._tileSize = tileSize;
    this._features = [];
    this._DOMObject = {};
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
  checkBounds(x, y) {
    if (x > this.width || y > this.height || x < 0 || y < 0) {
      throw new Error("out of bounds!");
    }

    if (x === undefined || y === undefined) {
      throw new Error("missing coords!");
    }
  }

  checkMap() {
    if (!(this.DOMObject instanceof HTMLElement)) {
      throw new Error("No map!");
    }
  }

  addFeature(feature, x, y) {
    try {
      this.checkBounds(x, y);
      const element = this.drawFeature(feature, x, y);
      this._features.push({
        feature,
        coords: [x, y],
        element,
      });
    } catch (e) {
      console.error(e.message);
    }
  }

  addWaypoint(x, y) {
    try {
      this.checkBounds(x, y);
      const waypoint = this.drawFeature(
        {
          border: "1px dashed green",
          backgroundColor: "rgba(120,250,160,0.3)",
          className: "waypoint",
        },
        x,
        y
      );
      this._waypoints.push({
        coords: [x, y],
        element: waypoint,
      });
    } catch (e) {
      console.error(e.message);
    }
  }

  removeWaypoint(i) {
    try {
      const waypoint = this._waypoints.splice(i, 1)[0];
      waypoint.element.remove();
      return waypoint;
    } catch (e) {
      console.error("no such waypoint or", e.message);
      return false;
    }
  }

  drawFeature(feature, x, y) {
    try {
      this.checkMap();
      const featureObj = document.createElement("div");
      const featureStyle = {
        boxSizing: "border-box",
        position: "absolute",
        backgroundColor: feature.backgroundColor,
        border: feature.border ? feature.border : "1px solid darkgray",
        width: `${this.tileSize}px`,
        height: `${this.tileSize}px`,
        left: `${x * this.tileSize}px`,
        top: `${y * this.tileSize}px`,
      };
      featureObj.className = feature.className || "feature";
      Object.assign(featureObj.style, featureStyle);
      this.DOMObject.append(featureObj);
      return featureObj;
    } catch (e) {
      console.error(e.message);
    }
  }

  create() {
    const mapElem = document.createElement("div");
    const mapStyle = {
      position: "relative",
      backgroundColor: "#efefef",
      border: "1px solid black",
      width: `${this.width * this.tileSize}px`,
      height: `${this.height * this.tileSize}px`,
    };
    Object.assign(mapElem.style, mapStyle);
    this._DOMObject = mapElem;
  }
}

export { Map };
