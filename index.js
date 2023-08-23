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

const lista = [
  "jauhoja",
  "perunoita",
  "sokeria",
  "omenoita",
  "sukat",
  "maitoa",
];

const getAdjacentEmptySpace = (x, y) => {
  const candidates = [
    [x - 1, y],
    [x + 1, y],
    [x, y - 1],
    [x, y + 1],
  ];

  const emptyCandidates = candidates.filter(([cx, cy]) => {
    return (
      cx >= 0 &&
      cx < mapArray[0].length &&
      cy >= 0 &&
      cy < mapArray.length &&
      mapArray[cy][cx] === 0
    );
  });

  if (emptyCandidates.length > 0) {
    return emptyCandidates[Math.floor(Math.random() * emptyCandidates.length)];
  } else {
    getAdjacentEmptySpace(x, y);
  }
};

const validLocs = mapArray
  .flatMap((row, y) => row.map((column, x) => (column > 0 ? [x, y] : null)))
  .filter((coord) => coord !== null);

const treasures = lista.map((item) => {
  const victim = Math.floor(Math.random() * validLocs.length);
  const treasure = getAdjacentEmptySpace(...validLocs.splice(victim, 1)[0]);
  return treasure;
});

treasures.forEach((waypoint) => {
  map.addWaypoint(waypoint[0], waypoint[1]);
});
