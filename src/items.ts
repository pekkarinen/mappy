class Thing {
  name:string
  description:string
  constructor(name:string, description:string) {
    this.name = name;
    this.description = description;
  }
}

class Feature extends Thing {
  backgroundColor:string
  constructor(name:string, description:string, backgroundColor:string) {
    super(name, description);
    this.backgroundColor = backgroundColor;
  }
}

export { Feature };
