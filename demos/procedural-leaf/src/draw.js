import vec2 from "gl-vec2";
import randomFloat from "random-float";

// Try values 0 - 4 to visualize
// different steps in the algorithm.
const step = 2;

const start = [0.15, 0.85];
const end = [0.9, 0.15];
const control = [0.725, 0.525];

export function onClick() {
  // Choose a random point near the end of
  // the line that connects start -> end
  const t = randomFloat(0.5, 0.65);
  const point = vec2.lerp([], start, end, t);

  // Offset the point by some random radius
  const radius = randomFloat(0.2, 0.2);
  const offset = vec2.random([], radius);
  vec2.add(point, point, offset);

  // Set the control to this new point
  vec2.copy(control, point);
}

export function draw({ context, scale }) {
  // Draw the main stem
  const path = drawStem({
    context,
    start,
    control,
    end,
    radius: step <= 2 ? 0.025 : 0,
    stroke: step >= 1
  });

  if (step >= 2) {
    drawLeaves(context, path, step >= 4 ? 0 : 0.005);
  }
}

function drawStem(opt = {}) {
  const {
    context,
    start,
    control,
    end,
    segments = 20,
    radius = 0.02,
    stroke = true
  } = opt;

  // First, we draw the line that makes up this stem
  context.beginPath();
  context.moveTo(start[0], start[1]);
  if (control) {
    context.quadraticCurveTo(control[0], control[1], end[0], end[1]);
  } else {
    context.lineTo(end[0], end[1]);
  }
  if (stroke) {
    context.globalAlpha = 1;
    context.stroke();
  }

  // Now, draw the points that make up the stem
  if (radius > 0) {
    const points = [start, control, end].filter(Boolean);
    points.forEach((point, i) => {
      const size = (point === control ? 0.5 : 1) * radius;
      context.beginPath();
      context.arc(point[0], point[1], size, 0, Math.PI * 2, false);
      context.globalAlpha = 1;
      context.stroke();
    });

    if (control && stroke) {
      context.beginPath();
      context.moveTo(start[0], start[1]);
      context.lineTo(control[0], control[1]);
      context.lineTo(end[0], end[1]);
      context.globalAlpha = 0.15;
      context.stroke();
    }
  }

  // Now, get a discrete set of points along that curve
  const path = [];
  for (let i = 0; i < segments; i++) {
    const t = i / Math.max(1, segments - 1);
    const point = control
      ? quadraticCurve([], start, control, end, t)
      : vec2.lerp([], start, end, t);
    path.push(point);
  }
  return path;
}

function drawLeaves(context, stemPath, radius = 0.005) {
  // Now for each point in this stem, extrude out a leaf
  for (let i = 1; i < stemPath.length; i++) {
    const t = i / Math.max(stemPath.length - 1, 1);
    const current = stemPath[i];
    const previous = stemPath[i - 1];

    // Get the direction of the current line segment
    const normal = vec2.subtract([], current, previous);
    vec2.normalize(normal, normal);
    // Get its perpendicular
    const perpendicular = [-normal[1], normal[0]];
    // Extrude out in both directions
    const directions = [-1, 1];
    const leafWidth = 0.5;
    const leafShape = Math.sin(t * Math.PI);
    const extrudeDistance = leafShape * leafWidth / 2;
    directions.forEach(direction => {
      // angle the leaf outward
      const leafDirection = vec2.copy([], perpendicular);
      const angle = Math.atan2(leafDirection[1], leafDirection[0]);
      const newAngle = angle + 45 * Math.PI / 180 * -direction;
      vec2.set(leafDirection, Math.cos(newAngle), Math.sin(newAngle));

      // Create our new leaf stem, without a quadratic control point
      const leafEnd = vec2.scaleAndAdd(
        [],
        current,
        leafDirection,
        direction * extrudeDistance
      );
      drawStem({ context, start: current, end: leafEnd, radius });
    });
  }
}

// Discretize a quadratic curve, approximating the point at arclen "t"
function quadraticCurve(output = [], start, control, end, t) {
  const x1 = start[0];
  const y1 = start[1];
  const x2 = control[0];
  const y2 = control[1];
  const x3 = end[0];
  const y3 = end[1];

  const dt = 1 - t;
  const dtSq = dt * dt;
  const tSq = t * t;
  output[0] = dtSq * x1 + 2 * dt * t * x2 + tSq * x3;
  output[1] = dtSq * y1 + 2 * dt * t * y2 + tSq * y3;
  return output;
}
