class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

class Triangle {
    constructor(p1, p2, p3) {
        this.p1 = p1;
        this.p2 = p2;
        this.p3 = p3;
        this.circumcircle = this.computeCircumcircle();
    }

    // Calculate the circumcircle of the triangle
    computeCircumcircle() {
        const ax = this.p1.x;
        const ay = this.p1.y;
        const bx = this.p2.x;
        const by = this.p2.y;
        const cx = this.p3.x;
        const cy = this.p3.y;

        const d = 2 * (ax * (by - cy) + bx * (cy - ay) + cx * (ay - by));
        const ux = ((ax * ax + ay * ay) * (by - cy) + (bx * bx + by * by) * (cy - ay) + (cx * cx + cy * cy) * (ay - by)) / d;
        const uy = ((ax * ax + ay * ay) * (cx - bx) + (bx * bx + by * by) * (ax - cx) + (cx * cx + cy * cy) * (bx - ax)) / d;

        const center = new Point(ux, uy);
        const radius = Math.sqrt((ux - ax) ** 2 + (uy - ay) ** 2);
        return { center, radius };
    }

    // Check if a point is inside the circumcircle of the triangle
    containsInCircumcircle(point) {
        const dx = this.circumcircle.center.x - point.x;
        const dy = this.circumcircle.center.y - point.y;
        return dx * dx + dy * dy < this.circumcircle.radius * this.circumcircle.radius;
    }
}

// Initialize the super triangle to cover all points
function createSuperTriangle(points) {
    const minX = Math.min(...points.map(p => p.x));
    const maxX = Math.max(...points.map(p => p.x));
    const minY = Math.min(...points.map(p => p.y));
    const maxY = Math.max(...points.map(p => p.y));

    const dx = maxX - minX;
    const dy = maxY - minY;
    const deltaMax = Math.max(dx, dy);
    const midX = (minX + maxX) / 2;
    const midY = (minY + maxY) / 2;

    const p1 = new Point(midX - 20 * deltaMax, midY - deltaMax);
    const p2 = new Point(midX, midY + 20 * deltaMax);
    const p3 = new Point(midX + 20 * deltaMax, midY - deltaMax);
    return new Triangle(p1, p2, p3);
}

// Bowyer-Watson Delaunay Triangulation Algorithm
function delaunayTriangulation(points) {
    const superTriangle = createSuperTriangle(points);
    let triangles = [superTriangle];

    for (const point of points) {
        let badTriangles = [];
        for (const triangle of triangles) {
            if (triangle.containsInCircumcircle(point)) {
                badTriangles.push(triangle);
            }
        }

        // Create a polygon of the boundary edges
        let polygon = [];
        for (const triangle of badTriangles) {
            triangles = triangles.filter(t => t !== triangle); // Remove the bad triangle
            const edges = [[triangle.p1, triangle.p2], [triangle.p2, triangle.p3], [triangle.p3, triangle.p1]];
            for (const edge of edges) {
                if (!polygon.some(e => (e[0] === edge[1] && e[1] === edge[0]))) {
                    polygon.push(edge);
                }
            }
        }

        // Re-triangulate the polygon with the new point
        for (const edge of polygon) {
            triangles.push(new Triangle(edge[0], edge[1], point));
        }
    }

    // Remove triangles that share vertices with the super triangle
    triangles = triangles.filter(triangle =>
        ![superTriangle.p1, superTriangle.p2, superTriangle.p3].some(p => [triangle.p1, triangle.p2, triangle.p3].includes(p))
    );

    return triangles;
}

// Example usage
const points = [
    new Point(100, 150),
    new Point(200, 300),
    new Point(250, 100),
    new Point(400, 200),
    new Point(150, 400),
];

const result = delaunayTriangulation(points);
console.log(result);
