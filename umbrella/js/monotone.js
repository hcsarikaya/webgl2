function monotoneTriangulate(vertices) {
    // Step 1: Sort vertices by y-coordinate in descending order
    const sortedVertices = vertices.map((v, i) => ({ x: v[0], y: v[1], index: i }))
        .sort((a, b) => b.y - a.y || a.x - b.x);
    console.log(sortedVertices)
    const stack = [];
    const triangles = [];

    // Push the first two vertices into the stack
    stack.push(sortedVertices[0].index);
    stack.push(sortedVertices[1].index);

    // Step 2: Sweep through the remaining vertices
    for (let i = 2; i < sortedVertices.length - 1; i++) {
        const currentVertex = sortedVertices[i];

        // Check if current vertex and top of the stack are on different chains
        if (isDifferentChain(sortedVertices, stack[stack.length - 1], currentVertex.index)) {
            // Triangulate with all vertices on the stack
            while (stack.length > 1) {
                const topVertex = stack.pop();
                triangles.push([stack[stack.length - 1], topVertex, currentVertex.index]);
            }
            stack.pop();
            stack.push(sortedVertices[i - 1].index);
            stack.push(currentVertex.index);
        } else {
            // Triangulate with the vertices on the same chain
            let lastPopped = stack.pop();
            while (stack.length > 0 && isConvex(currentVertex, lastPopped, stack[stack.length - 1], vertices)) {
                triangles.push([stack[stack.length - 1], lastPopped, currentVertex.index]);
                lastPopped = stack.pop();
            }
            stack.push(lastPopped);
            stack.push(currentVertex.index);
        }
    }

    // Step 3: Connect the remaining vertices
    const lastVertex = sortedVertices[sortedVertices.length - 1];
    while (stack.length > 1) {
        const topVertex = stack.pop();
        triangles.push([stack[stack.length - 1], topVertex, lastVertex.index]);
    }

    return triangles;
}

// Helper function to determine if two vertices are on different chains
function isDifferentChain(sortedVertices, topVertexIndex, currentVertexIndex) {
    // Check if they belong to different sides of the polygon
    return sortedVertices[topVertexIndex].x !== sortedVertices[currentVertexIndex].x;
}

// Helper function to check if the current angle is convex
function isConvex(currentVertex, prevVertex, lastVertexOnStack, vertices) {
    const a = vertices[prevVertex];
    const b = vertices[currentVertex];
    const c = vertices[lastVertexOnStack];

    const crossProduct = (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0]);
    return crossProduct > 0; // Positive cross-product means convex
}

// Example usage:

const polygonVertices = [ [ -0.5, 0.5 ], [ 0.5, 0.5 ], [ 0.25, 0.2 ], [ 0, 0.3 ] ];
const triangles = monotoneTriangulate(polygonVertices);
console.log('Triangles:', triangles);
