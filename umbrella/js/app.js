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


    const numPoints = 10;
    // Control points for the top outward curve
    const topCurveP0 = [-0.5, 0.5];  // Starting point
    const topCurveP1 = [0, 0.8];     // Control point for maximum curvature
    const topCurveP2 = [0.5, 0.5];   // Ending point



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
    for (let i = 0; i < numPoints; i++) {
        const t = i / numPoints;
        topCurvePoints.push(getQuadraticBezierPoint(t, topCurveP0, topCurveP1, topCurveP2));
    }



// Generate points for the first inward curve
    let lowerCurve1Points = [];
    for (let i = 0; i < numPoints; i++) {
        const t = i / numPoints;
        lowerCurve1Points.push(getQuadraticBezierPoint(t, lowerCurve1P0, lowerCurve1P1, lowerCurve1P2));
    }


// Generate points for the second inward curve
    let lowerCurve2Points = [];
    for (let i = 0; i < numPoints; i++) {
        const t = i / numPoints;
        lowerCurve2Points.push(getQuadraticBezierPoint(t, lowerCurve2P0, lowerCurve2P1, lowerCurve2P2));
    }


    // Combine the points into one array to draw a closed shape
    let umbrellaShapePoints = topCurvePoints.concat(lowerCurve1Points, lowerCurve2Points);
    console.log(umbrellaShapePoints);
    /*
    const diagonals = makeYMonotone(umbrellaShapePoints);
    console.log("Diagonals to make the polygon y-monotone:", diagonals);
    const subPolys = splitPolygonIntoMonotoneParts(umbrellaShapePoints, diagonals)
    console.log("asdg")
    console.log(subPolys)
    // Combine all points for the umbrella shape into a flat array
    const umbrellaShapePointsFlat = umbrellaShapePoints.flat(); // Ensuring a flat array of vertices

// Triangulate the shape
    //const triangles = monotoneTriangulate(umbrellaShapePoints);

    subPolys.forEach(subPolygon => {
        const triangles = monotoneTriangulation(subPolygon);

        console.log(triangles);
        const triangleIndicesFlat = triangles.flat(); // Ensuring a flat array of indices

        const subPolygonflat = subPolygon.flat()
// Create the vertex buffer
        const vertexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(subPolygonflat), gl.STATIC_DRAW);

// Create the index buffer
        const indexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(triangleIndicesFlat), gl.STATIC_DRAW);

// Link the position attribute
        gl.enableVertexAttribArray(positionLocation);
        gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

// Set the color for the triangles
        gl.uniform4f(colorLocation, 0.8, 0.2, 0.2, 1.0); // Red color

// Clear the canvas before drawing
        gl.clear(gl.COLOR_BUFFER_BIT);

// Draw the triangles using the index buffer
        gl.drawElements(gl.TRIANGLES, triangleIndicesFlat.length, gl.UNSIGNED_SHORT, 0);
    });
    */
// Flatten the triangles into a single array of indices

    const triangulator = new PolygonTriangulation();
    const triangleVertices = triangulator.triangulate(umbrellaShapePoints);
    const vertexCount = triangulator.getVertexCount();

// WebGL setup and drawing
    const triangleBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, triangleBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(triangleVertices), gl.STATIC_DRAW);

// Draw the triangles
    gl.bindBuffer(gl.ARRAY_BUFFER, triangleBuffer);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(positionLocation);
    gl.drawArrays(gl.TRIANGLES, 0, vertexCount);




}


