/*
 * @prettier
 */

import { Map } from "./map.js";

const app = document.querySelector("#app");

class Thing {
  constructor(name, description) {
    this.name = name;
    this.description = description;
  }
}

class Feature extends Thing {
  constructor(name, description, backgroundColor) {
    super(name, description);
    this.backgroundColor = backgroundColor;
  }
}

const mapConfig = {
  height: 10,
  width: 10,
  tileSize: 64,
};

const map = new Map(mapConfig);

app.append(map.DOMObject);

const tiski = new Feature("Tiski", "tämmönen", "gray");
const kaappi = new Feature("Kaappi", "semmonen", "blue");
const mapFeatures = [0, tiski, kaappi];

const s = new Feature("Start", "lähtö", "green");
const e = new Feature("Exit", "loppu", "red");

const mapArray = [
  [s, 0, 1, 0, 1, 0, 0, 1, 1, 0],
  [0, 0, 1, 0, 2, 0, 0, 1, 1, 0],
  [0, 0, 0, 0, 2, 0, 0, 0, 0, 0],
  [1, 0, 1, 1, 1, 0, 2, 1, 1, 0],
  [1, 0, 0, 0, 0, 0, 0, 0, 1, 1],
  [1, 0, 2, 0, 1, 0, 0, 0, 0, 1],
  [0, 0, 2, 0, 2, 0, 2, 1, 0, 1],
  [0, 0, 1, 0, 1, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 2, 0, 0, 1, 1, 0],
  [0, 0, 2, 1, 1, 0, 0, 1, 1, e],
];

mapArray.forEach((row, y) => {
  row.forEach((column, x) => {
    if (typeof column === "number") {
      map.addFeature(mapFeatures[column], x, y);
    } else {
      map.addFeature(column, x, y);
    }
  });
});
