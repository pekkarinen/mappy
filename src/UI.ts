import { Pathfinder } from './Pathfinder';
import { GridMap } from './Map';
import { Coords, MapArray, Waypoint } from './lib/types';

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

  addRandomWaypoints = (count = 5) => {
    const validLocs = this.mapArray
      .flatMap((row, y) =>
        row.map((column, x) =>
          column > 0 && this.getAdjacentSpaces({ x, y }).length > 0 ? { x, y } : null
        )
      )
      .filter((coord) => coord !== null);

    const treasures = this.getRandomItems(lista, count).map((item) => {
      const victim = Math.floor(Math.random() * validLocs.length);
      const coords = this.getRandomEmptySpace({ x: validLocs[victim].x, y: validLocs[victim].y });
      return { coords, item };
    });

    treasures.forEach((treasure) => {
      if (this.map.getWaypointsAt(treasure.coords).length < 3) {
        const waypoint = this.map.addFeature(
          {
            name: treasure.item,
            appearance: {
              border: '1px solid green',
            },
          },
          treasure.coords
        );
        waypoint.element.addEventListener('click', (e) => {
          e.preventDefault();
          this.getPathToWaypoint(waypoint);
        });
      }
    });

    this.waypointList.innerText = this.getWaypointsAsText(this.map.waypoints);
  };

  async getPathToWaypoint(waypoint: Waypoint) {
    const path = this.pathfinder.findPathTo(this.currentPos, waypoint.coords);
    const delay = 100;
    let accDelay = 0;
    return new Promise<number>((resolve) => {
      for (const node of path) {
        const [x, y] = node;
        const coords = { x, y };
        setTimeout(() => this.map.addFeature(null, coords), accDelay);
        accDelay += delay;
      }
      const [x, y] = path.at(-1);
      this.currentPos = { x, y };
      console.log(`${path.length}, ${accDelay}ms`);
      resolve(accDelay);
    });
  }

  getWaypointsAsText(waypoints: Array<Waypoint>) {
    return waypoints
      .map((waypoint) => `${waypoint.name} [${waypoint.coords.x}, ${waypoint.coords.y}]`)
      .join(', ');
  }

  removeWaypoints() {
    while (this.map.waypoints.length) {
      this.map.removeWaypoint(0);
    }
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
    button.addEventListener('click', (e) => func());
    return button;
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

    // const routeIndicator = document.createElement('div');
    // routeIndicator.innerText = 'foo';
    // waypointUI.append(routeIndicator);

    const routeButton = this.addUIButton('route', async () => {
      const waypoints = this.orderedWaypoints;
      waypoints.push({ name: 'goal', coords: this.goalPos });
      for (const waypoint of waypoints) {
        const delay = await this.getPathToWaypoint(waypoint);
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    });

    waypointUI.append(routeButton);

    const shortestButton = this.addUIButton('shortest', async () => {
      const waypoints = this.map.waypoints;
      // waypoints.push({ name: 'goal', coords: this.goalPos });
      const shortestRoute = this.pathfinder.orderWaypointsBrute(waypoints, this.startPos);
      shortestRoute.push({ name: 'goal', coords: this.goalPos });
      this.waypointList.innerText = `Shortest route: ${this.getWaypointsAsText(shortestRoute)}`;

      for (const waypoint of shortestRoute) {
        const delay = await this.getPathToWaypoint(waypoint);
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    });

    // waypointUI.append(shortestButton);

    const resetButton = this.addUIButton('reset', () => {
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
