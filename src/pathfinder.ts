import { AStarFinder } from 'astar-typescript';

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

  findPathTo(startPos: Coords, endPos: Coords) {
    return this.aStarInstance.findPath(startPos, endPos);
  }
}

export { Pathfinder };
