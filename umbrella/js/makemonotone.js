// Sample polygon vertices (unsorted) in the specified format
/*const polygonVertices = [
    [-0.5, 0.5],
    [0.5, 0.5],
    [0.25, 0.2],
    [0, 0.3],
    [-0.25, 0.2],
];
*/
// Utility function to classify vertices based on the given polygon format
function classifyVertex(vertex, prevVertex, nextVertex) {
    const crossProduct = (nextVertex[0] - vertex[0]) * (prevVertex[1] - vertex[1]) -
        (nextVertex[1] - vertex[1]) * (prevVertex[0] - vertex[0]);

    if (vertex[1] >= prevVertex[1] && vertex[1] >= nextVertex[1] && crossProduct < 0) {
        return "start";
    } else if (vertex[1] <= prevVertex[1] && vertex[1] <= nextVertex[1] && crossProduct < 0) {
        return "end";
    } else if (vertex[1] >= prevVertex[1] && vertex[1] >= nextVertex[1]) {
        return "split";
    } else if (vertex[1] <= prevVertex[1] && vertex[1] <= nextVertex[1]) {
        return "merge";
    } else {
        return "regular";
    }
}

// Function to make the polygon y-monotone
function makeYMonotone(vertices) {
    // Step 1: Sort vertices by y-coordinate (then by x-coordinate if necessary)
    //vertices.sort((a, b) => b[1] === a[1] ? a[0] - b[0] : b[1] - a[1]);

    let status = new Map(); // Data structure to manage the sweep line status
    let diagonals = []; // Store the diagonals added

    for (let i = 0; i < vertices.length; i++) {
        const vertex = vertices[i];
        const prevVertex = vertices[(i - 1 + vertices.length) % vertices.length];
        const nextVertex = vertices[(i + 1) % vertices.length];

        const vertexType = classifyVertex(vertex, prevVertex, nextVertex);

        switch (vertexType) {
            case "start":
                handleStartVertex(vertex, status);
                break;
            case "end":
                handleEndVertex(vertex, status, diagonals);
                break;
            case "split":
                handleSplitVertex(vertex, status, diagonals);
                break;
            case "merge":
                handleMergeVertex(vertex, status, diagonals);
                break;
            case "regular":
                handleRegularVertex(vertex, status, diagonals);
                break;
        }
    }

    return diagonals; // Diagonals to make the polygon y-monotone
}

// Helper function to handle start vertices
function handleStartVertex(vertex, status) {
    // Add a new edge to the status structure
    status.set(vertex, { edge: null });
}

// Helper function to handle end vertices
function handleEndVertex(vertex, status, diagonals) {
    let edge = status.get(vertex);
    if (edge) {
        diagonals.push([vertex, edge]);
        status.delete(vertex);
    }
}

// Helper function to handle split vertices
function handleSplitVertex(vertex, status, diagonals) {
    let closestEdge = findClosestEdgeAbove(vertex, status);
    if (closestEdge) {
        diagonals.push([vertex, closestEdge]);
        status.set(vertex, { edge: closestEdge });
    }
}

// Helper function to handle merge vertices
function handleMergeVertex(vertex, status, diagonals) {
    let edge = status.get(vertex);
    if (edge) {
        diagonals.push([vertex, edge]);
        status.delete(vertex);
    }
}

// Helper function to handle regular vertices
function handleRegularVertex(vertex, status, diagonals) {
    let edge = status.get(vertex);
    if (edge) {
        // Update the status structure with the current edge
        status.set(vertex, { edge });
    }
}

// Utility function to find the closest edge above the vertex
function findClosestEdgeAbove(vertex, status) {
    let closestEdge = null;
    let minDistance = Infinity;
    for (let [v, data] of status) {
        let distance = Math.abs(v[1] - vertex[1]);
        if (distance < minDistance) {
            minDistance = distance;
            closestEdge = v;
        }
    }
    return closestEdge;
}

/*
function splitPolygonIntoMonotoneParts(vertices, diagonals) {
    // Split the polygon using each diagonal to create sub-polygons
    let subPolygons = [];

    // Assuming we have only one diagonal as an example
    const [pointA, pointB] = diagonals[0];

    // Split the original polygon into two parts using the diagonal
    let polygon1 = [];
    let polygon2 = [];
    let splitIndexA = vertices.findIndex(v => v[0] === pointA[0] && v[1] === pointA[1]);
    let splitIndexB = vertices.findIndex(v => v[0] === pointB[0] && v[1] === pointB[1]);

    if (splitIndexA < splitIndexB) {
        polygon1 = vertices.slice(splitIndexA, splitIndexB + 1);
        polygon2 = [...vertices.slice(splitIndexB), ...vertices.slice(0, splitIndexA + 1)];
    } else {
        polygon1 = vertices.slice(splitIndexB, splitIndexA + 1);
        polygon2 = [...vertices.slice(splitIndexA), ...vertices.slice(0, splitIndexB + 1)];
    }

    subPolygons.push(polygon1);
    subPolygons.push(polygon2);

    return subPolygons;
}
*/
/*
// Run the algorithm to make the polygon y-monotone
const diagonals = makeYMonotone(polygonVertices);
console.log("Diagonals to make the polygon y-monotone:", diagonals);

const subpol = splitPolygonIntoMonotoneParts(polygonVertices, diagonals)

console.log(subpol);
*/
