"use strict";


window.onload = function init() {
    // This code runs after the page is fully loaded
    main();
};

function main() {
    const canvas = document.getElementById( "gl-canvas" );
    const gl = canvas.getContext("webgl2");
    
    if(!gl) {
        alert("Unable to initialize Webgl. Your browser or machine may not support it.");
        return ;
    }
    
    gl.clearColor(1.0, 1.0, 1.0, 1.0);
    //gl.clear(gl.COLOR_BUFFER_BIT);
    gl.fClear = function(){ this.clear(this.COLOR_BUFFER_BIT | this.DEPTH_BUFFER_BIT); return this; }


    const program = initShaderProgram(gl, vsSource, fsSource);

    const handleVertices = new Float32Array([
        -0.05, -0.5,  // Bottom left
        0.05, -0.5,  // Bottom right
        0.05,  0.0,  // Top right
        -0.05,  0.0   // Top left
    ]);



    const handleBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, handleBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, handleVertices, gl.STATIC_DRAW);


    
    gl.useProgram(program);
    const positionLocation = gl.getAttribLocation(program, "a_position");
    gl.enableVertexAttribArray(positionLocation);
    gl.bindBuffer(gl.ARRAY_BUFFER, handleBuffer);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

    const colorLocation = gl.getUniformLocation(program, "u_color");
    gl.uniform4f(colorLocation, 0.5, 0.25, 0.1, 1.0); // Brown color for the handle


    gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);


    const numPoints = 100;
    // Control points for the top outward curve
    const topCurveP0 = [-0.5, 0.5];  // Starting point
    const topCurveP1 = [-0.3, 0.8];     // Control point for maximum curvature
    const topCurveP2 = [0, 0.7];   // Ending point

    const topCurve2P0 = [0, 0.75];  // Starting point
    const topCurve2P1 = [0.3, 0.8];     // Control point for maximum curvature
    const topCurve2P2 = [0.5, 0.5];   // Ending point

    // Control points for the first inward curve (left side)
    const lowerCurve1P0 = [0.5, 0.5];  // Starting point (same as top curve end)
    const lowerCurve1P1 = [0.25, 0.6]; // Control point pulling inward
    const lowerCurve1P2 = [0, 0.5];     // Mid-point to connect to the next curve

// Control points for the second inward curve (right side)
    const lowerCurve2P0 = [0, 0.5];     // Starting point (connects to the first inward curve)
    const lowerCurve2P1 = [-0.25, 0.6];  // Control point pulling inward
    const lowerCurve2P2 = [-0.5, 0.5];   // Ending point (same as top curve end)

    // Function to calculate points on a quadratic Bézier curve
    function getQuadraticBezierPoint(t, P0, P1, P2) {
        const x = (1 - t) * (1 - t) * P0[0] + 2 * (1 - t) * t * P1[0] + t * t * P2[0];
        const y = (1 - t) * (1 - t) * P0[1] + 2 * (1 - t) * t * P1[1] + t * t * P2[1];
        return [x, y];
    }

// Generate points for the top outward curve
    let topCurvePoints = [];
    for (let i = 0; i <= numPoints; i++) {
        const t = i / numPoints;
        topCurvePoints.push(getQuadraticBezierPoint(t, topCurveP0, topCurveP1, topCurveP2));
    }

    let topCurvePoints2 = [];
    for (let i = 0; i <= numPoints; i++) {
        const t = i / numPoints;
        topCurvePoints.push(getQuadraticBezierPoint(t, topCurve2P0, topCurve2P1, topCurve2P2));
    }

// Generate points for the first inward curve
    let lowerCurve1Points = [];
    for (let i = 0; i <= numPoints; i++) {
        const t = i / numPoints;
        lowerCurve1Points.push(getQuadraticBezierPoint(t, lowerCurve1P0, lowerCurve1P1, lowerCurve1P2));
    }


// Generate points for the second inward curve
    let lowerCurve2Points = [];
    for (let i = 0; i <= numPoints; i++) {
        const t = i / numPoints;
        lowerCurve2Points.push(getQuadraticBezierPoint(t, lowerCurve2P0, lowerCurve2P1, lowerCurve2P2));
    }
    let newCenterPoint = [0, 0.7]; // Assuming you want to make P1 the new center
    let reorderedPoints = [newCenterPoint].concat(
        topCurvePoints,
        topCurvePoints2,
        lowerCurve1Points,
        lowerCurve2Points
    );

    // Combine the points into one array to draw a closed shape
    let umbrellaShapePoints = topCurvePoints.concat(lowerCurve1Points, lowerCurve2Points);

    console.log(umbrellaShapePoints)
    // Create buffer for the umbrella shape points
    const umbrellaBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, umbrellaBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(reorderedPoints.flat()), gl.STATIC_DRAW);

// Draw the umbrella shape
    gl.bindBuffer(gl.ARRAY_BUFFER, umbrellaBuffer);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(positionLocation);

// Set the color for the umbrella fabric
    gl.uniform4f(colorLocation, 0.8, 0.2, 0.2, 1.0); // Red color for the fabric
    gl.drawArrays(gl.TRIANGLE_FAN, 0, reorderedPoints.length);




}


