const { Chance } = require("chance");

function random() {
  return Math.floor(Math.random() * 1000);
}

function advance(n) {
  return n >= Number.MAX_SAFE_INTEGER ? 0 : n + 1;
}

function isPlainObject(value) {
  return Object.prototype.toString.call(value) === "[object Object]";
}

function isFactory(value) {
  return value instanceof BaseFactory;
}

function isGenerator(value) {
  return value instanceof BaseGenerator;
}

class BaseFactory {
  fixture(...args) {
    return this.produce(42, ...args)[0];
  }

  build(...args) {
    return this.produce(random(), ...args)[0];
  }
}

class BaseGenerator {
  fixture() {
    return this.produce(42)[0];
  }

  build() {
    return this.produce(random())[0];
  }
}

/**
 * This generates things that need to be unique.
 */
class Sequence extends BaseGenerator {
  constructor(fn) {
    super();
    this.fn = fn;
  }

  produce(seed) {
    return [this.fn(seed), advance(seed)];
  }
}

/**
 * This generates random data using Chance.js
 */
class Random extends BaseGenerator {
  constructor(name, args) {
    super();
    this.name = name;
    this.args = args;
  }

  produce(seed) {
    const chance = new Chance(seed);
    const fn = chance[this.name];
    const result = fn.apply(chance, ...this.args);
    return [result, advance(seed)];
  }
}

/**
 * This factory generates objects.
 */
class Factory extends BaseFactory {
  constructor(definition) {
    super();
    this.definition = definition;
  }

  array(n) {
    return new ArrayFactory(this, n);
  }

  extend(definition) {
    return new Factory({
      ...this.definition,
      ...definition,
    });
  }

  produce(seed, overrides = {}) {
    const result = {};

    if (!isPlainObject(overrides)) {
      throw new TypeError("Factory overrides must be an object");
    }

    for (const key of Object.keys(overrides)) {
      if (!(key in this.definition)) {
        throw new TypeError(
          `Factory received key '${key}', but no such property is defined`
        );
      }
    }

    for (let [key, definition] of Object.entries(this.definition)) {
      let value;

      if (isFactory(definition)) {
        [value, seed] = definition.produce(seed, overrides[key]);
      } else if (key in overrides) {
        value = overrides[key];
      } else if (isGenerator(definition)) {
        [value, seed] = definition.produce(seed);
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
class ArrayFactory extends BaseFactory {
  constructor(factory, count = 1) {
    super();
    this.factory = factory;
    this.count = count;
  }

  produce(seed, overrides = []) {
    if (!Array.isArray(overrides)) {
      throw new TypeError("Factory overrides must be an array");
    }

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

/**
 * Create a random value
 */
exports.random = new Proxy(
  {},
  {
    get: (_target, name) => (...args) => new Random(name, args),
  }
);
