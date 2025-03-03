window.onload = function () {
    const canvas = new fabric.Canvas("canvas", { backgroundColor: "white" });

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

        // Ensure holes stay inside the object
        if (holeDiameter > 0) {
<<<<<<< HEAD
=======
            if (holeDiameter >= width || holeDiameter >= height) {
                alert("Hole is too large for the shape!");
                return;
            }

            // Calculate absolute hole position from the edges
>>>>>>> parent of 4e31e13 (bug fix in canvas fetch for dxf export funtionality)
            let holeX = shapeLeft + holeOffsetX;
            let holeY = shapeTop + holeOffsetY;

            // Prevent hole from exceeding shape boundaries
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

    function exportDXF() {
        if (typeof window.DxfWriter === "undefined") {
            console.error("DxfWriter is not loaded correctly!");
            alert("DXF export failed: js-dxf library did not load properly.");
            return;
        }

<<<<<<< HEAD
        const dxf = new window.DxfWriter();

        canvas.getObjects().forEach(obj => {
            if (obj.type === "rect") {
                dxf.addRectangle(obj.left, obj.top, obj.width, obj.height);
            } else if (obj.type === "circle") {
                dxf.addCircle(obj.left, obj.top, obj.radius);
            }
        });

        const dxfBlob = new Blob([dxf.toDxfString()], { type: "application/dxf" });
        const a = document.createElement("a");
        a.href = URL.createObjectURL(dxfBlob);
        a.download = "shape.dxf";
        a.click();
    }

    window.drawShape = drawShape;
    window.exportDXF = exportDXF;
};
=======
// Place exportDXF function OUTSIDE of window.onload to make sure it's globally accessible
function exportDXF() {
    console.log("Exporting DXF...");

    // Get the Fabric.js canvas instance
    const canvas = fabric.Canvas.activeInstance;
    if (!canvas) {
        console.error("Canvas not found!");
        return;
    }

    const objects = canvas.getObjects(); // Get Fabric.js objects

    // Generate a DXF string (basic implementation)
    let dxfContent = "0\nSECTION\n2\nHEADER\n0\nENDSEC\n0\nSECTION\n2\nTABLES\n0\nENDSEC\n0\nSECTION\n2\nBLOCKS\n0\nENDSEC\n0\nSECTION\n2\nENTITIES\n";

    objects.forEach(obj => {
        if (obj.type === "rect") {
            dxfContent += `0\nLWPOLYLINE\n8\n0\n10\n${obj.left}\n20\n${obj.top}\n10\n${obj.left + obj.width}\n20\n${obj.top}\n10\n${obj.left + obj.width}\n20\n${obj.top + obj.height}\n10\n${obj.left}\n20\n${obj.top + obj.height}\n`;
        } else if (obj.type === "circle") {
            dxfContent += `0\nCIRCLE\n8\n0\n10\n${obj.left}\n20\n${obj.top}\n40\n${obj.radius}\n`;
        }
        // Add other shapes as needed
    });

    dxfContent += "0\nENDSEC\n0\nEOF";

    // Create a blob and trigger a download
    const blob = new Blob([dxfContent], { type: "application/dxf" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "drawing.dxf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// Attach exportDXF to the global window object so it can be accessed from HTML
window.exportDXF = exportDXF;
>>>>>>> parent of 4e31e13 (bug fix in canvas fetch for dxf export funtionality)
