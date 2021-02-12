/**
 * Represents a value that is dynamically generated
 */
export interface Generator<T> {
  build(): T;
  fixture(): T;
}

/**
 * Represents an array
 */
export interface ArrayFactory<T> {
  build(overrides?: Overrides<T>[]): T[];
  fixture(overrides?: Overrides<T>[]): T[];
}

/**
 * Represents an object
 */
export interface Factory<T> {
  build(overrides?: Overrides<T>): T;
  fixture(overrides?: Overrides<T>): T;
  array(n?: number): ArrayFactory<T>;
  extend<R>(definition: Definition<R>): Factory<Extend<T, R>>;
}

/**
 * These values can be hardcoded in a factory.
 */
type Primitive =
  | string
  | number
  | boolean
  | null
  | undefined
  | Date
  | Primitive[];

/**
 * Filter a type so that it can only be a primitive.
 */
type Value<T> = T extends Primitive ? T : never;

type RandomFunctions = {
  [K in keyof Chance.Chance]: Chance.Chance[K] extends (...args: any[]) => any
    ? Chance.Chance[K]
    : never;
};

/**
 * Merges two types with the latter taking precidence.
 */
type Extend<A, B> = Omit<A, keyof B> & B;

/**
 * The options that can be passed to a factory to override the default values.
 */
export type Overrides<T> = {
  [P in keyof T]?: Overrides<T[P]>;
};

/**
 * The definition of a factory.
 */
export type Definition<T> = {
  [K in keyof T]:
    | Value<T[K]>
    | Generator<T[K]>
    | Factory<T[K]>
    | ArrayFactory<T[K]>;
};

/**
 * Create a new factory
 */
export function factory<T>(definition: Definition<T>): Factory<T>;

/**
 * Generates values in a sequence.
 */
export function sequence<T>(fn: (n: number) => T): Generator<T>;

/**
 * Generates a random value of a specified type.
 */
export function random<K extends keyof RandomFunctions>(
  name: K,
  ...args: Parameters<RandomFunctions[K]>
): Generator<ReturnType<RandomFunctions[K]>>;
