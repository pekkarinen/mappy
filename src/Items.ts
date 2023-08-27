import type * as CSS from 'csstype';

export class Thing {
  name: string;
  description: string;
  constructor(name: string, description: string) {
    this.name = name;
    this.description = description;
  }
}

export class Feature extends Thing {
  _appearance: CSS.Properties;
  constructor(name: string, description: string, appearance: CSS.Properties) {
    super(name, description);
    this._appearance = appearance;
  }

  get appearance() {
    return this._appearance;
  }
}

export class Waypoint extends Feature {}

export class Inventory {
  inventory: Array<Thing>;
}
