class PolygonTriangulation {
    constructor() {
        this.triangles = [];
    }

    static getSignedArea(vertices) {
        let area = 0;
        for (let i = 0; i < vertices.length; i++) {
            const j = (i + 1) % vertices.length;
            area += vertices[i][0] * vertices[j][1];
            area -= vertices[j][0] * vertices[i][1];
        }
        return area / 2;
    }

    static makeCounterClockwise(vertices) {
        const signedArea = this.getSignedArea(vertices);
        return signedArea < 0 ? vertices.reverse() : [...vertices];
    }

    static isConvex(prev, current, next) {
        const dx1 = current[0] - prev[0];
        const dy1 = current[1] - prev[1];
        const dx2 = next[0] - current[0];
        const dy2 = next[1] - current[1];
        return dx1 * dy2 - dy1 * dx2 > 0;
    }

    static isPointInTriangle(point, triangle) {
        const [x, y] = point;
        const [[x1, y1], [x2, y2], [x3, y3]] = triangle;

        const denominator = ((y2 - y3) * (x1 - x3) + (x3 - x2) * (y1 - y3));
        const a = ((y2 - y3) * (x - x3) + (x3 - x2) * (y - y3)) / denominator;
        const b = ((y3 - y1) * (x - x3) + (x1 - x3) * (y - y3)) / denominator;
        const c = 1 - a - b;

        const epsilon = 1e-10;
        return a >= -epsilon && b >= -epsilon && c >= -epsilon;
    }

    static isEar(i, vertices) {
        const n = vertices.length;
        const prev = vertices[(i - 1 + n) % n];
        const current = vertices[i];
        const next = vertices[(i + 1) % n];

        if (!this.isConvex(prev, current, next)) {
            return false;
        }

        const triangle = [prev, current, next];

        for (let j = 0; j < vertices.length; j++) {
            if (j === (i - 1 + n) % n || j === i || j === (i + 1) % n) continue;
            if (this.isPointInTriangle(vertices[j], triangle)) {
                return false;
            }
        }

        return true;
    }

    triangulate(inputVertices) {
        if (inputVertices.length < 3) return [];

        this.triangles = [];
        let vertices = PolygonTriangulation.makeCounterClockwise([...inputVertices]);

        while (vertices.length > 3) {
            const n = vertices.length;
            let earFound = false;

            for (let i = 0; i < n; i++) {
                if (PolygonTriangulation.isEar(i, vertices)) {
                    this.triangles.push([
                        vertices[(i - 1 + n) % n],
                        vertices[i],
                        vertices[(i + 1) % n]
                    ]);

                    vertices.splice(i, 1);
                    earFound = true;
                    break;
                }
            }

            if (!earFound) {
                vertices.reverse();
                if (this.triangles.length === 0) {
                    console.error("Unable to triangulate polygon. Please check vertex order.");
                    return [];
                }
                break;
            }
        }

        if (vertices.length === 3) {
            this.triangles.push(vertices);
        }

        // Convert triangles to WebGL-compatible format (flattened array of vertices)
        return this.getWebGLVertices();
    }

    // New method to get vertices in WebGL-compatible format
    getWebGLVertices() {
        // Flatten the triangles into a single array of vertices
        return this.triangles.flat().flat();
    }

    // Get the number of vertices (for drawArrays)
    getVertexCount() {
        return this.triangles.length * 3; // 3 vertices per triangle
    }
}