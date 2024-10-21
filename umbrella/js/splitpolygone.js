function splitPolygonIntoMonotoneParts(vertices, diagonals) {
    let subPolygons = [vertices]; // Start with the whole polygon

    // Iterate over each diagonal to split the existing polygons
    for (const [pointA, pointB] of diagonals) {
        let newSubPolygons = [];

        for (const polygon of subPolygons) {
            // Check if the diagonal splits the current polygon
            const [polygon1, polygon2] = splitPolygon(polygon, pointA, pointB);
            newSubPolygons.push(polygon1);
            newSubPolygons.push(polygon2);
        }

        // Update the list of sub-polygons
        subPolygons = newSubPolygons;

    }

    return subPolygons.filter(p => p.length > 0); // Filter out any empty polygons
}

function splitPolygon(polygon, pointA, pointB) {
    let polygon1 = [];
    let polygon2 = [];


    // Assuming we have only one diagonal as an example



    let splitIndexA = polygon.findIndex(v => v[0] === pointA[0] && v[1] === pointA[1]);
    let splitIndexB = polygon.findIndex(v => v[0] === pointB[0] && v[1] === pointB[1]);

    if (splitIndexA !== -1 && splitIndexB !== -1) {
        if (splitIndexA < splitIndexB) {
            polygon1 = polygon.slice(splitIndexA, splitIndexB + 1);
            polygon2 = [...polygon.slice(splitIndexB), ...polygon.slice(0, splitIndexA + 1)];
        } else {
            polygon1 = polygon.slice(splitIndexB, splitIndexA + 1);
            polygon2 = [...polygon.slice(splitIndexA), ...polygon.slice(0, splitIndexB + 1)];
        }
        return [polygon1, polygon2];
    }
    else {
        return [polygon, []];

    }



}
