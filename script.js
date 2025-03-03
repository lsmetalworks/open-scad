let canvas; // Declare the canvas variable globally

window.onload = function () {
    canvas = new fabric.Canvas("canvas", { backgroundColor: "white" });

    function drawShape() {
        canvas.clear();
        
        const shapeType = document.getElementById("shape").value;
        const width = Math.min(parseFloat(document.getElementById("width").value), 24) * 10;
        const height = Math.min(parseFloat(document.getElementById("height").value), 24) * 10;
        const radius = parseFloat(document.getElementById("radius").value) * 10;
        let holeDiameter = parseFloat(document.getElementById("holeDiameter").value) * 10;
        let holeOffsetX = parseFloat(document.getElementById("holeOffsetX").value) * 10;
        let holeOffsetY = parseFloat(document.getElementById("holeOffsetY").value) * 10;

        let shape;
        const shapeLeft = 100;
        const shapeTop = 100;

        if (shapeType === "rectangle") {
            shape = new fabric.Rect({
                left: shapeLeft,
                top: shapeTop,
                width: width,
                height: height,
                fill: "transparent",
                stroke: "black",
                strokeWidth: 2,
                rx: radius,
                ry: radius
            });
        } else if (shapeType === "circle") {
            shape = new fabric.Circle({
                left: shapeLeft,
                top: shapeTop,
                radius: width / 2,
                fill: "transparent",
                stroke: "black",
                strokeWidth: 2
            });
        } else if (shapeType === "triangle") {
            shape = new fabric.Polygon([
                { x: shapeLeft, y: shapeTop },
                { x: shapeLeft + width, y: shapeTop },
                { x: shapeLeft + width / 2, y: shapeTop - height }
            ], {
                fill: "transparent",
                stroke: "black",
                strokeWidth: 2
            });
        } else if (shapeType === "hexagon") {
            shape = new fabric.Polygon([
                { x: shapeLeft, y: shapeTop },
                { x: shapeLeft + width / 2, y: shapeTop - height / 2 },
                { x: shapeLeft + width, y: shapeTop },
                { x: shapeLeft + width, y: shapeTop + height / 2 },
                { x: shapeLeft + width / 2, y: shapeTop + height },
                { x: shapeLeft, y: shapeTop + height / 2 }
            ], {
                fill: "transparent",
                stroke: "black",
                strokeWidth: 2
            });
        } else if (shapeType === "ellipse") {
            shape = new fabric.Ellipse({
                left: shapeLeft,
                top: shapeTop,
                rx: width / 2,
                ry: height / 2,
                fill: "transparent",
                stroke: "black",
                strokeWidth: 2
            });
        }

        canvas.add(shape);

        if (holeDiameter > 0) {
            if (holeDiameter >= width || holeDiameter >= height) {
                alert("Hole is too large for the shape!");
                return;
            }

            let holeX = shapeLeft + holeOffsetX;
            let holeY = shapeTop + holeOffsetY;

            holeX = Math.max(shapeLeft + holeDiameter / 2, Math.min(holeX, shapeLeft + width - holeDiameter / 2));
            holeY = Math.max(shapeTop + holeDiameter / 2, Math.min(holeY, shapeTop + height - holeDiameter / 2));

            let hole = new fabric.Circle({
                left: holeX,
                top: holeY,
                radius: holeDiameter / 2,
                fill: "white",
                stroke: "black",
                strokeWidth: 1
            });
            canvas.add(hole);
        }
    }

    window.drawShape = drawShape;
};

function function exportDXF() {
    let dxfContent = `
0
SECTION
2
HEADER
0
ENDSEC
0
SECTION
2
TABLES
0
ENDSEC
0
SECTION
2
BLOCKS
0
ENDSEC
0
SECTION
2
ENTITIES
`;

    const shapeType = document.getElementById("shape").value;
    const width = Math.min(parseFloat(document.getElementById("width").value), 24) * 10;
    const height = Math.min(parseFloat(document.getElementById("height").value), 24) * 10;
    const holeDiameter = parseFloat(document.getElementById("holeDiameter").value) * 10;
    const holeX = parseFloat(document.getElementById("holeX").value) * 10;
    const holeY = parseFloat(document.getElementById("holeY").value) * 10;

    if (shapeType === "rectangle") {
        dxfContent += `
0
LWPOLYLINE
8
0
90
4
10
0
20
0
10
${width}
20
0
10
${width}
20
${height}
10
0
20
${height}
10
0
20
0
`;
    } else if (shapeType === "circle") {
        dxfContent += `
0
CIRCLE
8
0
10
${width / 2}
20
${height / 2}
30
0
40
${width / 2}
`;
    }

    if (holeDiameter > 0) {
        dxfContent += `
0
CIRCLE
8
0
10
${holeX}
20
${holeY}
30
0
40
${holeDiameter / 2}
`;
    }

    dxfContent += `
0
ENDSEC
0
SECTION
2
EOF
`;

    const blob = new Blob([dxfContent], { type: "text/plain" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "shape.dxf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}


window.exportDXF = exportDXF;
