function updateForm() {
    const shape = document.getElementById('shape').value;
    const paramsDiv = document.getElementById('params');
    paramsDiv.innerHTML = '';

    if (shape === 'rectangle' || shape === 'square') {
        paramsDiv.innerHTML = `
            <div class="form-group">
                <label>Width (mm):</label>
                <input type="number" id="width" min="1" value="100">
            </div>
            ${shape === 'rectangle' ? `
            <div class="form-group">
                <label>Height (mm):</label>
                <input type="number" id="height" min="1" value="50">
            </div>` : ''}
            <div class="form-group">
                <label>Add Corner Holes?</label>
                <input type="checkbox" id="holes" checked>
            </div>
            <div class="form-group">
                <label>Hole Diameter (mm):</label>
                <input type="number" id="holeDiameter" min="1" value="5" ${shape === 'circle' ? 'disabled' : ''}>
            </div>
        `;
    } else if (shape === 'circle') {
        paramsDiv.innerHTML = `
            <div class="form-group">
                <label>Diameter (mm):</label>
                <input type="number" id="diameter" min="1" value="50">
            </div>
        `;
    }
}

function generateDXF() {
    const shape = document.getElementById('shape').value;
    let dxfContent = "0\nSECTION\n2\nENTITIES\n";

    if (shape === 'rectangle' || shape === 'square') {
        const width = parseFloat(document.getElementById('width').value);
        const height = shape === 'rectangle' ? parseFloat(document.getElementById('height').value) : width;
        const holes = document.getElementById('holes').checked;
        const holeDiameter = parseFloat(document.getElementById('holeDiameter').value);

        // Rectangle/Square outline
        dxfContent += `0\nPOLYLINE\n8\n0\n66\n1\n70\n1\n`;
        dxfContent += `0\nVERTEX\n8\n0\n10\n0\n20\n0\n`;
        dxfContent += `0\nVERTEX\n8\n0\n10\n${width}\n20\n0\n`;
        dxfContent += `0\nVERTEX\n8\n0\n10\n${width}\n20\n${height}\n`;
        dxfContent += `0\nVERTEX\n8\n0\n10\n0\n20\n${height}\n`;
        dxfContent += `0\nSEQEND\n`;

        // Add corner holes if selected
        if (holes) {
            const r = holeDiameter / 2;
            const offset = r + 1; // Small offset from edges
            const corners = [
                [offset, offset],              // Bottom-left
                [width - offset, offset],      // Bottom-right
                [width - offset, height - offset], // Top-right
                [offset, height - offset]      // Top-left
            ];
            corners.forEach(([x, y]) => {
                dxfContent += `0\nCIRCLE\n8\n0\n10\n${x}\n20\n${y}\n40\n${r}\n`;
            });
        }
    } else if (shape === 'circle') {
        const diameter = parseFloat(document.getElementById('diameter').value);
        const radius = diameter / 2;
        dxfContent += `0\nCIRCLE\n8\n0\n10\n${radius}\n20\n${radius}\n40\n${radius}\n`;
    }

    dxfContent += "0\nENDSEC\n0\nEOF";

    // Download the DXF file
    const blob = new Blob([dxfContent], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${shape}.dxf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
}

// Initialize form on page load
document.addEventListener('DOMContentLoaded', updateForm);
