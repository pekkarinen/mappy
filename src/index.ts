import { GridMap } from './Map';
import { Feature } from './Items';
import { UI } from './UI';
import { MapArray } from './lib/types';
import './mappy.css';

const app = document.createElement('div');
app.classList.add('app');
document.body.append(app);

const mapConfig = {
  height: 10,
  width: 10,
  tileSize: 64,
};

const map = new GridMap(mapConfig);

app.append(map.DOMObject);

const start = new Feature('start', 'lähtö', { backgroundColor: 'green' });
const end = new Feature('goal', 'loppu', { backgroundColor: 'red' });
const kaytava = new Feature('Käytävä', '', {});
const tiski = new Feature('Tiski', 'tämmönen', { backgroundColor: 'darkgray' });
const kaappi = new Feature('Kaappi', 'semmonen', { backgroundColor: 'blue' });

const mapFeatures: Array<{ id: number; feature: Feature }> = [
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
      const mapFeature = mapFeatures.find((feature) => feature.id === column);
      if (mapFeature) {
        map.addFeature(mapFeature.feature, { x, y });
      }
    }
  });
});

const startPos = { x: 0, y: 0 };
const goalPos = { x: 9, y: 9 };

map.addFeature(start, startPos);
map.addFeature(end, goalPos);

/* ui */
new UI(app, mapArray, startPos, goalPos, map);
