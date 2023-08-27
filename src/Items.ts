import type * as CSS from 'csstype';
import { Coords } from './lib/types';

export class Thing {
  private _name: string;
  private _description: string | null;
  constructor(name: string, description: string | null) {
    this._name = name;
    this._description = description;
  }

  get name() {
    return this._name;
  }

  get description() {
    return this._description;
  }
}

export class Feature extends Thing {
  private _appearance: CSS.Properties;
  private _className: string;

  constructor(
    name: string,
    description: string | null,
    appearance: CSS.Properties,
    className: string = 'feature'
  ) {
    super(name, description);
    this._appearance = appearance;
    this._className = className;
  }

  get appearance() {
    return this._appearance;
  }

  get className() {
    return this._className;
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
