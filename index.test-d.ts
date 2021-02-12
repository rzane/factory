import { ArrayFactory, Factory, Generator, factory, sequence, random } from ".";
import { expectError, expectType } from "tsd";

// Only primitive values can be supplied literally
expectError(factory({ id: {} }));

expectType<Generator<number>>(sequence((id) => id));
expectType<Generator<number>>(random((chance) => chance.age()));
expectType<Generator<number>>(random((chance) => chance.pickone([1, 2, 3])));

expectType<Factory<{ id: 1 }>>(factory({ id: 1 }));
expectType<{ id: 1 }>(factory({ id: 1 }).build());
expectType<{ id: 1 }>(factory({ id: 1 }).fixture());

expectType<Factory<{ id: number }>>(factory({ id: sequence((id) => id) }));
expectType<Factory<{ id: number }>>(
  factory({ id: random((chance) => chance.age()) })
);
expectType<Factory<{ user: { id: number } }>>(
  factory({ user: factory({ id: sequence((id) => id) }) })
);
expectType<Factory<{ users: Array<{ id: number }> }>>(
  factory({ users: factory({ id: sequence((id) => id) }).array() })
);

expectType<ArrayFactory<{ id: 1 }[]>>(factory({ id: 1 }).array());
expectType<Array<{ id: 1 }>>(factory({ id: 1 }).array().build());
expectType<Array<{ id: 1 }>>(factory({ id: 1 }).array().fixture());
