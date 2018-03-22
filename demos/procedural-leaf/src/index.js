import { onClick, draw } from "./draw";

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
  canvas.style.height = `${height}px`;
  render();
}

// Handle resize & re-render events
resize();
window.addEventListener("resize", resize);

const handleClick = () => {
  onClick();
  render();
};

window.addEventListener("click", ev => {
  ev.preventDefault();
  handleClick();
});

window.addEventListener("touchstart", handleClick);
window.addEventListener("touchend", ev => ev.preventDefault());

function render() {
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
  draw({ context, width, height, scale, pixelRatio });

  // Reset for next draw call
  context.restore();
}
