import { Map } from './map';
import { Feature } from './items';
import { AStarFinder } from 'astar-typescript';
import './mappy.css';

const app = document.createElement('div');
document.body.append(app);

const mapConfig = {
  height: 10,
  width: 10,
  tileSize: 64,
};

const map = new Map(mapConfig);

app.append(map.DOMObject);

const start = new Feature('Start', 'lähtö', 'green');
const end = new Feature('Exit', 'loppu', 'red');
const kaytava = new Feature('Käytävä', '', '');
const tiski = new Feature('Tiski', 'tämmönen', 'gray');
const kaappi = new Feature('Kaappi', 'semmonen', 'blue');
const mapFeatures = [
  {
    id: 0,
    feature: kaytava,
  },
  {
    id: 1,
    feature: tiski,
  },
  {
    id: 2,
    feature: kaappi,
  },
  {
    id: 3,
    feature: start,
  },
  {
    id: 4,
    feature: end,
  },
];

const mapArray = [
  [3, 0, 1, 0, 1, 0, 1, 1, 1, 0],
  [0, 0, 1, 0, 2, 0, 1, 0, 1, 0],
  [0, 0, 0, 0, 2, 0, 0, 0, 0, 0],
  [1, 0, 1, 1, 1, 0, 2, 1, 1, 0],
  [1, 0, 0, 0, 0, 0, 0, 0, 1, 1],
  [1, 0, 2, 0, 2, 0, 0, 0, 0, 1],
  [0, 0, 2, 0, 2, 0, 2, 1, 0, 1],
  [1, 0, 2, 0, 2, 0, 0, 0, 0, 0],
  [1, 0, 0, 0, 0, 0, 1, 0, 1, 0],
  [1, 1, 2, 1, 1, 0, 1, 0, 1, 4],
];

mapArray.forEach((row, y) => {
  row.forEach((column, x) => {
    if (column > 0) {
      const { feature } = mapFeatures.find((feature) => feature.id === column);
      map.addFeature(feature, { x, y });
    }
  });
});

const startPos = { x: 0, y: 0 };
const endPos = { x: 9, y: 9 };

/* pathfinding mocks */
const matrix = mapArray.map((row) =>
  row.map((column) => (column === 0 || typeof column === 'object' ? 0 : 1))
);

const pathFinder = new AStarFinder({
  grid: {
    width: 10,
    height: 10,
    matrix,
  },
});

const pathResult = pathFinder.findPath(startPos, endPos);

/* end pathfinding */
/* data mockup */

/* helper func */
const getAdjacentSpaces = ({ x, y }: Coords) => {
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

const getRandomEmptySpace = ({ x, y }: Coords) => {
  const emptyAdjacentSpaces = getAdjacentSpaces({ x, y });
  return emptyAdjacentSpaces[Math.floor(Math.random() * emptyAdjacentSpaces.length)];
};

const lista = [
  'jauho',
  'perunoi',
  'sokeri',
  'omeno',
  'sukat',
  'maito',
  'piimä',
  'juustu',
  'pipot',
  'ohra',
  'vehnä',
  'herne',
  'sinep',
  'ketsup',
  'salaat',
  'pasta',
  'vihvit',
  'nakki',
  'makkur',
  'olutta',
];

const getRandomItems = (items: Array<string>, count: number) => {
  const randomItems = [];
  const usedIndices = [];
  while (randomItems.length < count) {
    const index = Math.floor(Math.random() * items.length);
    const randomItem = items[index];
    if (usedIndices.indexOf(index) === -1) {
      usedIndices.push(index);
      randomItems.push(randomItem);
    }
  }
  return randomItems;
};

const addRandomWaypoints = (count = 5) => {
  const validLocs = mapArray
    .flatMap((row, y) =>
      row.map((column, x) =>
        column > 0 && getAdjacentSpaces({ x, y }).length > 0 ? { x, y } : null
      )
    )
    .filter((coord) => coord !== null);

  const treasures = getRandomItems(lista, count).map((item) => {
    const victim = Math.floor(Math.random() * validLocs.length);
    const coords = getRandomEmptySpace({ x: validLocs[victim].x, y: validLocs[victim].y });
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
  const waypointUI = document.createElement('section');
  waypointUI.className = 'waypoint-ui';

  const waypointCount = document.createElement('input') as HTMLInputElement;
  waypointCount.type = 'number';
  waypointCount.valueAsNumber = 5;
  waypointCount.addEventListener('change', () => {
    if (waypointCount.valueAsNumber > lista.length) waypointCount.valueAsNumber = lista.length;
  });

  waypointUI.append(waypointCount);

  const updateWaypointCount = () => {
    waypointCounter.innerText = String(map.waypoints.length);
  };

  const addButton = document.createElement('button');
  addButton.innerText = 'add waypoints';
  addButton.addEventListener('click', () => {
    addRandomWaypoints(waypointCount.valueAsNumber);
    updateWaypointCount();
  });

  waypointUI.append(addButton);

  const removeButton = document.createElement('button');
  removeButton.innerText = 'remove waypoints';
  removeButton.addEventListener('click', () => {
    removeWaypoints();
    updateWaypointCount();
  });

  waypointUI.append(removeButton);

  const waypointCounter = document.createElement('div');
  waypointCounter.classList.add('waypoint-counter');

  waypointUI.append(waypointCounter);

  app.append(waypointUI);
})();
