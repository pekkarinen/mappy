import type * as CSS from 'csstype';

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
  private _text: string | null;

  constructor(
    name: string,
    description: string | null = null,
    appearance: CSS.Properties,
    text: string | null = null,
    className: string = 'feature'
  ) {
    super(name, description);
    this._appearance = appearance;
    this._className = className;
    this._text = text;
  }

  get appearance() {
    return this._appearance;
  }

  get className() {
    return this._className;
  }

  get text() {
    return this._text;
  }
}

export class Waypoint extends Feature {
  constructor(
    name: string,
    appearance: CSS.Properties,
    text: string | null = null,
    className?: string
  ) {
    super(name, null, appearance, text, className);
  }
}

export class Actor extends Feature {
  constructor(name: string) {
    const style = {
      fontSize: '32px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      textShadow: '3px 3px 6px rgba(0,0,0,0.2)',
      zIndex: 9999,
    };
    const symbol = '🤖';
    super(name, '', style, symbol, 'actor');
  }
}
