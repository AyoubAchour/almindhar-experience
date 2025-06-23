const vert = `
attribute float aStartTime;
attribute vec3 aOffset;
uniform float uTime;
uniform vec3 uEmitterPos;
uniform float uLifetime;
uniform float uFade;

varying float vAge;
varying float vFade;

void main() {
  vAge = mod(uTime - aStartTime, uLifetime) / uLifetime;
  vFade = uFade;
  
  // Particle position: emitter + offset + velocity * age
  vec3 pos = uEmitterPos + aOffset;
  
  // Simulate forward movement (as if the camel was moving forward even when its physics position is fixed)
  float simulatedZMovement = 5.0 * vAge; // Stronger backward movement
  
  pos.x += 0.5 * (vAge - 0.5); // drift sideways
  pos.y += 0.1 * vAge - 0.5 * vAge * vAge; // up then down (gravity)
  pos.z += simulatedZMovement; // move particles backward (trailing behind)
  
  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  gl_PointSize = 32.0 * (1.0 - vAge); // fade out by shrinking
}
`;
export default vert; 