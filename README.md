<h1 align="center">@stackup/factory</h1>

<div align="center">

![Build](https://github.com/rzane/factory/workflows/build/badge.svg)
![Version](https://img.shields.io/npm/v/@stackup/factory)
![Size](https://img.shields.io/bundlephobia/minzip/@stackup/factory)
![License](https://img.shields.io/npm/l/@stackup/factory)

</div>

## Install

    $ yarn add @stackup/factory --dev

## Usage

First, you'll need to define a factory:

```javascript
import { factory } from "@stackup/factory";

const UserFactory = factory({
  id: 1,
  name: "Rick",
});
```

Great, now to use that factory, just call the `build` method:

```javascript
UserFactory.build();
// { id: 1, name: "Rick" }
```

You can override some of the properties, too:

```javascript
UserFactory.build({ name: "Ray" });
// { id: 1, name: "Ray" }
```

Generate an array:

```javascript
UserFactory.array(2).build();
// [
//   { id: 1, name: "Rick" },
//   { id: 1, name: "Rick" }
// ]
```

Your factories can reuse other factories:

```javascript
const ProfileFactory = factory({
  user: UserFactory,
  friends: UserFactory.array(2),
});

ProfileFactory.build();
// {
//   user: { id: 1, name: "Rick" },
//   friends: [{ id: 1, name: "Rick" }, { id: 1, name: "Rick" }]
// }
```

Need something to be unique?

```javascript
import { sequence } from "@stackup/factory";

const UserFactory = factory({
  email: sequence((n) => `${n}@example.com`),
});

UserFactory.build();
// { email: "78@example.com" }

UserFactory.build();
// { email: "79@example.com" }
```

Want random data?

```javascript
import { random } from "@stackup/factory";

const UserFactory = factory({
  name: random((chance) => chance.name()),
});

UserFactory.build();
// { name: "Leona Floyd" }

UserFactory.build();
// { name: "Max Copeland" }
```

## Fixtures

If you're snapshot testing, random data will break your tests. In that case, you
can generate data deterministically:

```javascript
UserFactory.fixture();
// { name: "Abe" }

UserFactory.fixture();
// { name: "Abe" }
```
