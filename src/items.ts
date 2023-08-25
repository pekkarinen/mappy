class Thing {
  name: string;
  description: string;
  constructor(name: string, description: string) {
    this.name = name;
    this.description = description;
  }
}

class Feature extends Thing {
  background: string;
  constructor(name: string, description: string, background: string) {
    super(name, description);
    this.background = background;
  }
}

export { Feature };
