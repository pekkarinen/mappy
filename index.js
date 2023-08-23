/*
 * @prettier
 */

import { Map } from "./map.js";
import { Feature } from "./items.js";

const app = document.querySelector("#app");

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
  [s, 0, 1, 0, 1, 0, 1, 1, 1, 0],
  [0, 0, 1, 0, 2, 0, 1, 0, 1, 0],
  [0, 0, 0, 0, 2, 0, 0, 0, 0, 0],
  [1, 0, 1, 1, 1, 0, 2, 1, 1, 0],
  [1, 0, 0, 0, 0, 0, 0, 0, 1, 1],
  [1, 0, 2, 0, 2, 0, 0, 0, 0, 1],
  [0, 0, 2, 0, 2, 0, 2, 1, 0, 1],
  [1, 0, 2, 0, 2, 0, 0, 0, 0, 0],
  [1, 0, 0, 0, 0, 0, 1, 0, 1, 0],
  [1, 1, 2, 1, 1, 0, 1, 0, 1, e],
];

const walkableMatrix = [
  mapArray.map((row) => row.map((column) => column === 0)),
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

/* data mockup */

const lista = [
  "jauhoja",
  "perunoita",
  "sokeria",
  "omenoita",
  "sukat",
  "maitoa",
  "piimää",
  "juustua",
  "pipot",
];

/* helper func */
const getAdjacentSpaces = (x, y) => {
  const adjacentTiles = [
    [x - 1, y],
    [x + 1, y],
    [x, y - 1],
    [x, y + 1],
  ];

  const adjacentSpaces = adjacentTiles.filter(([cx, cy]) => {
    return (
      cx >= 0 &&
      cx < mapArray[0].length &&
      cy >= 0 &&
      cy < mapArray.length &&
      mapArray[cy][cx] === 0
    );
  });
  return adjacentSpaces;
};

const getRandomEmptySpace = (x, y) => {
  const emptyAdjacentSpaces = getAdjacentSpaces(x, y);
  return emptyAdjacentSpaces[
    Math.floor(Math.random() * emptyAdjacentSpaces.length)
  ];
};

const validLocs = mapArray
  .flatMap((row, y) =>
    row.map((column, x) =>
      column > 0 && getAdjacentSpaces(x, y).length > 0 ? [x, y] : null
    )
  )
  .filter((coord) => coord !== null);

const treasures = lista.map((item) => {
  const victim = Math.floor(Math.random() * validLocs.length);
  const treasure = getRandomEmptySpace(...validLocs.splice(victim, 1)[0]);
  return treasure;
});

treasures.forEach((waypoint) => {
  map.addWaypoint(waypoint[0], waypoint[1]);
});
