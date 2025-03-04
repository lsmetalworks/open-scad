// Initialize Fabric.js canvas
const canvas = new fabric.Canvas('canvas', {
  backgroundColor: '#f0f0f0',
  selection: true
});
let currentShape = null;

// Function to add a parametric rectangle
document.getElementById('addRect').addEventListener('click', () => {
  const width = parseInt(document.getElementById('widthInput').value);
  const height = parseInt(document.getElementById('heightInput').value);
  const rect = new fabric.Rect({
    left: 100,
    top: 100,
    width: width,
    height: height,
    fill: '#ffffff',
    stroke: '#000000',
    strokeWidth: 2,
    selectable: true,
    hasControls: true // Allows resizing
  });
  canvas.add(rect);
  canvas.setActiveObject(rect);
  currentShape = rect;
  canvas.renderAll();
});

// Function to add a parametric circle
document.getElementById('addCircle').addEventListener('click', () => {
  const radius = parseInt(document.getElementById('radiusInput').value);
  const circle = new fabric.Circle({
    left: 200,
    top: 200,
    radius: radius,
    fill: '#ffffff',
    stroke: '#000000',
    strokeWidth: 2,
    selectable: true,
    hasControls: true
  });
  canvas.add(circle);
  canvas.setActiveObject(circle);
  currentShape = circle;
  canvas.renderAll();
});

// Track the selected shape
canvas.on('selection:created', (e) => {
  currentShape = e.target;
});
canvas.on('selection:updated', (e) => {
  currentShape = e.target;
});
canvas.on('selection:cleared', () => {
  currentShape = null;
});

// Function to add a hole (circular for simplicity)
document.getElementById('addHole').addEventListener('click', () => {
  if (!currentShape) {
    alert('Please select a shape first!');
    return;
  }

  // Create a small circle as a "hole"
  const hole = new fabric.Circle({
    left: currentShape.left + currentShape.width / 2 - 10, // Center of the shape
    top: currentShape.top + currentShape.height / 2 - 10,
    radius: 10,
    fill: 'rgba(0,0,0,0)', // Transparent fill
    stroke: '#ff0000',
    strokeWidth: 1,
    selectable: true,
    originX: 'center',
    originY: 'center'
  });

  // Group the shape and hole, then use clipPath to subtract
  const group = new fabric.Group([currentShape, hole], {
    left: currentShape.left,
    top: currentShape.top
  });
  
  // Use the hole as a clipPath (inverted to "cut out")
  currentShape.clipPath = hole;
  currentShape.clipPath.inverted = true; // Cuts the hole out

  // Remove the original shape and add the modified one
  canvas.remove(currentShape);
  canvas.add(currentShape); // Add back the clipped shape
  currentShape = null; // Reset selection
  canvas.renderAll();
});
