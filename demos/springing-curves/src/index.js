import draw from "./draw";

// A simple touch utility
import touches from "touches";
import TouchVelocity from "touch-velocity";

const canvas = document.querySelector("#canvas");
const context = canvas.getContext("2d");

let width, height;

const aspect = 1;
const displayPadding = 40;
const pixelRatio = window.devicePixelRatio;

// Scale the canvas so it is crisp and centred
function resize() {
  const windowWidth = window.innerWidth;
  const windowHeight = window.innerHeight;
  const windowAspect = windowWidth / windowHeight;

  if (windowAspect > aspect) {
    height = windowHeight - displayPadding * 2;
    width = height * aspect;
  } else {
    width = windowWidth - displayPadding * 2;
    height = width / aspect;
  }

  canvas.width = width * pixelRatio;
  canvas.height = height * pixelRatio;
  canvas.style.width = `${width}px`;
}

// Setup mouse & velocity events
const velocities = [new TouchVelocity(), new TouchVelocity()];
const mousePosition = [-2, -2]; // Start off-screen

touches(window, {
  filtered: true,
  target: canvas
}).on("move", (ev, pos) => {
  mousePosition[0] = pos[0] / width;
  mousePosition[1] = pos[1] / height;

  // Update mouse velocity
  velocities.forEach((v, i) => v.updatePosition(pos[i]));
});

// Handle resize & re-render events
resize();
window.addEventListener("resize", resize);

// Start render loop
render();
window.requestAnimationFrame(render);

function render() {
  window.requestAnimationFrame(render);
  const size = [width, height];

  // Get current mouse velocity
  const mouseVelocity = velocities.map(v => v.getVelocity());

  // Save state
  context.save();

  // Setup pixel density scaling
  context.scale(pixelRatio, pixelRatio);

  // Clear background
  context.clearRect(0, 0, width, height);

  context.fillStyle = "white";
  context.fillRect(0, 0, width, height);

  // Normalize unit to 0..1
  const scale = width > height ? width : height;
  context.scale(scale, scale);

  // Reset properties
  context.lineWidth = 1 / scale;
  context.fillStyle = context.strokeStyle = "black";

  // Render scene
  draw({
    context,
    width,
    height,
    scale,
    pixelRatio,
    mousePosition,
    mouseVelocity
  });

  // Reset for next draw call
  context.restore();
}
