const particleVertexShader = `
uniform sampler2D uPositions;
uniform float uTime;
uniform vec2 uMouse;
uniform float uIntensity;
uniform float uSize;

varying vec3 vColor;
varying float vAlpha;

void main() {
  vec3 pos = texture2D(uPositions, position.xy).xyz;
  
  // Dynamic color based on height and movement
  float height = pos.y;
  float speed = length(pos - texture2D(uPositions, position.xy + vec2(0.01, 0.0)).xyz);
  
  // Color variations
  vColor = mix(
    vec3(0.2, 0.6, 1.0),  // Blue base
    vec3(1.0, 0.4, 0.8),  // Pink highlights
    clamp(height * 2.0 + speed * 10.0, 0.0, 1.0)
  );
  
  // Intensity-based alpha
  vAlpha = clamp(0.3 + speed * 5.0 + uIntensity * 0.5, 0.1, 1.0);
  
  vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
  gl_Position = projectionMatrix * mvPosition;
  
  // Dynamic particle size
  float baseSize = uSize * (1.0 + sin(uTime + position.x * 10.0) * 0.3);
  gl_PointSize = baseSize * (1.0 + speed * 20.0) * (300.0 / -mvPosition.z);
}
`;