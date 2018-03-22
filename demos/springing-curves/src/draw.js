import Vertex from "./Vertex";

const start = new Vertex([0.15, 0.85]);
const end = new Vertex([0.9, 0.15]);
const control = new Vertex([0.625, 0.225]);
const vertices = [start, end, control];

const mouseRadius = 0.1;
const mouseStrength = 0.0000045;

const drawPoint = (context, position, radius, alpha = 1) => {
  context.beginPath();
  context.globalAlpha = alpha;
  context.arc(position[0], position[1], radius, 0, Math.PI * 2, false);
  context.stroke();
};

export default function draw({ context, scale, mousePosition, mouseVelocity }) {
  // Draw mouse pointer & radius
  drawPoint(context, mousePosition, mouseRadius, 0.15);

  // Add the mouse influence and update each vertex
  vertices.forEach(v => {
    v.addMouseInfluence(
      mousePosition,
      mouseVelocity,
      mouseRadius,
      mouseStrength
    );
    v.update();
  });

  // Draw the stem formed by the vertices
  drawStem({
    context,
    start: start.position,
    control: control.position,
    end: end.position
  });
}

function drawStem(opt = {}) {
  const { context, start, control, end, radius = 0.02, stroke = true } = opt;

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
      drawPoint(context, point, size);
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
}
