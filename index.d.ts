export interface Sequence<T> {
  build(): T;
  fixture(): T;
}

export interface Factory<T> {
  build(overrides?: Overrides<T>): T;
  fixture(overrides?: Overrides<T>): T;
}

type Primitive =
  | string
  | number
  | boolean
  | null
  | undefined
  | Date
  | Primitive[];

type Value<T> = T extends Primitive ? T : never;

export type Overrides<T> = {
  [P in keyof T]?: Overrides<T[P]>;
};

export type Definition<T> = {
  [K in keyof T]: Value<T[K]> | Factory<T[K]> | Sequence<T[K]>;
};

export function factory<T>(definition: Definition<T>): Factory<T>;
export function arrayOf<T>(factory: Factory<T>): Factory<T[]>;
export function sequence<T>(fn: (n: number) => T): T;
