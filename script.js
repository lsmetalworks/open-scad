window.onload = function () {
    const canvas = new fabric.Canvas("canvas", { backgroundColor: "white" });

    function drawShape() {
        canvas.clear();
        
        const shapeType = document.getElementById("shape").value;
        const width = Math.min(parseFloat(document.getElementById("width").value), 24) * 10;
        const height = Math.min(parseFloat(document.getElementById("height").value), 24) * 10;
        const radius = parseFloat(document.getElementById("radius").value) * 10;
        let holeDiameter = parseFloat(document.getElementById("holeDiameter").value) * 10;
        let holeX = parseFloat(document.getElementById("holeX").value) * 10;
        let holeY = parseFloat(document.getElementById("holeY").value) * 10;

        let shape, shapeCenterX, shapeCenterY;

        if (shapeType === "rectangle") {
            shape = new fabric.Rect({
                left: 100,
                top: 100,
                width: width,
                height: height,
                fill: "transparent",
                stroke: "black",
                strokeWidth: 2,
                rx: radius,
                ry: radius
            });
            shapeCenterX = 100 + width / 2;
            shapeCenterY = 100 + height / 2;
        } else if (shapeType === "circle") {
            shape = new fabric.Circle({
                left: 100,
                top: 100,
                radius: width / 2,
                fill: "transparent",
                stroke: "black",
                strokeWidth: 2
            });
            shapeCenterX = 100 + width / 2;
            shapeCenterY = 100 + width / 2;
        } else if (shapeType === "triangle") {
            shape = new fabric.Polygon([
                { x: 100, y: 100 },
                { x: 100 + width, y: 100 },
                { x: 100 + width / 2, y: 100 - height }
            ], {
                fill: "transparent",
                stroke: "black",
                strokeWidth: 2
            });
            shapeCenterX = 100 + width / 2;
            shapeCenterY = 100 - height / 3;
        } else if (shapeType === "hexagon") {
            shape = new fabric.Polygon([
                { x: 100, y: 100 },
                { x: 100 + width / 2, y: 100 - height / 2 },
                { x: 100 + width, y: 100 },
                { x: 100 + width, y: 100 + height / 2 },
                { x: 100 + width / 2, y: 100 + height },
                { x: 100, y: 100 + height / 2 }
            ], {
                fill: "transparent",
                stroke: "black",
                strokeWidth: 2
            });
            shapeCenterX = 100 + width / 2;
            shapeCenterY = 100 + height / 2;
        } else if (shapeType === "ellipse") {
            shape = new fabric.Ellipse({
                left: 100,
                top: 100,
                rx: width / 2,
                ry: height / 2,
                fill: "transparent",
                stroke: "black",
                strokeWidth: 2
            });
            shapeCenterX = 100 + width / 2;
            shapeCenterY = 100 + height / 2;
        }

        canvas.add(shape);

        // Ensure holes stay inside the object
        if (holeDiameter > 0) {
            if (holeDiameter >= width || holeDiameter >= height) {
                alert("Hole is too large for the shape!");
                return;
            }

            // Adjust hole position if it goes outside the shape
            holeX = Math.max(100, Math.min(holeX, 100 + width - holeDiameter));
            holeY = Math.max(100, Math.min(holeY, 100 + height - holeDiameter));

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

    function exportDXF() {
        let dxf = new DxfWriter();
        const shapeType = document.getElementById("shape").value;
        const width = Math.min(parseFloat(document.getElementById("width").value), 24) * 10;
        const height = Math.min(parseFloat(document.getElementById("height").value), 24) * 10;
        const holeDiameter = parseFloat(document.getElementById("holeDiameter").value) * 10;
        let holeX = parseFloat(document.getElementById("holeX").value) * 10;
        let holeY = parseFloat(document.getElementById("holeY").value) * 10;

        if (shapeType === "rectangle") {
            dxf.addPolyline([
                [0, 0], [width, 0], [width, height], [0, height], [0, 0]
            ]);
        } else if (shapeType === "circle") {
            dxf.addCircle(width / 2, height / 2, width / 2);
        } else if (shapeType === "triangle") {
            dxf.addPolyline([
                [0, 0], [width, 0], [width / 2, height], [0, 0]
            ]);
        } else if (shapeType === "hexagon") {
            dxf.addPolyline([
                [0, height / 2], [width / 2, 0], [width, height / 2],
                [width, height], [width / 2, height + height / 2], [0, height], [0, height / 2]
            ]);
        } else if (shapeType === "ellipse") {
            dxf.addEllipse(width / 2, height / 2, width / 2, height / 2);
        }

        // Ensure holes are inside the shape before adding them to DXF
        if (holeDiameter > 0 && holeDiameter < width && holeDiameter < height) {
            holeX = Math.max(0, Math.min(holeX, width - holeDiameter));
            holeY = Math.max(0, Math.min(holeY, height - holeDiameter));

            dxf.addCircle(holeX, holeY, holeDiameter / 2);
        }

        const blob = new Blob([dxf.toDxfString()], { type: "text/plain" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = "shape.dxf";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    window.drawShape = drawShape;
    window.exportDXF = exportDXF;
};
