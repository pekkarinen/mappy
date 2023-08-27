import { Pathfinder } from './Pathfinder';
import { MapFeature, GridMap } from './Map';
import { Coords, MapArray } from './lib/types';
import { Waypoint } from './Items';

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

/* helper func */

class UI {
  private _currentPos: Coords;
  private _startPos: Coords;
  private _goalPos: Coords;
  private _pathfinder: Pathfinder;
  private _app: HTMLElement;
  private _mapArray: MapArray;
  private _map: GridMap;
  private _waypointCounter: HTMLElement;
  private _waypointList: HTMLElement;

  constructor(
    app: HTMLElement,
    mapArray: MapArray,
    startPos: Coords,
    goalPos: Coords,
    mapInstance: GridMap
  ) {
    this._pathfinder = new Pathfinder(mapArray);
    this._startPos = startPos;
    this._goalPos = goalPos;
    this._currentPos = startPos;
    this._app = app;
    this._mapArray = mapArray;
    this._map = mapInstance;
    this._waypointCounter;
    this._waypointList;
    this.addWaypointsUI();
  }

  get pathfinder() {
    return this._pathfinder;
  }

  get map() {
    return this._map;
  }

  get app() {
    return this._app;
  }

  get mapArray() {
    return this._mapArray;
  }

  get currentPos() {
    return this._currentPos;
  }

  get startPos() {
    return this._startPos;
  }

  get goalPos() {
    return this._goalPos;
  }

  get waypointCounter() {
    return this._waypointCounter;
  }

  get waypointList() {
    return this._waypointList;
  }

  set currentPos({ x, y }) {
    this._currentPos = { x, y };
  }

  getAdjacentSpaces = ({ x, y }: Coords) => {
    const adjacentTiles = [
      { x: x - 1, y },
      { x: x + 1, y },
      { x, y: y - 1 },
      { x, y: y + 1 },
    ];

    const adjacentSpaces = adjacentTiles.filter(({ x: cx, y: cy }) => {
      return (
        cx >= 0 &&
        cx < this.mapArray[0].length &&
        cy >= 0 &&
        cy < this.mapArray.length &&
        this.mapArray[cy][cx] === 0
      );
    });
    return adjacentSpaces;
  };

  getRandomEmptySpace = ({ x, y }: Coords) => {
    const emptyAdjacentSpaces = this.getAdjacentSpaces({ x, y });
    return emptyAdjacentSpaces[Math.floor(Math.random() * emptyAdjacentSpaces.length)];
  };

