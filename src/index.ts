import { GridMap } from './map';
import { Feature } from './items';
import { UI } from './UI';
import './mappy.css';

const app = document.createElement('div');
document.body.append(app);

const mapConfig = {
  height: 10,
  width: 10,
  tileSize: 64,
};

const map = new GridMap(mapConfig);

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

const mapArray: MapArray = [
  [0, 0, 1, 0, 1, 0, 1, 1, 1, 0],
  [0, 0, 1, 0, 2, 0, 1, 0, 1, 0],
  [0, 0, 0, 0, 2, 0, 0, 0, 0, 0],
  [1, 0, 1, 1, 1, 0, 2, 1, 1, 0],
  [1, 0, 0, 0, 0, 0, 0, 0, 1, 1],
  [1, 0, 2, 0, 2, 0, 0, 0, 0, 1],
  [0, 0, 2, 0, 2, 0, 2, 1, 0, 1],
  [1, 0, 2, 0, 2, 0, 0, 0, 0, 0],
  [1, 0, 0, 0, 0, 0, 1, 0, 1, 0],
  [1, 1, 2, 1, 1, 0, 1, 0, 1, 0],
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
const goalPos = { x: 0, y: 0 };

map.addFeature(start, startPos);
map.addFeature(end, goalPos);

new UI(app, mapArray, startPos, goalPos, map);
