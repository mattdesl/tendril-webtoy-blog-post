import vec2 from "gl-vec2";
import clamp from "clamp";

const clampScalar = (out = [], vec, min, max) => {
  out[0] = clamp(vec[0], min, max);
  out[1] = clamp(vec[1], min, max);
  return out;
};

export default class Vertex {
  constructor(position, { pinned } = {}) {
    this.position = position.slice();
    this.target = position.slice();
    this.velocity = [0, 0];
    this.maxVelocity = 0.005;
    this.spring = 0.01;
    this.friction = 0.95;

    // Re-use a temporary array to avoid GC thrashing
    this._temp = [0, 0];
  }

  update() {
    // Get delta vector to target
    const delta = vec2.subtract(this._temp, this.target, this.position);

    // Clamp velocity so simulation doesn't go wild
    clampScalar(
      this.velocity,
      this.velocity,
      -this.maxVelocity,
      this.maxVelocity
    );

    // Spring velocity toward new position
    vec2.scaleAndAdd(this.velocity, this.velocity, delta, this.spring);

    // Apply "air friction" to velocity
    vec2.scale(this.velocity, this.velocity, this.friction);

    // Set new position
    vec2.add(this.position, this.position, this.velocity);
  }

  addMouseInfluence(position, velocity, mouseRadius, mouseStrength) {
    // Get delta vector to target position
    const delta = vec2.subtract(this._temp, position, this.position);
    // Determine squard length
    const distSq = vec2.squaredLength(delta);
    // Are we inside the mouse radius?
    const radiusSq = mouseRadius * mouseRadius;
    if (distSq <= radiusSq) {
      // Based on how close we are to the radius
      const strength = 1 - clamp(Math.sqrt(distSq) / mouseRadius, 0, 1);
      vec2.scaleAndAdd(
        this.velocity,
        this.velocity,
        velocity,
        strength * mouseStrength
      );
    }
  }
}
