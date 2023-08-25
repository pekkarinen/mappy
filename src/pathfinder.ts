import { AStarFinder } from 'astar-typescript';

const pathFinder = new AStarFinder({
  grid: {
    width: 10,
    height: 10,
    matrix,
  },
});

/* pathfinding mocks */
const matrix = mapArray.map((row) =>
  row.map((column) => (column === 0 || typeof column === 'object' ? 0 : 1))
);


const pathResult = pathFinder.findPath(startPos, endPos);

