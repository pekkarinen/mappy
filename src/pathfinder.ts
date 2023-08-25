import { AStarFinder } from 'astar-typescript';

function calculateDistance(point1: Coords, point2: Coords) {
  const dx = point2.x - point1.x;
  const dy = point2.y - point1.y;
  return Math.sqrt(dx * dx + dy * dy);
}

function orderWaypointsByDistance(waypoints: Array<Waypoint>, referencePoint: Coords) {
  return waypoints.slice().sort((waypoint1, waypoint2) => {
    const distance1 = calculateDistance(referencePoint, waypoint1.coords);
    const distance2 = calculateDistance(referencePoint, waypoint2.coords);
    return distance1 - distance2;
  });
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

  orderWaypointsEuclid(waypoints: Array<Waypoint>, coords: Coords) {
    return orderWaypointsByDistance(waypoints, coords);
  }

  findPathTo(startPos: Coords, endPos: Coords) {
    return this.aStarInstance.findPath(startPos, endPos);
  }
}

export { Pathfinder };
