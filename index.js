function random() {
  return Math.floor(Math.random() * Number.MAX_SAFE_INTEGER);
}

function advance(n) {
  return n >= Number.MAX_SAFE_INTEGER ? 0 : n + 1;
}

function isFactory(value) {
  return value instanceof AbstractFactory;
}

class AbstractFactory {
  fixture(...args) {
    return this.produce(42, ...args)[0];
  }

  build(...args) {
    return this.produce(random(), ...args)[0];
  }
}

/**
 * This factory generates things that need to be unique.
 */
class Sequence extends AbstractFactory {
  constructor(fn) {
    super();
    this.fn = fn;
  }

  produce(seed) {
    return [this.fn(seed), advance(seed)];
  }
}

/**
 * This factory generates objects.
 */
class Factory extends AbstractFactory {
  constructor(definition) {
    super();
    this.definition = definition;
  }

  array(number) {
    return new ArrayFactory(this, number);
  }

  produce(seed, overrides = {}) {
    const result = {};

    for (let [key, definition] of Object.entries(this.definition)) {
      let value;

      if (isFactory(definition)) {
        [value, seed] = definition.produce(seed, overrides[key]);
      } else if (key in overrides) {
        value = overrides[key];
      } else {
        value = definition;
      }

      result[key] = value;
    }

    return [result, seed];
  }
}

/**
 * This factory generates arrays of things.
 */
class ArrayFactory extends AbstractFactory {
  constructor(factory, count = 1) {
    super();
    this.factory = factory;
    this.count = count;
  }

  produce(seed, overrides = []) {
    const result = [];
    const count = overrides.length || this.count;

    let value;
    for (let i = 0; i < count; i++) {
      [value, seed] = this.factory.produce(seed, overrides[i]);
      result.push(value);
    }

    return [result, seed];
  }
}

/**
 * Create a factory
 */
exports.factory = (definition) => {
  return new Factory(definition);
};

/**
 * Create a sequence
 */
exports.sequence = (fn) => {
  return new Sequence(fn);
};
