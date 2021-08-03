const { factory, sequence, random } = require(".");

describe("Sequence", () => {
  const seq = sequence((value) => value);

  test("build", () => {
    expect(seq.build()).toEqual(expect.any(Number));
  });

  test("fixture", () => {
    expect(seq.fixture()).toEqual(42);
    expect(seq.fixture()).toEqual(42);
    expect(seq.fixture()).toEqual(42);
  });
});

describe("Random", () => {
  const age = random((chance) => chance.age());

  test("build", () => {
    expect(age.build()).toEqual(expect.any(Number));
  });

  test("fixture", () => {
    expect(age.fixture()).toEqual(35);
    expect(age.fixture()).toEqual(35);
    expect(age.fixture()).toEqual(35);
  });
});

describe("Factory", () => {
  const user = factory({
    id: 1,
    name: "Roy",
  });

  const post = factory({
    id: sequence((id) => id),
    value: sequence((value) => value),
    message: random((chance) => chance.word()),
  });

  const comment = factory({ user, post });

  test("build", () => {
    expect(user.build()).toEqual({ id: 1, name: "Roy" });
  });

  test("build with overrides", () => {
    expect(user.build({ id: 2 })).toEqual({ id: 2, name: "Roy" });
  });

  test("fixture", () => {
    expect(post.fixture()).toEqual({ id: 42, value: 43, message: "datefjo" });
    expect(post.fixture()).toEqual({ id: 42, value: 43, message: "datefjo" });
    expect(post.fixture()).toEqual({ id: 42, value: 43, message: "datefjo" });
  });

  test("prefers the override instead of a generator", () => {
    expect(post.build({ id: 99 })).toHaveProperty("id", 99);
    expect(post.build({ id: 99 })).toHaveProperty("id", 99);
  });

  test("deep overrides", () => {
    expect(comment.build({ user: { id: 99 } })).toHaveProperty("user", {
      id: 99,
      name: "Roy",
    });
  });

  test("throws for non-object", () => {
    expect(() => user.build(9)).toThrow(TypeError);
  });

  test("throws for invalid property", () => {
    expect(() => user.build({ foo: "bar" })).toThrow(TypeError);
  });
});

describe("ArrayFactory", () => {
  const user = factory({ id: 1 });
  const comment = factory({ user });

  test("build", () => {
    expect(user.array().build()).toEqual([{ id: 1 }]);
  });

  test("build with a count", () => {
    expect(user.array(2).build()).toEqual([{ id: 1 }, { id: 1 }]);
  });

  test("build with a number of overrides", () => {
    expect(user.array(1).build([{}, {}])).toEqual([{ id: 1 }, { id: 1 }]);
    expect(user.array(2).build([{}])).toEqual([{ id: 1 }]);
  });

  test("build with overrides", () => {
    expect(user.array().build([{ id: 6 }])).toEqual([{ id: 6 }]);
  });

  test("build with empty overrides", () => {
    expect(user.array().build([])).toEqual([]);
  });

  test("deep overrides", () => {
    const comments = comment.array().fixture([{ user: { id: 42 } }]);

    expect(comments).toHaveProperty("0.user.id", 42);
  });

  test("throws for non-array", () => {
    expect(() => user.array().build(9)).toThrow(TypeError);
  });
});
