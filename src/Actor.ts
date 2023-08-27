import { Thing } from './Items';
import { Coords } from './lib/types';

export class Actor extends Thing {
  private _coords: Coords;

  constructor(name: string, description: string, coords: Coords) {
    super(name, description);
    this._coords = coords;
  }

  get position() {
    return this._coords;
  }

  set position(coords: Coords) {
    this._coords = coords;
  }
}
