import type * as CSS from 'csstype';
import { Coords } from './lib/types';

export class Thing {
  name: string;
  description: string | null;
  constructor(name: string, description: string | null) {
    this.name = name;
    this.description = description;
  }
}

export class Feature extends Thing {
  _appearance: CSS.Properties;
  constructor(name: string, description: string | null, appearance: CSS.Properties) {
    super(name, description);
    this._appearance = appearance;
  }

  get appearance() {
    return this._appearance;
  }
}

export class Waypoint extends Feature {
  _coords: Coords;
  constructor(name: string, appearance: CSS.Properties, coords: Coords) {
    super(name, null, appearance);
    this._coords = coords;
  }

  get coords() {
    return this._coords;
  }
}

export class Inventory {
  inventory: Array<Thing>;
}
