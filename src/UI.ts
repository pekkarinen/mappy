import { Pathfinder } from './pathfinder';
import { GridMap } from './map';

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
        const waypoint = this.map.addWaypoint(treasure.item, treasure.coords);
        waypoint.element.addEventListener('click', (e) => {
          e.preventDefault();
          const path = this.pathfinder.findPathTo(this.currentPos, waypoint.coords);
          const delay = 100;
          path.map(([x, y], i) => {
            const coords = { x, y };
            var t = setTimeout(() => this.map.addWaypoint(null, coords), delay * i);
          });
          const [x, y] = path.at(-1);
          this.currentPos = { x, y };
        });
      }
    });

    this.waypointList.innerText = this.map.waypoints
      .map((waypoint) => `${waypoint.name} [${waypoint.coords.x}, ${waypoint.coords.y}]`)
      .join(', ');
  };

  removeWaypoints() {
    while (this.map.waypoints.length) {
      this.map.removeWaypoint(0);
    }
    this.currentPos = this.startPos;
    this.updateWaypointCount();
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
