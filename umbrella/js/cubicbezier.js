// Define control points for the cubic Bézier curve
const P0 = [-0.5, 0.5];  // Starting point of the curve
const P1 = [-0.25, 0.8]; // Control point 1
const P2 = [0.25, 0.8];  // Control point 2
const P3 = [0.5, 0.5];   // Ending point of the curve

// Function to calculate a point on the cubic Bézier curve
function getCubicBezierPoint(t, P0, P1, P2, P3) {
    const x = Math.pow(1 - t, 3) * P0[0] +
        3 * Math.pow(1 - t, 2) * t * P1[0] +
        3 * (1 - t) * Math.pow(t, 2) * P2[0] +
        Math.pow(t, 3) * P3[0];

    const y = Math.pow(1 - t, 3) * P0[1] +
        3 * Math.pow(1 - t, 2) * t * P1[1] +
        3 * (1 - t) * Math.pow(t, 2) * P2[1] +
        Math.pow(t, 3) * P3[1];

    return [x, y];
}

// Generate points along the curve
const numPoints = 100; // Number of points to create a smooth curve
let bezierPoints = [];
for (let i = 0; i <= numPoints; i++) {
    const t = i / numPoints; // Normalized parameter from 0 to 1
    bezierPoints.push(getCubicBezierPoint(t, P0, P1, P2, P3));
}

// Create a buffer for the curve points
const bezierBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, bezierBuffer);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(bezierPoints.flat()), gl.STATIC_DRAW);

// Use the points to draw a triangle fan for the umbrella fabric
gl.bindBuffer(gl.ARRAY_BUFFER, bezierBuffer);
gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);
gl.enableVertexAttribArray(positionLocation);

// Draw the fabric using TRIANGLE_FAN
gl.drawArrays(gl.TRIANGLE_FAN, 0, bezierPoints.length);

// Control points for the second curve (below the main curve)
const Q0 = [-0.5, 0.5];
const Q1 = [-0.2, 0.6];
const Q2 = [0.2, 0.6];
const Q3 = [0.45, 0.4];

// Control points for the third curve (even lower)
const R0 = [-0.4, 0.3];
const R1 = [-0.15, 0.5];
const R2 = [0.15, 0.5];
const R3 = [0.4, 0.3];

// Generate points for the second curve
let secondCurvePoints = [];
for (let i = 0; i <= numPoints; i++) {
    const t = i / numPoints;
    secondCurvePoints.push(getCubicBezierPoint(t, Q0, Q1, Q2, Q3));
}

// Generate points for the third curve
let thirdCurvePoints = [];
for (let i = 0; i <= numPoints; i++) {
    const t = i / numPoints;
    thirdCurvePoints.push(getCubicBezierPoint(t, R0, R1, R2, R3));
}

// Create buffer for the second curve
const secondCurveBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, secondCurveBuffer);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(secondCurvePoints.flat()), gl.STATIC_DRAW);

// Create buffer for the third curve
const thirdCurveBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, thirdCurveBuffer);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(thirdCurvePoints.flat()), gl.STATIC_DRAW);

// Draw the second curve
gl.bindBuffer(gl.ARRAY_BUFFER, secondCurveBuffer);
gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);
gl.enableVertexAttribArray(positionLocation);
gl.uniform4f(colorLocation, 0.7, 0.2, 0.2, 1.0); // Color for the second curve
gl.drawArrays(gl.TRIANGLE_FAN, 0, secondCurvePoints.length);

// Draw the third curve
gl.bindBuffer(gl.ARRAY_BUFFER, thirdCurveBuffer);
gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);
gl.enableVertexAttribArray(positionLocation);
gl.uniform4f(colorLocation, 0.9, 0.1, 0.1, 1.0); // Color for the third curve
gl.drawArrays(gl.TRIANGLE_FAN, 0, thirdCurvePoints.length);