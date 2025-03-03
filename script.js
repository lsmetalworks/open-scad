let canvas;

window.onload = function () {
    canvas = new fabric.Canvas("canvas", { backgroundColor: "white" });

    function resizeCanvas() {
        const container = document.getElementById("canvas-container");
        const newWidth = container.clientWidth;
        const newHeight = container.clientHeight;
        canvas.setDimensions({ width: newWidth, height: newHeight });
        canvas.renderAll();
        console.log("Canvas resized to:", newWidth, newHeight);
    }

    window.addEventListener("resize", resizeCanvas);
    resizeCanvas(); // Set initial size

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
        const shapeLeft = canvas.width / 2 - width / 2;
        const shapeTop = canvas.height / 2 - height / 2;

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

    window.drawShape = drawShape;
};

