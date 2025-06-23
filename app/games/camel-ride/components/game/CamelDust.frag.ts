const frag = `
uniform sampler2D uMap;
varying float vAge;
varying float vFade;

void main() {
  vec4 tex = texture2D(uMap, gl_PointCoord);
  
  // Modified alpha calculation for better visibility
  float alpha = tex.a * (1.0 - vAge) * 0.8 * vFade; // Multiply by fade
  
  // Discard nearly transparent fragments
  if (alpha < 0.03) discard;
  
  // Light sand color with slight age-based color variation
  vec3 dustColor = mix(
    vec3(0.82, 0.75, 0.55), // Fresh dust (more yellow)
    vec3(0.75, 0.66, 0.48), // Older dust (more brown)
    vAge
  );
  
  gl_FragColor = vec4(dustColor, alpha); // Apply the sand color and fade out
}
`;
export default frag; 