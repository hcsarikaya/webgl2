


const vsSource = `#version 300 es
precision mediump float;

// This attribute gets the vertex position from your buffer
in vec2 a_position;

// This passes the position to the WebGL2 pipeline
void main() {
    gl_Position = vec4(a_position, 0.0, 1.0);
}
`;

const fsSource = `#version 300 es
precision mediump float;

// Color uniform to set the handle color
uniform vec4 u_color;

out vec4 outColor;

void main() {
    outColor = u_color;  // Set the color of the handle
}
`;