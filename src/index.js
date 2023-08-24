/*
 * @prettier
 */
import { Map } from "./map.js";
import { Feature } from "./items.js";
import "./mappy.css";

const app = document.createElement("div");
document.body.append(app);

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
    if (typeof column === "number" && column > 0) {
      map.addFeature(mapFeatures[column], { x, y });
    } else if (typeof column === "object") {
      map.addFeature(column, { x, y });
    }
  });
});

/* data mockup */

const lista = [
  "jauho",
  "perunoi",
  "sokeri",
  "omeno",
  "sukat",
  "maito",
  "piimä",
  "juustu",
  "pipot",
  "ohra",
  "vehnä",
  "herne",
  "sinep",
  "ketsup",
  "salaat",
  "pasta",
  "vihvit",
  "nakki",
  "makkur",
  "olutta",
];

/* helper func */
const getAdjacentSpaces = (x, y) => {
  const adjacentTiles = [
    { x: x - 1, y },
    { x: x + 1, y },
    { x, y: y - 1 },
    { x, y: y + 1 },
  ];

  const adjacentSpaces = adjacentTiles.filter(({ x: cx, y: cy }) => {
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

const getRandomItems = (array, count) => {
  const items = [];
  const usedIndices = [];
  while (items.length < count) {
    const index = Math.floor(Math.random() * array.length);
    const randomItem = array[index];
    if (usedIndices.indexOf(index) === -1) {
      usedIndices.push(index);
      items.push(randomItem);
    }
  }
  return items;
};

const addRandomWaypoints = (count = 5) => {
  const validLocs = mapArray
    .flatMap((row, y) =>
      row.map((column, x) =>
        column > 0 && getAdjacentSpaces(x, y).length > 0 ? { x, y } : null
      )
    )
    .filter((coord) => coord !== null);

  const treasures = getRandomItems(lista, count).map((item) => {
    const victim = Math.floor(Math.random() * validLocs.length);
    const coords = getRandomEmptySpace(
      validLocs[victim].x,
      validLocs[victim].y
    );
    return { coords, item };
  });

  treasures.forEach((treasure) => {
    if (map.getWaypointsAt(treasure.coords).length < 3) {
      map.addWaypoint(treasure.item, treasure.coords);
    }
  });
};

const removeWaypoints = () => {
  while (map.waypoints.length) {
    map.removeWaypoint(0);
  }
};

(function addWaypointsUI() {
  const waypointUI = document.createElement("section");
  waypointUI.className = "waypoint-ui";

  const waypointCount = document.createElement("input");
  waypointCount.type = "number";
  waypointCount.value = 5;
  waypointCount.addEventListener("change", () => {
    if (waypointCount.value > lista.length) waypointCount.value = lista.length;
  });

  waypointUI.append(waypointCount);

  const addButton = document.createElement("button");
  addButton.innerText = "add waypoints";
  addButton.addEventListener("click", () => {
    addRandomWaypoints(waypointCount.value);
    waypointCounter.innerText = map.waypoints.length;
  });

  waypointUI.append(addButton);

  const removeButton = document.createElement("button");
  removeButton.innerText = "remove waypoints";
  removeButton.addEventListener("click", () => {
    removeWaypoints();
    waypointCounter.innerText = map.waypoints.length;
  });

  waypointUI.append(removeButton);

  const waypointCounter = document.createElement("div");
  waypointCounter.classList.add("waypoint-counter");

  waypointUI.append(waypointCounter);

  app.append(waypointUI);
})();
