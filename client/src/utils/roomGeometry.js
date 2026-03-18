/**
 * Generates an array of {x, y} vertices defining the perimeter of a room shape.
 * The coordinates are in local 2D space from (0, 0) to (width, length).
 *
 * @param {string} shape - 'rectangular', 'square', 'l-shape', 'corner-notch', 'bay-extension', 'offset-alcove'
 * @param {number} width - Total maximum width of the bounding box
 * @param {number} length - Total maximum length (depth) of the bounding box
 * @returns {Array<{x: number, y: number}>} Array of vertices in clockwise order
 */
export function getRoomPolygon(shape, width, length) {
    // 1 & 2. Rectangular and Square — standard 4-wall rooms
    if (shape === 'square' || shape === 'rectangular') {
        return [
            { x: 0,     y: 0 },
            { x: width, y: 0 },
            { x: width, y: length },
            { x: 0,     y: length }
        ];
    }

    // 3. L-Shaped Room (6 walls)
    // Main rectangle minus a top-right quadrant — open-plan living/dining split
    if (shape === 'l-shape') {
        const cutW = Math.max(2, width * 0.45);   // width of the cut-out column on the right
        const cutL = Math.max(1.5, length * 0.45); // height of the cut-out row at the top
        return [
            { x: 0,          y: 0 },          // Top-left
            { x: width - cutW, y: 0 },         // Top inner corner (start of cut)
            { x: width - cutW, y: cutL },      // Inner corner
            { x: width,      y: cutL },        // Right side of cut
            { x: width,      y: length },      // Bottom-right
            { x: 0,          y: length }       // Bottom-left
        ];
    }

    // 4. Corner Notch (6 walls)
    // Rectangle with a small corner cut-out (top-right) — apartments with structural pillars or built-in wardrobes
    if (shape === 'corner-notch') {
        const notchW = Math.max(1.5, width * 0.28);
        const notchL = Math.max(1.2, length * 0.3);
        return [
            { x: 0,              y: 0 },           // Top-left
            { x: width - notchW, y: 0 },           // Start of notch top
            { x: width - notchW, y: notchL },      // Corner of notch
            { x: width,          y: notchL },      // Notch joins right wall
            { x: width,          y: length },      // Bottom-right
            { x: 0,              y: length }       // Bottom-left
        ];
    }

    // 5. Bay Extension (8 walls)
    // Main rectangle with a forward bump-out at the bottom centre — bay windows common in UK/Victorian homes
    if (shape === 'bay-extension') {
        const bayW   = Math.max(2, width * 0.38);    // Width of the bay
        const bayL   = Math.max(1, length * 0.22);   // Depth of the bay
        const bayX   = (width - bayW) / 2;           // Left edge of bay
        return [
            { x: 0,        y: 0 },                  // Top-left
            { x: width,    y: 0 },                  // Top-right
            { x: width,    y: length - bayL },      // Right side before bay
            { x: bayX + bayW, y: length - bayL },   // Bay right shoulder
            { x: bayX + bayW, y: length },          // Bay bottom-right
            { x: bayX,     y: length },             // Bay bottom-left
            { x: bayX,     y: length - bayL },      // Bay left shoulder
            { x: 0,        y: length - bayL }       // Left side before bay
        ];
    }

    // 6. Offset Alcove (6 walls)
    // Main rectangular room with a side alcove recess on the bottom-right — good for reading nooks / fitted shelving
    if (shape === 'offset-alcove') {
        const alcoveW = Math.max(2, width * 0.38);   // Width of the alcove opening
        const alcoveL = Math.max(1, length * 0.28);  // Depth inward
        return [
            { x: 0,              y: 0 },             // Top-left
            { x: width,          y: 0 },             // Top-right
            { x: width,          y: length },        // Bottom-right
            { x: width - alcoveW, y: length },       // Alcove bottom-right
            { x: width - alcoveW, y: length - alcoveL }, // Alcove inner corner
            { x: 0,              y: length - alcoveL }   // Alcove meets left wall
        ];
    }

    // Fallback to rectangle
    return [
        { x: 0,     y: 0 },
        { x: width, y: 0 },
        { x: width, y: length },
        { x: 0,     y: length }
    ];
}

/**
 * Checks if a point {x, y} is inside a given 2D polygon array using ray casting.
 */
export function isPointInPolygon(point, polygon) {
    let x = point.x, y = point.y;
    let inside = false;
    for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
        let xi = polygon[i].x, yi = polygon[i].y;
        let xj = polygon[j].x, yj = polygon[j].y;
        let intersect = ((yi > y) !== (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
        if (intersect) inside = !inside;
    }
    return inside;
}

/**
 * Snaps a given point {x, y} to the nearest wall segment of the polygon.
 * Returns the projected coordinate and the flush rotation angle.
 */
export function snapToNearestWall(point, polygon) {
    let minDist = Infinity;
    let snappedPoint = { x: point.x, y: point.y };
    let rotation = 0;

    for (let i = 0; i < polygon.length; i++) {
        let p1 = polygon[i];
        let p2 = polygon[(i + 1) % polygon.length];
        
        let l2 = (p2.x - p1.x)**2 + (p2.y - p1.y)**2;
        if (l2 === 0) continue;
        
        let t = Math.max(0, Math.min(1, ((point.x - p1.x) * (p2.x - p1.x) + (point.y - p1.y) * (p2.y - p1.y)) / l2));
        let projX = p1.x + t * (p2.x - p1.x);
        let projY = p1.y + t * (p2.y - p1.y);
        
        let dist = Math.sqrt((point.x - projX)**2 + (point.y - projY)**2);
        if (dist < minDist) {
            minDist = dist;
            snappedPoint = { x: projX, y: projY };
            let dx = p2.x - p1.x;
            let dy = p2.y - p1.y;
            rotation = Math.atan2(dy, dx) * (180 / Math.PI);
        }
    }
    return { position: snappedPoint, rotation };
}

/**
 * Safely bounds moving items inside the room boundaries, snapping doors/windows natively to walls.
 */
export const applyPositionConstraints = (x, z, item, roomConfig) => {
    let newX = x;
    let newZ = z;
    const polygon = getRoomPolygon(roomConfig.shape, roomConfig.width, roomConfig.length);
    const w = item.dimensions.width * item.scale.x;
    const d = item.dimensions.depth * item.scale.z;

    if (item.modelType === 'door' || item.modelType === 'window') {
        const center = { x: newX + w/2, y: newZ + d/2 };
        const snapped = snapToNearestWall(center, polygon);
        const rotationOffset = item.userRotationOffset || 0;
        return { 
            x: snapped.position.x - w/2, 
            z: snapped.position.y - d/2,
            rotation: snapped.rotation + rotationOffset 
        };
    } else {
        newX = Math.max(0, Math.min(newX, roomConfig.width - w));
        newZ = Math.max(0, Math.min(newZ, roomConfig.length - d));
        
        const center = { x: newX + w/2, y: newZ + d/2 };
        if (!isPointInPolygon(center, polygon)) {
            const snapped = snapToNearestWall(center, polygon);
            return { x: snapped.position.x - w/2, z: snapped.position.y - d/2, rotation: item.rotation };
        }
        
        return { x: newX, z: newZ, rotation: item.rotation };
    }
};
