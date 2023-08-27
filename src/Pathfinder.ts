import { AStarFinder } from 'astar-typescript';
import { Coords, MapArray } from './lib/types';
import { Waypoint } from './Items';
import { MapFeature } from './Map';

function calculateDistance(point1: Coords, point2: Coords) {
  const dx = point2.x - point1.x;
  const dy = point2.y - point1.y;
  return Math.sqrt(dx * dx + dy * dy);
}

function orderWaypointsByDistance(waypoints: Array<MapFeature>, referencePoint: Coords) {
  return waypoints.slice().sort((waypoint1, waypoint2) => {
    const distance1 = calculateDistance(referencePoint, waypoint1.coords);
    const distance2 = calculateDistance(referencePoint, waypoint2.coords);
    return distance1 - distance2;
  });
}

function generatePermutations<T>(arr: T[]): T[][] {
  const result: T[][] = [];

  function backtrack(start: number): void {
    if (start === arr.length - 1) {
      result.push([...arr]);
      return;
    }

    for (let i = start; i < arr.length; i++) {
      [arr[start], arr[i]] = [arr[i], arr[start]];
      backtrack(start + 1);
      [arr[start], arr[i]] = [arr[i], arr[start]]; // Backtrack
    }
  }

  backtrack(0);
  return result;
}

class Pathfinder {
  private _walkableMatrix: MapArray;
  private aStarInstance: AStarFinder;

  constructor(map: MapArray) {
    this._walkableMatrix = map.map((row) =>
      row.map((column) => (column === 0 || typeof column === 'object' ? 0 : 1))
    );
    this.aStarInstance = new AStarFinder({
      grid: {
        matrix: this._walkableMatrix,
      },
      diagonalAllowed: false,
    });
  }

  get matrix() {
    return this._walkableMatrix;
  }

  orderWaypointsEuclid(waypoints: Array<MapFeature>, coords: Coords) {
    return orderWaypointsByDistance(waypoints, coords);
  }

  orderWaypointsBrute(waypoints: Array<MapFeature>, coords: Coords) {
    let shortestRoute: MapFeature[] = [];
    let shortestRouteLength = Infinity;

    const permutations = generatePermutations(waypoints);
    for (const permutation of permutations) {
      let currentPos = permutation[0].coords;
      let routeLength = 0;
      for (let i = 1; i < permutation.length; i++) {
        const path = this.findPathTo(currentPos, permutation[i].coords);
        routeLength += path.length;
        const [x, y] = path.at(-1) || [];
        currentPos = { x, y };
      }

      console.log('routeLength', routeLength);
      if (routeLength < shortestRouteLength) {
        shortestRoute = permutation;
        shortestRouteLength = routeLength;
      }
    }
    return shortestRoute;
  }

  findPathTo(startPos: Coords, endPos: Coords) {
    return this.aStarInstance.findPath(startPos, endPos);
  }
}

export { Pathfinder };
