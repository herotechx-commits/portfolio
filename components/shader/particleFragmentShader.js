const particleFragmentShader = `
varying vec3 vColor;
varying float vAlpha;

void main() {
  vec2 center = gl_PointCoord - vec2(0.5);
  float dist = length(center);
  
  // Soft circular particles with glow
  float alpha = (1.0 - smoothstep(0.2, 0.5, dist)) * vAlpha;
  
  // Add inner glow
  float glow = exp(-dist * 8.0) * 0.5;
  
  vec3 finalColor = vColor + vec3(glow);
  gl_FragColor = vec4(finalColor, alpha);
}
`;
