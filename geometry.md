### Point along path

```js
const point = vec2.lerp([], start, end, t);
```

### Unit Normal of Line Segment

In this context, the `normal` will also be known as a unit vector.

```js
const normal = vec2.subtract([], end, start);
vec2.normalize(normal, normal);
```

### Perpendicular of Line Segment

Use the `normal` as defined above.

```js
const perpendicular = [ -normal[1], normal[0] ];
```

### Angle of Vector

```js
const normal = vec2.normalize([], position);
const angle = Math.atan(normal[1], normal[0]);
```

### Unit Vector From Angle

```js
const normal = [ Math.cos(angle), Math.sin(angle) ];
```

### Push Along Vector by Length

For example, if you wish to move an entity by 2 units away from `origin` point and in the direction of a unit vector (i.e. a `normal`).

```js
const length = 3;
const position = vec2.scaleAndAdd([], origin, normal, length);
```

### Create a Polygon (Triangle, Diamond, Square, Circle, etc)

// Center point of the circle
const cx = 0;
const cy = 0;

// # of sides of our polygon
const sides = 6;

const points = [];
for (let i = 0; i < sides; i++) {
  // Get arc length between 0 (inclusive) and 1 (exclusive)
  const t = i / sides;

  // Get current angle of a full circle (2PI)
  const angle = t * Math.PI * 2;

  // This gives us a unit circle
  const x = Math.cos(angle);
  const y = Math.sin(angle);

  // Scale the unit circle to our desired radius
  const rx = x * radius;
  const ry = y * radius;

  // Translate the scaled circle to a desired position
  const px = rx + cx;
  const py = ry + cy;

  // Add the point
  points.push([ px, py ]);
}