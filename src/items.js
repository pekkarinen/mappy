class Thing {
  constructor(name, description) {
    this.name = name;
    this.description = description;
  }
}

class Feature extends Thing {
  constructor(name, description, backgroundColor) {
    super(name, description);
    this.backgroundColor = backgroundColor;
  }
}

export { Feature };