  getRandomItems = (items: Array<string>, count: number) => {
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

  getWaypointsAt(coords: Coords) {
    const waypoints = this.map
      .getFeaturesAt(coords)
      .filter((feature) => feature instanceof Waypoint);
    return waypoints;
  }

  addRandomWaypoints = (count = 5) => {
    const validLocs: Array<Coords> = [];
    this.mapArray.forEach((row, y) => {
      row.forEach((column, x) => {
        if (column > 0 && this.getAdjacentSpaces({ x, y }).length > 0) {
          validLocs.push({ x, y });
        }
      });
    });

    const treasures = this.getRandomItems(lista, count).map((item) => {
      const victim = Math.floor(Math.random() * validLocs.length);
      const coords = this.getRandomEmptySpace({ x: validLocs[victim].x, y: validLocs[victim].y });
      return { coords, item };
    });

    treasures.forEach((treasure) => {
      if (this.getWaypointsAt(treasure.coords).length < 3) {
        const waypoint = new Waypoint(
          treasure.item,
          {
            border: '1px solid green',
          },
          treasure.item,
          'waypoint'
        );
        const newWaypoint = this.map.addFeature(waypoint, treasure.coords);
        newWaypoint.element.addEventListener('click', (e) => {
          e.preventDefault();
          this.getPathToWaypoint(newWaypoint);
        });
      }
    });

    this.waypointList.innerText = this.getWaypointsAsText(this.map.waypoints);
  };

  async getPathToWaypoint(waypoint: MapFeature, step = '') {
    const path = this.pathfinder.findPathTo(this.currentPos, waypoint.coords);
    const delay = 100;
    let accDelay = 0;
    return new Promise<number>((resolve) => {
      for (const node of path) {
        const [x, y] = node;
        const coords = { x, y };
        const feature = new Waypoint(
          'path',
          {
            border: '1px solid goldenrod',
            background: 'rgba(255,0,0,0.1)',
          },
          step
        );
        setTimeout(() => {
          const actor = this.map.actor;
          if (actor) this.map.moveFeature(actor.id, coords);
          this.map.addFeature(feature, coords);
        }, accDelay);
        accDelay += delay;
      }
      const [x, y] = path.at(-1) || [];
      this.currentPos = { x, y };
      resolve(accDelay);
    });
  }

  getWaypointsAsText(waypoints: Array<MapFeature>) {
    return waypoints
      .map((waypoint) => `${waypoint.feature.name} [${waypoint.coords.x}, ${waypoint.coords.y}]`)
      .join(', ');
  }

  removeWaypoints() {
    this.map.waypoints.forEach((waypoint) => this.map.removeFeature(waypoint.id));
    this.currentPos = this.startPos;
    this.updateWaypointCount();
    this.waypointList.innerText = '';
  }

  updateWaypointCount() {
    this.waypointCounter.innerText = String(this.map.waypoints.length);
  }

  addUIButton(text: string, func: Function) {
    const button = document.createElement('button');
    button.innerText = text;
    button.addEventListener('click', () => func());
    return button;
  }

  async animateRoute(waypoints: Array<MapFeature>) {
    for (let i = 0; i < waypoints.length; i++) {
      const waypoint = waypoints[i];
      const delay = await this.getPathToWaypoint(waypoint, `${i}`);
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }

  get orderedWaypoints() {
    const orderedWaypoints = this.pathfinder.orderWaypointsEuclid(
      this.map.waypoints,
      this.currentPos
    );
    this.waypointList.innerText = `Sorted: ${this.getWaypointsAsText(orderedWaypoints)}`;
    return orderedWaypoints;
  }

  addWaypointsUI() {
    const waypointUI = document.createElement('section');
    waypointUI.className = 'waypoint-ui';

    const waypointCount = document.createElement('input') as HTMLInputElement;
    waypointCount.type = 'number';
    waypointCount.valueAsNumber = 5;
    waypointCount.addEventListener('change', () => {
      if (waypointCount.valueAsNumber > lista.length) waypointCount.valueAsNumber = lista.length;
    });

    waypointUI.append(waypointCount);

    const addButton = this.addUIButton('add waypoints', () => {
      this.addRandomWaypoints(waypointCount.valueAsNumber);
      this.updateWaypointCount();
    });

    waypointUI.append(addButton);

    const orderButton = this.addUIButton('order', () => {
      this.orderedWaypoints;
    });

    waypointUI.append(orderButton);

    const routeButton = this.addUIButton('route', async () => {
      const waypoints = this.orderedWaypoints;
      const goal = this.map.goal;
      if (goal) waypoints.push(goal);
      this.animateRoute(waypoints);
    });

    waypointUI.append(routeButton);

    const smartButton = this.addUIButton('smart', async () => {
      const currentPos = this.map.actor?.coords;
      if (currentPos) {
        const waypoints = this.orderedWaypoints;
        const shortestFirst = waypoints.reduce(
          (prev, curr, index) => {
            const route = this.pathfinder.findPathTo(currentPos, curr.coords);
            if (route.length < prev.length) return { index, route, length: route.length };
            return prev;
          },
          { index: 0, route: [], length: Infinity }
        );
        console.log(shortestFirst);
      }
    });

    waypointUI.append(smartButton);

    const resetButton = this.addUIButton('reset', () => {
      const actor = this.map.actor;
      if (actor) this.map.moveFeature(actor.id, this.startPos);
      this.removeWaypoints();
    });

    waypointUI.append(resetButton);

    this._waypointCounter = document.createElement('div');
    this.waypointCounter.classList.add('waypoint-counter');

    waypointUI.append(this.waypointCounter);

    this._waypointList = document.createElement('div');
    this._waypointList.classList.add('waypoint-list');

    this.app.append(waypointUI);
    this.app.append(this._waypointList);
  }
}

export { UI };
