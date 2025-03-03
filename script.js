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
        }

        canvas.add(shape);

        if (holeDiameter > 0) {
            let holeX = shapeLeft + holeOffsetX;
            let holeY = shapeTop + holeOffsetY;

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
        if (!window.DxfWriter) {
            console.error("DxfWriter is not loaded correctly!");
            return;
        }

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
