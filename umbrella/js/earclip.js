

function isConvex(p1, p2, p3) {
    // Calculate the cross product to determine if the angle is convex
    const crossProduct = (p2[0] - p1[0]) * (p3[1] - p1[1]) - (p3[0] - p1[0]) * (p2[1] - p1[1]);
    return crossProduct > 0; // Positive means the angle is convex
}

function pointInTriangle(pt, p1, p2, p3) {
    const dX = pt[0] - p3[0];
    const dY = pt[1] - p3[1];
    const dX21 = p2[0] - p3[0];
    const dY12 = p1[1] - p3[1];
    const D = dY12 * (p1[0] - p3[0]) + dX21 * (p1[1] - p3[1]);
    const s = dY12 * dX + dX21 * dY;
    const t = (p3[1] - p1[1]) * dX + (p1[0] - p3[0]) * dY;
    return s >= 0 && t >= 0 && (s + t) <= D;
}

function earClipping(vertices) {
    const triangles = [];
    const vertexIndices = Array.from({ length: vertices.length / 2 }, (_, i) => i); // Vertex index list

    while (vertexIndices.length > 3) {
        let earFound = false;

        for (let i = 0; i < vertexIndices.length; i++) {
            const prev = (i - 1 + vertexIndices.length) % vertexIndices.length;
            const current = i;
            const next = (i + 1) % vertexIndices.length;

            const p1 = [vertices[vertexIndices[prev] * 2], vertices[vertexIndices[prev] * 2 + 1]];
            const p2 = [vertices[vertexIndices[current] * 2], vertices[vertexIndices[current] * 2 + 1]];
            const p3 = [vertices[vertexIndices[next] * 2], vertices[vertexIndices[next] * 2 + 1]];

            if (isConvex(p1, p2, p3)) {
                // Check if any other vertex lies inside this triangle
                let isEar = true;
                for (let j = 0; j < vertexIndices.length; j++) {
                    if (j !== prev && j !== current && j !== next) {
                        const p = [vertices[vertexIndices[j] * 2], vertices[vertexIndices[j] * 2 + 1]];
                        if (pointInTriangle(p, p1, p2, p3)) {
                            isEar = false; // Vertex inside, not a valid ear
                            break;
                        }
                    }
                }

                if (isEar) {
                    // Save the ear as a triangle
                    triangles.push(p1, p2, p3);
                    vertexIndices.splice(current, 1); // Remove the ear tip from the polygon
                    earFound = true;
                    break; // Start over to find the next ear
                }
            }
        }

        if (!earFound) {
            console.error("No valid ears found; the polygon might be too complex or not properly defined.");
            break;
        }
    }

    // Add the remaining triangle
    if (vertexIndices.length === 3) {
        const p1 = [vertices[vertexIndices[0] * 2], vertices[vertexIndices[0] * 2 + 1]];
        const p2 = [vertices[vertexIndices[1] * 2], vertices[vertexIndices[1] * 2 + 1]];
        const p3 = [vertices[vertexIndices[2] * 2], vertices[vertexIndices[2] * 2 + 1]];
        triangles.push(p1, p2, p3);
    }

    return triangles;
}
/*
// Example usage:
const triangles = earClipping(polygonVertices);
console.log("Triangles:", triangles);


// Create a buffer for the triangles
const triangleBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, triangleBuffer);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(triangles.flat()), gl.STATIC_DRAW);

// Draw the triangles
gl.bindBuffer(gl.ARRAY_BUFFER, triangleBuffer);
gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);
gl.enableVertexAttribArray(positionLocation);
gl.drawArrays(gl.TRIANGLES, 0, triangles.length); // Number of points = number of vertices in triangles
*/