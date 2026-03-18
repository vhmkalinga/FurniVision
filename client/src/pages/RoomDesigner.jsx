import { useState, useRef, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Link } from 'react-router-dom';
import { Save, FolderOpen, Plus, Trash2, RotateCw, Eye, LayoutGrid, Settings2, ChevronDown, Palette, PenTool, Layers, Clock, ArrowRight, Edit, ArrowLeft, Undo2, Redo2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import api from '../api';
import Viewer3D from '../components/designer/Viewer3D';
import { getRoomPolygon, applyPositionConstraints } from '../utils/roomGeometry';

const ROOM_SHAPES = [
    { id: 'rectangular', name: 'Standard Room', desc: 'Classic rectangular layout — most common for bedrooms, lounges & dining rooms', defaultW: 6, defaultL: 4,
      icon: <svg viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ width: '4rem', height: '4rem' }}><rect x="4" y="10" width="32" height="20" rx="1"/></svg> },
    { id: 'square', name: 'Square Studio', desc: 'Equal proportions — ideal for open-plan studios & home offices', defaultW: 5, defaultL: 5,
      icon: <svg viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ width: '4rem', height: '4rem' }}><rect x="6" y="6" width="28" height="28" rx="1"/></svg> },
    { id: 'l-shape', name: 'L-Shaped Room', desc: 'Open-plan living — separates kitchen/dining from the lounge naturally', defaultW: 8, defaultL: 6,
      icon: <svg viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ width: '4rem', height: '4rem' }}><polygon points="4,4 20,4 20,20 36,20 36,36 4,36" strokeLinejoin="round"/></svg> },
    { id: 'corner-notch', name: 'Corner Notch', desc: 'Rectangle with a corner cut-out — common in apartments for built-in wardrobes or pillar recesses', defaultW: 7, defaultL: 6,
      icon: <svg viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ width: '4rem', height: '4rem' }}><polygon points="4,4 28,4 28,16 36,16 36,36 4,36" strokeLinejoin="round"/></svg> },
    { id: 'bay-extension', name: 'Bay Extension', desc: 'Rectangular room with a bay window bump-out — popular in Victorian & modern homes', defaultW: 7, defaultL: 6,
      icon: <svg viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ width: '4rem', height: '4rem' }}><polygon points="4,6 36,6 36,28 26,28 26,36 14,36 14,28 4,28" strokeLinejoin="round"/></svg> },
    { id: 'offset-alcove', name: 'Alcove Room', desc: 'Main space with a side alcove recess — great for fitted shelving or reading nooks', defaultW: 8, defaultL: 6,
      icon: <svg viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ width: '4rem', height: '4rem' }}><polygon points="4,4 36,4 36,36 20,36 20,26 4,26" strokeLinejoin="round"/></svg> },
];

// Furniture catalog
export const FURNITURE_CATALOG = [
    { name: 'Beige Linen Sofa', modelType: 'sofa', dimensions: { width: 2.0, height: 0.85, depth: 0.9 }, color: '#C4B5A0', image: '/products/Beige_Linen_Sofa.webp', model: '/models/Beige_Linen_Sofa.glb', price: 1299 },
    { name: 'White & Tan Leather Sofa', modelType: 'sofa', dimensions: { width: 2.2, height: 0.85, depth: 0.95 }, color: '#E8DDD0', image: '/products/White and tan leather.webp', model: '/models/White and tan leather.glb', price: 1899 },
    { name: 'Tufted Beige Armchair', modelType: 'chair', dimensions: { width: 0.75, height: 0.85, depth: 0.7 }, color: '#C4B5A0', image: '/products/Tufted_Beige_Arm_Chair.webp', model: '/models/Tufted_Beige_Arm_Chair.glb', price: 599 },
    { name: 'Ladder Back Chair', modelType: 'chair', dimensions: { width: 0.5, height: 0.9, depth: 0.5 }, color: '#8B6914', image: '/products/Ladder_Back_Wooden_Chair.webp', model: '/models/Ladder_Back_Wooden_Chair.glb', price: 249 },
    { name: 'Natural Wood Table', modelType: 'table', dimensions: { width: 1.6, height: 0.76, depth: 0.9 }, color: '#A0845C', image: '/products/Natural_Wood_Table.webp', model: '/models/Natural_Wood_Table.glb', price: 799 },
    { name: 'Oak Dining Table', modelType: 'table', dimensions: { width: 1.8, height: 0.76, depth: 0.9 }, color: '#92400E', image: '/products/Oak dining table.jpeg', model: '/models/Oak dining table.glb', price: 1099 },
    { name: 'Round Oak Coffee Table', modelType: 'table', dimensions: { width: 0.8, height: 0.45, depth: 0.8 }, color: '#A0845C', image: '/products/Round_Oak_Coffee_Table.jpg', model: '/models/Round_Oak_Coffee_Table.glb', price: 449 },
    { name: 'Two-Tone Coffee Table', modelType: 'table', dimensions: { width: 1.0, height: 0.45, depth: 0.6 }, color: '#78350F', image: '/products/Two_Tone_Wood_Coffee__Table.webp', model: '/models/Two_Tone_Wood_Coffee__Table.glb', price: 549 },
    { name: 'Round Side Table', modelType: 'table', dimensions: { width: 0.5, height: 0.55, depth: 0.5 }, color: '#78350F', image: '/products/Round side.jpeg', model: '/models/Round side.glb', price: 299 },
    { name: 'Lockable Wooden Desk', modelType: 'desk', dimensions: { width: 1.2, height: 0.75, depth: 0.6 }, color: '#78350F', image: '/products/Lockable_Wooden_Table.jpg', model: '/models/Lockable_Wooden_Table.glb', price: 699 },
    { name: 'Natural Wood Bed', modelType: 'bed', dimensions: { width: 1.6, height: 0.5, depth: 2.0 }, color: '#A0845C', image: '/products/Natural_Wood_Bed.webp', model: '/models/Natural_Wood_Bed.glb', price: 1499 },
    { name: 'Oak Storage Bed', modelType: 'bed', dimensions: { width: 1.7, height: 0.55, depth: 2.1 }, color: '#92400E', image: '/products/Oak_Storage_Platform__Bed.webp', model: '/models/Oak_Storage_Platform__Bed.glb', price: 1799 },
    { name: 'Geometric Bookshelf', modelType: 'bookshelf', dimensions: { width: 1.0, height: 1.8, depth: 0.35 }, color: '#92400E', image: '/products/Geometric_Wooden_Book_Shelf.png', model: '/models/Geometric_Wooden_Book_Shelf.glb', price: 699 },
    { name: 'Tall Wooden Bookshelf', modelType: 'bookshelf', dimensions: { width: 0.8, height: 2.0, depth: 0.35 }, color: '#78350F', image: '/products/Tall_Wooden_Bookshelf.jpg', model: '/models/Tall_Wooden_Bookshelf.glb', price: 599 },
    { name: 'Five-Shelf Book Rack', modelType: 'bookshelf', dimensions: { width: 0.8, height: 1.6, depth: 0.3 }, color: '#78350F', image: '/products/Wooden_Five_Shelf_Book.jpg', model: '/models/Wooden_Five_Shelf_Book.glb', price: 449 },
    { name: 'Pine Wardrobe', modelType: 'cabinet', dimensions: { width: 1.2, height: 2.0, depth: 0.6 }, color: '#A0845C', image: '/products/Pine wardrobe.jpeg', model: '/models/Pine wardrobe.glb', price: 999 },
    { name: 'Golden Floor Lamp', modelType: 'lamp', dimensions: { width: 0.35, height: 1.6, depth: 0.35 }, color: '#D4A017', image: '/products/Golden_Floor_Lamp.webp', model: '/models/Golden_Floor_Lamp.glb', price: 349 },
    { name: 'Onyx Table Lamp', modelType: 'lamp', dimensions: { width: 0.25, height: 0.5, depth: 0.25 }, color: '#2D2D2D', image: '/products/Onyx_Table_Lamp.webp', model: '/models/Onyx_Table_Lamp.glb', price: 199 },
    { name: 'Carved Wooden Door', modelType: 'door', dimensions: { width: 0.9, height: 2.1, depth: 0.05 }, color: '#5C3A1E', image: '/products/carved wooden door.jpg', model: '/models/carved wooden door.glb', price: 899 },
    { name: 'Double French Doors', modelType: 'door', dimensions: { width: 1.6, height: 2.1, depth: 0.06 }, color: '#E8E0D8', image: '/products/Double french door.webp', model: '/models/Double French Doors.glb', price: 1299 },
    { name: 'Six-Pane Windows', modelType: 'window', dimensions: { width: 1.4, height: 1.2, depth: 0.1 }, color: '#E8E0D8', image: '/products/Pair_Of_Six_Pane_Window.jpg', model: '/models/Pair_Of_Six_Pane_Window.glb', price: 799 },
];

const createTemplateItem = (name, x, z, rotation = 0) => {
    const item = FURNITURE_CATALOG.find(i => i.name === name);
    if (!item) return null;
    return { ...item, position: { x, y: 0, z }, rotation, scale: { x: 1, y: 1, z: 1 } };
};

// Pre-made template designs
const PREMADE_DESIGNS = [
    { name: 'Modern Living Studio', roomWidth: 6, roomLength: 5, roomShape: 'rectangular', wallColor: '#F8F9FA', floorColor: '#DEB887', furniture: [
        createTemplateItem('Beige Linen Sofa', 2.0, 3.0),
        createTemplateItem('Round Oak Coffee Table', 2.6, 2.0),
        createTemplateItem('Tufted Beige Armchair', 4.5, 3.0, -45),
        createTemplateItem('Geometric Bookshelf', -0.325, 0.825, 90),
        createTemplateItem('Golden Floor Lamp', 0.5, 4.0),
        createTemplateItem('Double French Doors', 2.2, 4.97, 0),
        createTemplateItem('Six-Pane Windows', -0.7, 1.45, 90)
    ].filter(Boolean)},
    { name: 'Executive Home Office', roomWidth: 4, roomLength: 4, roomShape: 'square', wallColor: '#DFD3C3', floorColor: '#D2B48C', furniture: [
        createTemplateItem('Lockable Wooden Desk', 1.4, 1.5),
        createTemplateItem('Tufted Beige Armchair', 1.6, 0.6),
        createTemplateItem('Tall Wooden Bookshelf', 3.0, 0.0),
        createTemplateItem('Onyx Table Lamp', 2.2, 1.6),
        createTemplateItem('Carved Wooden Door', 1.55, 3.975, 0),
        createTemplateItem('Six-Pane Windows', 1.3, -0.05, 0)
    ].filter(Boolean)},
    { name: 'Master Bedroom Suite', roomWidth: 5, roomLength: 5, roomShape: 'square', wallColor: '#A6B1E1', floorColor: '#FDF5E6', furniture: [
        createTemplateItem('Oak Storage Bed', 1.6, 0.0),
        createTemplateItem('Round Side Table', 0.9, 0.2),
        createTemplateItem('Round Side Table', 3.5, 0.2),
        createTemplateItem('Onyx Table Lamp', 1.0, 0.3),
        createTemplateItem('Onyx Table Lamp', 3.6, 0.3),
        createTemplateItem('Pine Wardrobe', 4.1, 3.2, -90),
        createTemplateItem('Carved Wooden Door', -0.45, 4.175, 90),
        createTemplateItem('Six-Pane Windows', -0.7, 1.95, 90)
    ].filter(Boolean)},
    { name: 'Formal Dining Setup', roomWidth: 5, roomLength: 4, roomShape: 'rectangular', wallColor: '#DEE2E6', floorColor: '#3E2723', furniture: [
        createTemplateItem('Oak Dining Table', 1.6, 1.5),
        createTemplateItem('Ladder Back Chair', 1.5, 1.0),
        createTemplateItem('Ladder Back Chair', 2.8, 1.0),
        createTemplateItem('Ladder Back Chair', 1.5, 2.5, 180),
        createTemplateItem('Ladder Back Chair', 2.8, 2.5, 180),
        createTemplateItem('Five-Shelf Book Rack', 4.45, 1.35, -90),
        createTemplateItem('Double French Doors', 1.7, 3.97, 0),
        createTemplateItem('Six-Pane Windows', 1.8, -0.05, 0)
    ].filter(Boolean)},
    { name: 'Cozy Reading Nook', roomWidth: 3.5, roomLength: 3.5, roomShape: 'square', wallColor: '#D4B499', floorColor: '#FDF5E6', furniture: [
        createTemplateItem('Tufted Beige Armchair', 1.2, 1.3, -45),
        createTemplateItem('Round Side Table', 2.3, 1.5),
        createTemplateItem('Golden Floor Lamp', 2.5, 0.8),
        createTemplateItem('Tall Wooden Bookshelf', -0.225, 1.325, 90),
        createTemplateItem('Carved Wooden Door', 1.3, 3.475, 0),
        createTemplateItem('Six-Pane Windows', 2.8, 1.45, -90)
    ].filter(Boolean)},
    { name: 'Lounge / Entertainment', roomWidth: 6, roomLength: 4.5, roomShape: 'rectangular', wallColor: '#E9ECEF', floorColor: '#CED4DA', furniture: [
        createTemplateItem('Beige Linen Sofa', 2.0, 2.5, 0),
        createTemplateItem('Two-Tone Coffee Table', 2.5, 1.5),
        createTemplateItem('Five-Shelf Book Rack', 2.6, 0.0),
        createTemplateItem('Tufted Beige Armchair', 0.5, 2.5, 45),
        createTemplateItem('Golden Floor Lamp', 0.5, 0.5),
        createTemplateItem('Double French Doors', 5.2, 3.47, -90),
        createTemplateItem('Six-Pane Windows', 2.5, -0.05, 0)
    ].filter(Boolean)},
    { name: 'Minimalist Studio', roomWidth: 5, roomLength: 6, roomShape: 'rectangular', wallColor: '#F8F9FA', floorColor: '#A0522D', furniture: [
        createTemplateItem('Natural Wood Bed', 3.4, 0.0),
        createTemplateItem('Beige Linen Sofa', -0.55, 3.05, 90),
        createTemplateItem('Lockable Wooden Desk', 0.5, 0.5),
        createTemplateItem('Ladder Back Chair', 1.0, 1.2, 180),
        createTemplateItem('Carved Wooden Door', 1.5, 5.975, 0),
        createTemplateItem('Six-Pane Windows', -0.7, 2.45, 90)
    ].filter(Boolean)}
];

export default function RoomDesigner() {
    const { user } = useAuth();
    const { dark } = useTheme();
    const canvasRef = useRef(null);
    const [activeSection, setActiveSection] = useState('designer');
    const [designStep, setDesignStep] = useState('shape-select'); // 'shape-select' or 'design'
    const [view, setView] = useState('2d');
    const [savedDesigns, setSavedDesigns] = useState([]);
    const [currentDesignId, setCurrentDesignId] = useState(null);
    const [designName, setDesignName] = useState('Untitled Design');
    const [loadingSaved, setLoadingSaved] = useState(false);

    const [roomConfig, setRoomConfig] = useState({
        width: 6, length: 5, height: 3, shape: 'rectangular',
        wallColor: '#F5F5DC', floorColor: '#DEB887',
    });

    const [furniture, setFurniture] = useState([]);
    const [selectedFurniture, setSelectedFurniture] = useState(null);
    const [dragging, setDragging] = useState(null);
    const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

    // History tracking
    const [history, setHistory] = useState([]);
    const [historyStep, setHistoryStep] = useState(-1);

    const SCALE = 60;

    // Load saved designs when tab changes
    useEffect(() => {
        if (activeSection === 'saved' && user) {
            setLoadingSaved(true);
            api.get('/designs').then(res => {
                setSavedDesigns(res.data.designs);
            }).catch(() => {}).finally(() => setLoadingSaved(false));
        }
    }, [activeSection, user]);

    // Save initial state when starting design
    useEffect(() => {
        if (designStep === 'design' && historyStep === -1) {
            saveHistoryState([], roomConfig);
        }
    }, [designStep]);

    const saveHistoryState = (newFurniture, newConfig) => {
        const nextStep = historyStep + 1;
        const newHistory = history.slice(0, nextStep); // Truncate forward history if diverged
        newHistory.push({
            furniture: JSON.parse(JSON.stringify(newFurniture)),
            roomConfig: { ...newConfig }
        });
        setHistory(newHistory);
        setHistoryStep(nextStep);
    };

    const handleUndo = () => {
        if (historyStep > 0) {
            const prevState = history[historyStep - 1];
            setFurniture(JSON.parse(JSON.stringify(prevState.furniture)));
            setRoomConfig({ ...prevState.roomConfig });
            setHistoryStep(historyStep - 1);
            setSelectedFurniture(null);
        }
    };

    const handleRedo = () => {
        if (historyStep < history.length - 1) {
            const nextState = history[historyStep + 1];
            setFurniture(JSON.parse(JSON.stringify(nextState.furniture)));
            setRoomConfig({ ...nextState.roomConfig });
            setHistoryStep(historyStep + 1);
            setSelectedFurniture(null);
        }
    };

    // 2D Canvas rendering
    const draw2D = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        const w = roomConfig.width * SCALE;
        const h = roomConfig.length * SCALE;
        const pad = 40;

        canvas.width = w + pad * 2;
        canvas.height = h + pad * 2;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Grid Background
        ctx.strokeStyle = 'rgba(99,102,241,0.08)';
        ctx.lineWidth = 1;
        for (let i = 0; i <= roomConfig.width; i++) {
            ctx.beginPath(); ctx.moveTo(pad + i * SCALE, pad); ctx.lineTo(pad + i * SCALE, pad + h); ctx.stroke();
        }
        for (let i = 0; i <= roomConfig.length; i++) {
            ctx.beginPath(); ctx.moveTo(pad, pad + i * SCALE); ctx.lineTo(pad + w, pad + i * SCALE); ctx.stroke();
        }

        // Polygon Floor & Walls
        const polygon = getRoomPolygon(roomConfig.shape, roomConfig.width, roomConfig.length);
        
        ctx.beginPath();
        polygon.forEach((pt, idx) => {
            const px = pad + pt.x * SCALE;
            const py = pad + pt.y * SCALE;
            if (idx === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
        });
        ctx.closePath();

        // Fill Floor
        ctx.fillStyle = roomConfig.floorColor;
        ctx.fill();

        // Stroke Wall Thickness
        ctx.strokeStyle = roomConfig.wallColor;
        ctx.lineWidth = 6;
        ctx.lineJoin = 'round';
        ctx.stroke();

        // Stroke Inner/Outer Border
        ctx.strokeStyle = '#333';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Dimension labels
        ctx.fillStyle = '#6366F1';
        ctx.font = '12px Inter, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(`${roomConfig.width}m`, pad + w / 2, pad - 10);
        ctx.save();
        ctx.translate(pad - 15, pad + h / 2);
        ctx.rotate(-Math.PI / 2);
        ctx.fillText(`${roomConfig.length}m`, 0, 0);
        ctx.restore();

        furniture.forEach((item, index) => {
            const fx = pad + item.position.x * SCALE;
            const fy = pad + item.position.z * SCALE;
            const fw = item.dimensions.width * SCALE * item.scale.x;
            const fd = item.dimensions.depth * SCALE * item.scale.z;

            ctx.save();
            ctx.translate(fx + fw / 2, fy + fd / 2);
            ctx.rotate((item.rotation * Math.PI) / 180);

            ctx.fillStyle = 'rgba(0,0,0,0.08)';
            ctx.fillRect(-fw / 2 + 3, -fd / 2 + 3, fw, fd);
            ctx.fillStyle = item.color;
            ctx.fillRect(-fw / 2, -fd / 2, fw, fd);

            if (selectedFurniture === index) {
                ctx.strokeStyle = '#6366F1';
                ctx.lineWidth = 3;
                ctx.setLineDash([6, 3]);
                ctx.strokeRect(-fw / 2 - 2, -fd / 2 - 2, fw + 4, fd + 4);
                ctx.setLineDash([]);
            } else {
                ctx.strokeStyle = 'rgba(0,0,0,0.3)';
                ctx.lineWidth = 1;
                ctx.strokeRect(-fw / 2, -fd / 2, fw, fd);
            }

            ctx.fillStyle = 'white';
            ctx.font = `bold ${Math.min(11, fw * 0.3)}px Inter, sans-serif`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(item.name, 0, 0);

            ctx.restore();
        });
    }, [furniture, roomConfig, selectedFurniture]);

    useEffect(() => {
        if (view === '2d' && activeSection === 'designer') draw2D();
    }, [view, draw2D, activeSection]);

    const getCanvasPos = (e) => {
        const rect = canvasRef.current.getBoundingClientRect();
        return { x: (e.clientX - rect.left - 40) / SCALE, y: (e.clientY - rect.top - 40) / SCALE };
    };

    const handleCanvasMouseDown = (e) => {
        const pos = getCanvasPos(e);
        for (let i = furniture.length - 1; i >= 0; i--) {
            const item = furniture[i];
            const halfW = (item.dimensions.width * item.scale.x) / 2;
            const halfD = (item.dimensions.depth * item.scale.z) / 2;
            const cx = item.position.x + halfW;
            const cz = item.position.z + halfD;
            if (pos.x >= cx - halfW && pos.x <= cx + halfW && pos.y >= cz - halfD && pos.y <= cz + halfD) {
                setSelectedFurniture(i); setDragging(i);
                setDragOffset({ x: pos.x - item.position.x, y: pos.y - item.position.z });
                return;
            }
        }
        setSelectedFurniture(null);
    };

    const handleCanvasMouseMove = (e) => {
        if (dragging === null) return;
        const pos = getCanvasPos(e);
        const newFurniture = [...furniture];
        const item = { ...newFurniture[dragging] };
        const snapX = Math.round((pos.x - dragOffset.x) * 4) / 4;
        const snapZ = Math.round((pos.y - dragOffset.y) * 4) / 4;
        
        const constrained = applyPositionConstraints(snapX, snapZ, item, roomConfig);
        item.position.x = constrained.x;
        item.position.z = constrained.z;
        item.rotation = constrained.rotation;
        
        newFurniture[dragging] = item;
        setFurniture(newFurniture);
    };

    const handleCanvasMouseUp = () => {
        if (dragging !== null) {
            saveHistoryState(furniture, roomConfig);
        }
        setDragging(null);
    };

    const addFurniture = (catalogItem) => {
        let newX = roomConfig.width / 2 - catalogItem.dimensions.width / 2;
        let newZ = roomConfig.length / 2 - catalogItem.dimensions.depth / 2;

        // Prevent stacking by offsetting if bounding boxes overlap at the center spawn
        let hasCollision = true;
        let attempts = 0;
        while (hasCollision && attempts < 20) {
            hasCollision = false;
            
            const newLeft = newX;
            const newRight = newX + catalogItem.dimensions.width;
            const newTop = newZ;
            const newBottom = newZ + catalogItem.dimensions.depth;

            for (const f of furniture) {
                const fw = f.dimensions.width * f.scale.x;
                const fd = f.dimensions.depth * f.scale.z;
                
                const fLeft = f.position.x;
                const fRight = f.position.x + fw;
                const fTop = f.position.z;
                const fBottom = f.position.z + fd;
                
                // Small buffer to ensure they don't spawn hugging each other perfectly
                const buffer = 0.05;
                
                // AABB Intersection Check
                if (
                    newLeft < fRight + buffer &&
                    newRight > fLeft - buffer &&
                    newTop < fBottom + buffer &&
                    newBottom > fTop - buffer
                ) {
                    hasCollision = true;
                    newX += 0.25; // Cascade down and right
                    newZ += 0.25;
                    attempts++;
                    break;
                }
            }
        }

        const newItem = {
            ...catalogItem,
            id: Date.now() + Math.random(),
            position: { x: newX, y: 0, z: newZ },
            rotation: 0, 
            scale: { x: 1, y: 1, z: 1 },
            userRotationOffset: 0
        };

        if (catalogItem.modelType === 'door' || catalogItem.modelType === 'window') {
            const polygon = getRoomPolygon(roomConfig.shape, roomConfig.width, roomConfig.length);
            const p1 = polygon[0];
            const p2 = polygon[1];
            newItem.position.x = (p1.x + p2.x) / 2 - catalogItem.dimensions.width / 2;
            newItem.position.z = (p1.y + p2.y) / 2 - catalogItem.dimensions.depth / 2;
        }

        // Apply bounds to make sure the offset (or the wall snap) doesn't push it out of the room
        const constrained = applyPositionConstraints(newItem.position.x, newItem.position.z, newItem, roomConfig);
        newItem.position.x = constrained.x;
        newItem.position.z = constrained.z;
        newItem.rotation = constrained.rotation;

        const newFurniture = [...furniture, newItem];
        setFurniture(newFurniture);
        setSelectedFurniture(newFurniture.length - 1);
        saveHistoryState(newFurniture, roomConfig);
        toast.success(`${catalogItem.name} added`);
    };

    const rotateSelected = () => {
        if (selectedFurniture === null) return;
        const nf = [...furniture]; 
        const item = nf[selectedFurniture];
        
        if (item.modelType === 'door' || item.modelType === 'window') {
            item.userRotationOffset = ((item.userRotationOffset || 0) + 90) % 360;
            const constrained = applyPositionConstraints(item.position.x, item.position.z, item, roomConfig);
            item.rotation = constrained.rotation;
        } else {
            item.rotation = (item.rotation + 45) % 360; 
        }
        
        setFurniture(nf);
        saveHistoryState(nf, roomConfig);
    };

    const deleteSelected = () => {
        if (selectedFurniture === null) return;
        const name = furniture[selectedFurniture].name;
        const nf = furniture.filter((_, i) => i !== selectedFurniture);
        setFurniture(nf); 
        setSelectedFurniture(null); 
        saveHistoryState(nf, roomConfig);
        toast.success(`${name} removed`);
    };

    const scaleSelected = (factor) => {
        if (selectedFurniture === null) return;
        const nf = [...furniture]; const s = nf[selectedFurniture].scale;
        nf[selectedFurniture].scale = { x: Math.max(0.5, Math.min(2, s.x * factor)), y: Math.max(0.5, Math.min(2, s.y * factor)), z: Math.max(0.5, Math.min(2, s.z * factor)) };
        setFurniture(nf);
    };

    const saveDesign = async () => {
        if (!user) return toast.error('Please login to save designs');
        try {
            const designData = {
                name: designName, roomWidth: roomConfig.width, roomLength: roomConfig.length, roomHeight: roomConfig.height,
                roomShape: roomConfig.shape, wallColor: roomConfig.wallColor, floorColor: roomConfig.floorColor,
                furniture: furniture.map(f => ({ name: f.name, modelType: f.modelType, position: f.position, rotation: f.rotation, scale: f.scale, color: f.color, dimensions: f.dimensions }))
            };
            if (currentDesignId) {
                await api.put(`/designs/${currentDesignId}`, designData);
                toast.success('Design updated!');
            } else {
                const res = await api.post('/designs', designData);
                setCurrentDesignId(res.data.design._id);
                toast.success('Design saved!');
            }
            // Navigate to Saved Designs after a successful save
            setDesignStep('shape-select');
            setActiveSection('saved');
        } catch (err) { toast.error('Failed to save design'); }
    };

    const loadDesign = (design) => {
        setCurrentDesignId(design._id);
        setDesignName(design.name);
        setRoomConfig({ width: design.roomWidth, length: design.roomLength, height: design.roomHeight || 3, shape: design.roomShape || 'rectangular', wallColor: design.wallColor, floorColor: design.floorColor });
        setFurniture(design.furniture.map(f => ({ ...f, id: f._id || Date.now() + Math.random() })));
        setSelectedFurniture(null);
        setDesignStep('design');
        setActiveSection('designer');
        toast.success('Design loaded!');
    };

    const loadTemplate = (template) => {
        setCurrentDesignId(null);
        setDesignName(template.name);
        setRoomConfig({ width: template.roomWidth, length: template.roomLength, height: 3, shape: 'rectangular', wallColor: template.wallColor, floorColor: template.floorColor });
        setFurniture(template.furniture.map(f => ({ ...f, id: Date.now() + Math.random() })));
        setSelectedFurniture(null);
        setDesignStep('design');
        setActiveSection('designer');
        toast.success(`Template "${template.name}" loaded!`);
    };

    const newDesign = () => {
        setCurrentDesignId(null); setDesignName('Untitled Design');
        setRoomConfig({ width: 6, length: 5, height: 3, shape: 'rectangular', wallColor: '#F5F5DC', floorColor: '#DEB887' });
        setFurniture([]); setSelectedFurniture(null);
        setDesignStep('shape-select');
        setActiveSection('designer');
    };

    const deleteDesign = async (id) => {
        try {
            await api.delete(`/designs/${id}`);
            setSavedDesigns(savedDesigns.filter(d => d._id !== id));
            toast.success('Design deleted');
        } catch (err) { toast.error('Failed to delete'); }
    };

    const selectedItem = selectedFurniture !== null ? furniture[selectedFurniture] : null;

    const totalCost = furniture.reduce((sum, item) => sum + (item.price || 0), 0);

    const sections = [
        { id: 'designer', label: 'Room Designer', icon: PenTool },
        { id: 'templates', label: 'Already Designed', icon: Layers },
        { id: 'saved', label: 'Saved Designs', icon: FolderOpen },
    ];

    return (
        <div style={{ minHeight: 'calc(100vh - 64px)', backgroundColor: 'var(--bg-primary)', fontFamily: 'system-ui, sans-serif', color: 'var(--text-primary)' }}>

            {/* Top Section Tabs */}
            <div style={{ padding: '1.5rem 2rem 0 2rem', backgroundColor: 'var(--bg-card)', borderBottom: '1px solid var(--border-color)' }}>
                <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', marginBottom: '2.5rem', marginTop: '1rem' }}>
                        <h1 style={{ fontSize: '2.5rem', fontWeight: '900', color: 'var(--text-primary)', margin: '0 0 0.5rem 0', letterSpacing: '-0.02em' }}>Room Designer</h1>
                        <p style={{ fontSize: '1rem', color: 'var(--text-muted)', margin: '0 0 1.5rem 0' }}>Create, explore, and manage your interior designs</p>
                        
                        <div style={{ display: 'flex', gap: '0.25rem', backgroundColor: 'var(--bg-secondary)', padding: '0.375rem', borderRadius: '2rem', width: 'fit-content' }}>
                            {sections.map(s => {
                                const active = activeSection === s.id;
                                return (
                                    <button key={s.id} onClick={() => setActiveSection(s.id)} style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.5rem', fontWeight: '700', fontSize: '0.85rem', border: 'none', cursor: 'pointer', backgroundColor: 'transparent', color: active ? (dark ? '#fff' : '#000') : 'var(--text-muted)', transition: 'color 0.2s', zIndex: 1, borderRadius: '1.5rem' }}>
                                        {active && (
                                            <motion.div layoutId="activeTabBadge" style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'var(--bg-card)', borderRadius: '1.5rem', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', zIndex: -1 }} transition={{ type: 'spring', stiffness: 500, damping: 30 }} />
                                        )}
                                        <s.icon style={{ width: '1rem', height: '1rem' }} /> {s.label}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>

            {/* SECTION: Shape Select */}
            {activeSection === 'designer' && designStep === 'shape-select' && (
                <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '3rem 2rem' }}>
                    <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                        <h2 style={{ fontSize: '2.5rem', fontWeight: '900', color: 'var(--text-primary)', marginBottom: '0.5rem', letterSpacing: '-0.02em' }}>Select Room Shape</h2>
                        <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)' }}>Choose a starting layout for your new room design</p>
                    </div>
                    
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
                        {ROOM_SHAPES.map((shape, i) => (
                            <motion.div 
                                key={shape.id}
                                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                                onClick={() => {
                                    const nc = { ...roomConfig, shape: shape.id, width: shape.defaultW, length: shape.defaultL };
                                    
                                    // Sweep and rebound all existing furniture so nothing falls out of bounds
                                    const updatedFurniture = furniture.map(item => {
                                        const constrainedPos = applyPositionConstraints(item.position.x, item.position.z, item, nc);
                                        return { ...item, position: { x: constrainedPos.x, y: item.position.y, z: constrainedPos.z }, rotation: constrainedPos.rotation };
                                    });

                                    setFurniture(updatedFurniture);
                                    setRoomConfig(nc);
                                    saveHistoryState(updatedFurniture, nc);
                                    setDesignStep('design');
                                }}
                                style={{ backgroundColor: 'var(--bg-card)', padding: '2rem', borderRadius: '1.5rem', border: '2px solid var(--border-color)', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', transition: 'all 0.2s' }}
                                onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 12px 24px rgba(99,102,241,0.1)'; }}
                                onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-color)'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
                            >
                                <div style={{ color: 'var(--accent)', marginBottom: '1.5rem', opacity: 0.9 }}>
                                    {shape.icon}
                                </div>
                                <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>{shape.name}</h3>
                                <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', margin: 0 }}>{shape.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            )}

            {/* SECTION: Room Designer */}
            {activeSection === 'designer' && designStep === 'design' && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 9999, display: 'flex', backgroundColor: 'var(--bg-secondary)', fontFamily: 'system-ui, sans-serif', color: 'var(--text-primary)' }}>
                    
                    {/* Floating Glassmorphic Left Panel */}
                    <div style={{ position: 'absolute', top: '1.5rem', left: '1.5rem', bottom: '1.5rem', width: '380px', display: 'flex', flexDirection: 'column', backgroundColor: dark ? 'rgba(30, 30, 30, 0.75)' : 'rgba(255, 255, 255, 0.85)', backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '1.5rem', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25), 0 0 0 1px rgba(0,0,0,0.05)', zIndex: 10, overflow: 'hidden' }}>
                        
                        {/* Editor Header */}
                        <div style={{ padding: '1.25rem', borderBottom: '1px solid rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: 'transparent' }}>
                            <button onClick={() => { setActiveSection('designer'); setDesignStep('shape-select'); }} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0.5rem', borderRadius: '50%', backgroundColor: 'rgba(0,0,0,0.05)', border: 'none', cursor: 'pointer', transition: 'all 0.2s' }} title="Back to Shape Select" onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(0,0,0,0.1)'} onMouseLeave={e => e.currentTarget.style.backgroundColor = 'rgba(0,0,0,0.05)'}>
                                <ArrowLeft style={{ width: '1.25rem', height: '1.25rem', color: 'var(--text-primary)' }} />
                            </button>
                            <span style={{ fontSize: '1.1rem', fontWeight: '800', color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>Room Editor</span>
                            <button onClick={saveDesign} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.5rem 1rem', borderRadius: '2rem', backgroundColor: 'var(--text-primary)', color: 'var(--bg-primary)', fontWeight: '700', fontSize: '0.75rem', border: 'none', cursor: 'pointer', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', transition: 'transform 0.2s' }} onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'} onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}>
                                <Save style={{ width: '1rem', height: '1rem' }} /> Save
                            </button>
                        </div>

                        {/* Scrolling Controls */}
                        <div className="custom-scroll" style={{ flex: 1, overflowY: 'auto', padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {/* Design Name */}
                            <div style={{ padding: '1.25rem', backgroundColor: 'var(--bg-card)', borderRadius: '1.25rem', border: '1px solid var(--border-color)' }}>
                            <label style={{ display: 'block', fontSize: '0.65rem', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.75rem' }}>Design Name</label>
                            <input value={designName} onChange={e => setDesignName(e.target.value)} style={{ width: '100%', padding: '0.875rem 1rem', borderRadius: '0.75rem', backgroundColor: 'var(--bg-secondary)', border: '1px solid transparent', fontSize: '0.875rem', fontWeight: '700', color: 'var(--text-primary)', outline: 'none', boxSizing: 'border-box', transition: 'all 0.2s', boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.02)' }} onFocus={e => e.currentTarget.style.borderColor = 'var(--accent)'} onBlur={e => e.currentTarget.style.borderColor = 'transparent'} placeholder="Name your masterpiece..." />
                        </div>

                        {/* Room Config */}
                        <div style={{ padding: '1.25rem', backgroundColor: 'var(--bg-card)', borderRadius: '1.25rem', border: '1px solid var(--border-color)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                                <h3 style={{ fontSize: '0.65rem', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0 }}>
                                    <Settings2 style={{ width: '0.875rem', height: '0.875rem' }} /> Settings
                                </h3>
                            </div>
                            <div style={{ marginBottom: '1rem' }}>
                                <label style={{ fontSize: '0.7rem', fontWeight: '700', color: 'var(--text-secondary)' }}>Room Layout</label>
                                <div style={{ display: 'flex', alignItems: 'center', marginTop: '0.375rem', borderRadius: '0.75rem', backgroundColor: 'var(--bg-secondary)', padding: '0.5rem 0.75rem', border: '1px solid transparent', boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.02)' }}>
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ width: '1rem', height: '1rem', color: 'var(--text-muted)', marginRight: '0.5rem' }}>
                                        <path d="M4 4h16v16H4z" strokeLinejoin="round" />
                                    </svg>
                                    <select value={roomConfig.shape || 'rectangular'} onChange={e => {
                                        const newShape = e.target.value;
                                        const shapeData = ROOM_SHAPES.find(s => s.id === newShape);
                                        const nc = { ...roomConfig, shape: newShape, width: shapeData.defaultW, length: shapeData.defaultL };
                                        
                                        // Sweep and rebound all existing furniture so nothing falls out of bounds
                                        const updatedFurniture = furniture.map(item => {
                                            const constrainedPos = applyPositionConstraints(item.position.x, item.position.z, item, nc);
                                            return { ...item, position: { x: constrainedPos.x, y: item.position.y, z: constrainedPos.z }, rotation: constrainedPos.rotation };
                                        });

                                        setFurniture(updatedFurniture);
                                        setRoomConfig(nc);
                                        saveHistoryState(updatedFurniture, nc);
                                    }} style={{ width: '100%', backgroundColor: 'transparent', border: 'none', fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-primary)', outline: 'none', cursor: 'pointer' }}>
                                        {ROOM_SHAPES.map(s => (
                                            <option key={s.id} value={s.id}>{s.name}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            {/* Width & Length — stepper + slider */}
                            {[
                                { label: 'Width', key: 'width' },
                                { label: 'Length', key: 'length' },
                            ].map(({ label, key }) => {
                                const val = roomConfig[key];
                                const set = (v) => {
                                    const clamped = Math.min(20, Math.max(2, Math.round(v * 2) / 2));
                                    const nc = { ...roomConfig, [key]: clamped };
                                    setRoomConfig(nc);
                                    saveHistoryState(furniture, nc);
                                };
                                const pct = ((val - 2) / (20 - 2)) * 100;
                                return (
                                    <div key={key} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                            <label style={{ fontSize: '0.7rem', fontWeight: '700', color: 'var(--text-secondary)' }}>{label}</label>
                                            <span style={{ fontSize: '0.75rem', fontWeight: '800', color: 'var(--text-primary)', fontVariantNumeric: 'tabular-nums' }}>{val.toFixed(1)} <span style={{ color: 'var(--text-muted)', fontWeight: '600' }}>m</span></span>
                                        </div>
                                        {/* Stepper row */}
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                            <button onClick={() => set(val - 0.5)}
                                                style={{ width: '2rem', height: '2rem', borderRadius: '50%', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-secondary)', color: 'var(--text-primary)', fontSize: '1.1rem', fontWeight: '700', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0, transition: 'all 0.15s' }}
                                                onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'var(--text-primary)'; e.currentTarget.style.color = 'var(--bg-primary)'; }}
                                                onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'var(--bg-secondary)'; e.currentTarget.style.color = 'var(--text-primary)'; }}>−</button>
                                            {/* Slider */}
                                            <div style={{ flex: 1, position: 'relative', height: '2rem', display: 'flex', alignItems: 'center' }}>
                                                <div style={{ position: 'absolute', left: 0, right: 0, height: '4px', borderRadius: '2px', background: 'var(--border-color)' }} />
                                                <div style={{ position: 'absolute', left: 0, width: `${pct}%`, height: '4px', borderRadius: '2px', background: 'var(--accent)', transition: 'width 0.1s' }} />
                                                <input type="range" min="2" max="20" step="0.5" value={val}
                                                    onChange={e => set(parseFloat(e.target.value))}
                                                    style={{ position: 'absolute', left: 0, right: 0, width: '100%', opacity: 0, height: '100%', cursor: 'pointer', margin: 0 }} />
                                            </div>
                                            <button onClick={() => set(val + 0.5)}
                                                style={{ width: '2rem', height: '2rem', borderRadius: '50%', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-secondary)', color: 'var(--text-primary)', fontSize: '1.1rem', fontWeight: '700', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0, transition: 'all 0.15s' }}
                                                onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'var(--text-primary)'; e.currentTarget.style.color = 'var(--bg-primary)'; }}
                                                onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'var(--bg-secondary)'; e.currentTarget.style.color = 'var(--text-primary)'; }}>+</button>
                                        </div>
                                    </div>
                                );
                            })}
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1rem', marginTop: '1rem' }}>
                                <div>
                                    <label style={{ fontSize: '0.7rem', fontWeight: '700', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.375rem' }}><Palette style={{ width: '0.75rem', height: '0.75rem' }} /> Wall Color</label>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.375rem', backgroundColor: 'var(--bg-secondary)', padding: '0.375rem', borderRadius: '0.75rem', boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.02)' }}>
                                        {/* Custom Color Native Picker */}
                                        <input type="color" value={roomConfig.wallColor} onChange={e => setRoomConfig({ ...roomConfig, wallColor: e.target.value })} onBlur={() => saveHistoryState(furniture, roomConfig)} style={{ width: '2rem', height: '2rem', borderRadius: '0.5rem', cursor: 'pointer', border: 'none' }} title="Pick Custom Color" />
                                        
                                        {/* Paint Pre-sets Dropdown */}
                                        <select value={roomConfig.wallColor} onChange={e => { const nc = { ...roomConfig, wallColor: e.target.value }; setRoomConfig(nc); saveHistoryState(furniture, nc); }} style={{ flex: 1, padding: '0.375rem', backgroundColor: 'transparent', border: 'none', fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-primary)', outline: 'none', cursor: 'pointer' }}>
                                            <optgroup label="Neutrals & Whites">
                                                <option value="#F8F9FA">Alabaster White</option>
                                                <option value="#E9ECEF">Soft Pearl</option>
                                                <option value="#DEE2E6">Light Greige</option>
                                                <option value="#CED4DA">Warm Sand</option>
                                            </optgroup>
                                            <optgroup label="Earth Tones">
                                                <option value="#DFD3C3">Sage Green</option>
                                                <option value="#C7B198">Soft Terracotta</option>
                                                <option value="#A6B1E1">Dusty Blue</option>
                                                <option value="#D4B499">Muted Clay</option>
                                            </optgroup>
                                            <optgroup label="Bold & Dark">
                                                <option value="#2B2D42">Navy Blue</option>
                                                <option value="#3A5A40">Hunter Green</option>
                                                <option value="#4A4A4A">Charcoal Grey</option>
                                                <option value="#5E548E">Deep Plum</option>
                                            </optgroup>
                                        </select>
                                    </div>
                                </div>
                                <div>
                                    <label style={{ fontSize: '0.7rem', fontWeight: '700', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.375rem' }}><Layers style={{ width: '0.75rem', height: '0.75rem' }} /> Floor Material</label>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.375rem', backgroundColor: 'var(--bg-secondary)', padding: '0.375rem', borderRadius: '0.75rem', boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.02)' }}>
                                        {/* Custom Color Native Picker */}
                                        <input type="color" value={roomConfig.floorColor} onChange={e => setRoomConfig({ ...roomConfig, floorColor: e.target.value })} onBlur={() => saveHistoryState(furniture, roomConfig)} style={{ width: '2rem', height: '2rem', borderRadius: '0.5rem', cursor: 'pointer', border: 'none' }} title="Pick Custom Color" />
                                        
                                        {/* Material Pre-sets Dropdown */}
                                        <select value={roomConfig.floorColor} onChange={e => { const nc = { ...roomConfig, floorColor: e.target.value }; setRoomConfig(nc); saveHistoryState(furniture, nc); }} style={{ flex: 1, padding: '0.375rem', backgroundColor: 'transparent', border: 'none', fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-primary)', outline: 'none', cursor: 'pointer' }}>
                                            <optgroup label="Hardwoods">
                                                <option value="#DEB887">Light Oak Finish</option>
                                                <option value="#A0522D">Sienna Hardwood</option>
                                                <option value="#3E2723">Dark Walnut Wood</option>
                                                <option value="#D2B48C">Natural Tan Ash</option>
                                            </optgroup>
                                            <optgroup label="Premium Tile & Stone">
                                                <option value="#F8F9FA">Carrara White Marble</option>
                                                <option value="#CED4DA">Polished Grey Concrete</option>
                                                <option value="#343A40">Matte Slate Stone</option>
                                                <option value="#E2725B">Terracotta Ceramic</option>
                                            </optgroup>
                                            <optgroup label="Carpets & Soft Covers">
                                                <option value="#FDF5E6">Ivory Plush Carpet</option>
                                                <option value="#EEDC82">Beige Woven Rug</option>
                                                <option value="#737373">Charcoal Office Carpet</option>
                                                <option value="#800020">Burgundy Hotel Carpet</option>
                                            </optgroup>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Structural Layout Elements */}
                        <div style={{ padding: '1.25rem 1.25rem 0 1.25rem', backgroundColor: 'var(--bg-card)', borderTopLeftRadius: '1.25rem', borderTopRightRadius: '1.25rem', border: '1px solid var(--border-color)', borderBottom: 'none' }}>
                            <h3 style={{ fontSize: '0.65rem', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>Structural Elements</h3>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                                {FURNITURE_CATALOG.filter(i => i.modelType === 'door' || i.modelType === 'window').map((item, i) => (
                                    <button key={`struct-${i}`} onClick={() => addFurniture(item)} style={{ padding: '0.625rem', borderRadius: '1rem', textAlign: 'left', background: 'var(--bg-secondary)', border: '1px solid transparent', cursor: 'pointer', transition: 'all 0.2s', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }} onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 6px 16px rgba(0,0,0,0.06)'; e.currentTarget.style.borderColor = 'var(--border-color)'; }} onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.02)'; e.currentTarget.style.borderColor = 'transparent'; }}>
                                        <div style={{ width: '100%', height: '4.5rem', borderRadius: '0.625rem', marginBottom: '0.75rem', overflow: 'hidden', backgroundColor: 'var(--bg-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                                            {item.image ? (
                                                <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                            ) : (
                                                <div style={{ width: '2rem', height: '2rem', borderRadius: '0.5rem', backgroundColor: item.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                    <span style={{ color: '#fff', fontSize: '0.8rem', fontWeight: 'bold' }}>+</span>
                                                </div>
                                            )}
                                        </div>
                                        <p style={{ fontSize: '0.7rem', fontWeight: '700', color: 'var(--text-primary)', margin: '0 0 0.25rem 0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.name}</p>
                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.25rem', marginTop: '0.25rem' }}>
                                            <p style={{ fontSize: '0.6rem', color: 'var(--text-muted)', margin: 0, fontWeight: '600', whiteSpace: 'nowrap' }}>{item.dimensions.width}×{item.dimensions.depth}m</p>
                                            {item.price && <span style={{ fontSize: '0.65rem', fontWeight: '800', color: '#10B981', whiteSpace: 'nowrap' }}>${item.price.toLocaleString()}</span>}
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Furniture Palette */}
                        <div style={{ padding: '1.25rem', backgroundColor: 'var(--bg-card)', borderBottomLeftRadius: '1.25rem', borderBottomRightRadius: '1.25rem', border: '1px solid var(--border-color)', borderTop: 'none', flex: 1 }}>
                            <h3 style={{ fontSize: '0.65rem', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>Add Decor</h3>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                                {FURNITURE_CATALOG.filter(i => i.modelType !== 'door' && i.modelType !== 'window').map((item, i) => (
                                    <button key={`decor-${i}`} onClick={() => addFurniture(item)} style={{ padding: '0.625rem', borderRadius: '1rem', textAlign: 'left', background: 'var(--bg-secondary)', border: '1px solid transparent', cursor: 'pointer', transition: 'all 0.2s', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }} onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 6px 16px rgba(0,0,0,0.06)'; e.currentTarget.style.borderColor = 'var(--border-color)'; }} onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.02)'; e.currentTarget.style.borderColor = 'transparent'; }}>
                                        <div style={{ width: '100%', height: '4.5rem', borderRadius: '0.625rem', marginBottom: '0.75rem', overflow: 'hidden', backgroundColor: 'var(--bg-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                                            {item.image ? (
                                                <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                            ) : (
                                                <div style={{ width: '2rem', height: '2rem', borderRadius: '0.5rem', backgroundColor: item.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                    <span style={{ color: '#fff', fontSize: '0.8rem', fontWeight: 'bold' }}>+</span>
                                                </div>
                                            )}
                                        </div>
                                        <p style={{ fontSize: '0.7rem', fontWeight: '700', color: 'var(--text-primary)', margin: '0 0 0.25rem 0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.name}</p>
                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.25rem', marginTop: '0.25rem' }}>
                                            <p style={{ fontSize: '0.6rem', color: 'var(--text-muted)', margin: 0, fontWeight: '600', whiteSpace: 'nowrap' }}>{item.dimensions.width}×{item.dimensions.depth}m</p>
                                            {item.price && <span style={{ fontSize: '0.65rem', fontWeight: '800', color: '#10B981', whiteSpace: 'nowrap' }}>${item.price.toLocaleString()}</span>}
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main canvas area — paddingLeft clears the absolutely-positioned sidebar so the 3D/2D canvas is centred in the visible open space */}
                    <div style={{ flex: 1, position: 'relative', overflow: 'hidden', backgroundColor: 'var(--bg-secondary)', paddingLeft: 'calc(380px + 3rem)' }}>
                        
                        {/* Floating View Toggle */}
                        <div style={{ position: 'absolute', top: '1.5rem', left: 'calc(380px + 3rem)', zIndex: 10, display: 'flex', backgroundColor: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(12px)', borderRadius: '1rem', padding: '0.375rem', boxShadow: '0 4px 15px rgba(0,0,0,0.08)', border: '1px solid rgba(0,0,0,0.05)' }}>
                            <button onClick={() => setView('2d')} style={{ padding: '0.625rem 1.25rem', fontSize: '0.75rem', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '0.5rem', border: 'none', cursor: 'pointer', backgroundColor: view === '2d' ? 'var(--bg-primary)' : 'transparent', color: view === '2d' ? 'var(--text-primary)' : 'var(--text-secondary)', borderRadius: '0.75rem', transition: 'all 0.2s', boxShadow: view === '2d' ? '0 2px 8px rgba(0,0,0,0.05)' : 'none' }}>
                                <LayoutGrid style={{ width: '1rem', height: '1rem' }} /> 2D Layout
                            </button>
                            <button onClick={() => setView('3d')} style={{ padding: '0.625rem 1.25rem', fontSize: '0.75rem', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '0.5rem', border: 'none', cursor: 'pointer', backgroundColor: view === '3d' ? 'var(--bg-primary)' : 'transparent', color: view === '3d' ? 'var(--text-primary)' : 'var(--text-secondary)', borderRadius: '0.75rem', transition: 'all 0.2s', boxShadow: view === '3d' ? '0 2px 8px rgba(0,0,0,0.05)' : 'none' }}>
                                <Eye style={{ width: '1rem', height: '1rem' }} /> 3D View
                            </button>
                        </div>

                        {/* Floating Live Cost Calculator */}
                        {totalCost > 0 && (
                            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ position: 'absolute', bottom: '1.5rem', left: 'calc(380px + 3rem)', zIndex: 10, display: 'flex', flexDirection: 'column', gap: '0.125rem', backgroundColor: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(12px)', borderRadius: '1rem', padding: '0.875rem 1.25rem', boxShadow: '0 8px 30px rgba(0,0,0,0.12)', border: '1px solid rgba(0,0,0,0.05)' }}>
                                <span style={{ fontSize: '0.65rem', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)' }}>Estimated Cost</span>
                                <span style={{ fontSize: '1.25rem', fontWeight: '900', color: '#10B981', display: 'flex', alignItems: 'center', gap: '0.25rem', letterSpacing: '-0.02em' }}>
                                    ${totalCost.toLocaleString()}
                                </span>
                            </motion.div>
                        )}

                        {/* Floating Action Menu (Context + History) */}
                        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} style={{ position: 'absolute', top: '1.25rem', right: '1.25rem', zIndex: 10, display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(12px)', borderRadius: '1rem', padding: '0.5rem 0.5rem 0.5rem 1rem', boxShadow: '0 4px 15px rgba(0,0,0,0.08)', border: '1px solid rgba(0,0,0,0.05)' }}>
                            <AnimatePresence>
                                {selectedItem && (
                                    <motion.div initial={{ opacity: 0, width: 0, overflow: 'hidden' }} animate={{ opacity: 1, width: 'auto', overflow: 'visible' }} exit={{ opacity: 0, width: 0, overflow: 'hidden' }} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexShrink: 0 }}>
                                        <span style={{ fontSize: '0.75rem', fontWeight: '800', color: 'var(--text-primary)', marginRight: '0.5rem', whiteSpace: 'nowrap' }}>{selectedItem.name}</span>
                                        <div style={{ width: '1px', height: '1.5rem', backgroundColor: 'var(--border-color)', margin: '0 0.25rem' }} />
                                        <input type="color" value={selectedItem.color} onChange={e => { const nf = [...furniture]; nf[selectedFurniture].color = e.target.value; setFurniture(nf); }} style={{ width: '2rem', height: '2rem', borderRadius: '0.5rem', cursor: 'pointer', border: 'none' }} title="Change color" />
                                        <motion.button whileHover={{ scale: 1.05, backgroundColor: '#E0E7FF', color: '#4F46E5', borderColor: '#C7D2FE' }} whileTap={{ scale: 0.95 }} onClick={rotateSelected} style={{ padding: '0.4rem 0.875rem', borderRadius: '0.5rem', border: '1px solid transparent', cursor: 'pointer', backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.375rem', fontWeight: '700', fontSize: '0.75rem' }} title="Rotate 45°"><RotateCw style={{ width: '0.875rem', height: '0.875rem' }} /> Rotate</motion.button>
                                        <motion.button whileHover={{ scale: 1.05, backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }} whileTap={{ scale: 0.95 }} onClick={() => scaleSelected(1.1)} style={{ padding: '0.4rem 0.75rem', borderRadius: '0.5rem', border: '1px solid transparent', cursor: 'pointer', backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)', fontSize: '0.75rem', fontWeight: '700' }}>Scale +</motion.button>
                                        <motion.button whileHover={{ scale: 1.05, backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }} whileTap={{ scale: 0.95 }} onClick={() => scaleSelected(0.9)} style={{ padding: '0.4rem 0.75rem', borderRadius: '0.5rem', border: '1px solid transparent', cursor: 'pointer', backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)', fontSize: '0.75rem', fontWeight: '700' }}>Scale -</motion.button>
                                        <div style={{ width: '1px', height: '1.5rem', backgroundColor: 'var(--border-color)', margin: '0 0.25rem' }} />
                                        <motion.button whileHover={{ scale: 1.1, backgroundColor: '#FEE2E2' }} whileTap={{ scale: 0.9 }} onClick={deleteSelected} style={{ padding: '0.5rem', borderRadius: '0.5rem', border: 'none', cursor: 'pointer', backgroundColor: '#FEF2F2', color: '#EF4444', display: 'flex' }} title="Delete"><Trash2 style={{ width: '1rem', height: '1rem' }} /></motion.button>
                                        <div style={{ width: '1px', height: '1.5rem', backgroundColor: 'var(--border-color)', margin: '0 0.25rem' }} />
                                    </motion.div>
                                )}
                            </AnimatePresence>
                            
                            <motion.button whileHover={{ scale: historyStep > 0 ? 1.1 : 1 }} whileTap={{ scale: historyStep > 0 ? 0.9 : 1 }} onClick={handleUndo} disabled={historyStep <= 0} style={{ padding: '0.4rem', borderRadius: '0.5rem', border: '1px solid transparent', cursor: historyStep > 0 ? 'pointer' : 'not-allowed', backgroundColor: 'var(--bg-primary)', opacity: historyStep > 0 ? 1 : 0.4, display: 'flex' }} title="Undo"><Undo2 style={{ width: '1rem', height: '1rem', color: 'var(--text-secondary)' }}/></motion.button>
                            <motion.button whileHover={{ scale: historyStep < history.length - 1 ? 1.1 : 1 }} whileTap={{ scale: historyStep < history.length - 1 ? 0.9 : 1 }} onClick={handleRedo} disabled={historyStep >= history.length - 1} style={{ padding: '0.4rem', borderRadius: '0.5rem', border: '1px solid transparent', cursor: historyStep < history.length - 1 ? 'pointer' : 'not-allowed', backgroundColor: 'var(--bg-primary)', opacity: historyStep < history.length - 1 ? 1 : 0.4, display: 'flex' }} title="Redo"><Redo2 style={{ width: '1rem', height: '1rem', color: 'var(--text-secondary)' }}/></motion.button>
                        </motion.div>

                        {/* Rendering Context */}
                        <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            {view === '2d' ? (
                                <canvas ref={canvasRef} onMouseDown={handleCanvasMouseDown} onMouseMove={handleCanvasMouseMove} onMouseUp={handleCanvasMouseUp} onMouseLeave={handleCanvasMouseUp} style={{ cursor: 'crosshair', boxShadow: '0 20px 40px rgba(0,0,0,0.08)', background: 'white' }} />
                            ) : (
                                <Viewer3D roomConfig={roomConfig} furniture={furniture} selectedFurniture={selectedFurniture} onSelectFurniture={setSelectedFurniture} onUpdateFurniture={(index, updates, isDragEnd) => { 
                                    const nf = [...furniture]; 
                                    const currentItem = { ...nf[index], ...updates };
                                    if (updates.position) {
                                        const constrained = applyPositionConstraints(updates.position.x, updates.position.z, currentItem, roomConfig);
                                        currentItem.position.x = constrained.x;
                                        currentItem.position.z = constrained.z;
                                        currentItem.rotation = constrained.rotation;
                                    }
                                    nf[index] = currentItem;
                                    setFurniture(nf); 
                                    if (isDragEnd) saveHistoryState(nf, roomConfig); 
                                }} />
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* SECTION: Already Designed (Templates) */}
            {activeSection === 'templates' && (
                <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '2.5rem 2rem' }}>
                    <div style={{ marginBottom: '2rem' }}>
                        <h2 style={{ fontSize: '1.75rem', fontWeight: '900', color: 'var(--text-primary)', margin: '0 0 0.5rem 0' }}>Pre-Made Designs</h2>
                        <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', margin: 0 }}>Browse professionally crafted room templates and customize them to your liking</p>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '2rem' }}>
                        {PREMADE_DESIGNS.map((template, i) => (
                            <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1, duration: 0.5, ease: [0.22, 1, 0.36, 1] }} style={{ backgroundColor: 'var(--bg-card)', borderRadius: '1.5rem', border: '1px solid var(--border-color)', overflow: 'hidden', cursor: 'pointer', display: 'flex', flexDirection: 'column' }} onClick={() => loadTemplate(template)} whileHover={{ y: -8, boxShadow: '0 20px 40px rgba(0,0,0,0.08)' }}>
                                {/* Color Preview */}
                                <div style={{ height: '180px', background: `linear-gradient(135deg, ${template.wallColor}, ${template.floorColor})`, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
                                    <div style={{ absolute: 'inset-0', background: 'radial-gradient(circle at center, transparent 0%, rgba(0,0,0,0.2) 100%)' }} />
                                    <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', justifyContent: 'center', padding: '1.5rem', position: 'relative', zIndex: 10 }}>
                                        {template.furniture.slice(0, 4).map((f, j) => (
                                            <div key={j} style={{ width: '3rem', height: '3rem', borderRadius: '0.75rem', backgroundColor: f.color, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.15)', border: '2px solid rgba(255,255,255,0.2)' }}>
                                                <span style={{ color: '#fff', fontSize: '0.75rem', fontWeight: 'bold' }}>{f.name[0]}</span>
                                            </div>
                                        ))}
                                        {template.furniture.length > 4 && (
                                            <div style={{ width: '3rem', height: '3rem', borderRadius: '0.75rem', backgroundColor: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '0.75rem', fontWeight: '800' }}>
                                                +{template.furniture.length - 4}
                                            </div>
                                        )}
                                    </div>
                                    <div style={{ position: 'absolute', top: '1.25rem', right: '1.25rem', backgroundColor: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(12px)', color: 'var(--text-primary)', padding: '0.375rem 0.875rem', borderRadius: '9999px', fontSize: '0.7rem', fontWeight: '800', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>{template.roomWidth}m × {template.roomLength}m</div>
                                </div>
                                <div style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
                                    <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--text-primary)', margin: '0 0 0.75rem 0' }}>{template.name}</h3>
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid var(--border-color)' }}>
                                        <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)', fontWeight: '600' }}>{template.furniture.length} items</span>
                                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.8rem', fontWeight: '700', color: 'var(--accent)' }}>
                                            Use Template <ArrowRight style={{ width: '1rem', height: '1rem' }} />
                                        </span>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            )}

            {/* SECTION: Saved Designs */}
            {activeSection === 'saved' && (
                <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '2.5rem 2rem' }}>
                    <div style={{ marginBottom: '2rem' }}>
                        <h2 style={{ fontSize: '1.75rem', fontWeight: '900', color: 'var(--text-primary)', margin: '0 0 0.5rem 0' }}>Saved Designs</h2>
                        <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', margin: 0 }}>Your personal collection of room designs</p>
                    </div>

                    {!user ? (
                        <div style={{ textAlign: 'center', padding: '4rem 0', backgroundColor: 'var(--bg-card)', borderRadius: '2rem', border: '1px solid var(--border-color)' }}>
                            <FolderOpen style={{ width: '3rem', height: '3rem', color: 'var(--text-muted)', marginBottom: '1rem', margin: '0 auto 1rem' }} />
                            <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>Sign in to view your designs</h3>
                            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>Create an account to save and manage your room designs</p>
                            <Link to="/login" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.5rem', borderRadius: '1rem', backgroundColor: '#D4F670', color: '#000', fontWeight: '700', fontSize: '0.8rem', textDecoration: 'none' }}>Sign In</Link>
                        </div>
                    ) : loadingSaved ? (
                        <div style={{ textAlign: 'center', padding: '4rem 0' }}>
                            <div className="w-5 h-5 border-2 border-gray-900 border-t-transparent rounded-full animate-spin" style={{ margin: '0 auto' }} />
                        </div>
                    ) : savedDesigns.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '4rem 0', backgroundColor: 'var(--bg-card)', borderRadius: '2rem', border: '1px solid var(--border-color)' }}>
                            <PenTool style={{ width: '3rem', height: '3rem', color: 'var(--text-muted)', margin: '0 auto 1rem' }} />
                            <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>No saved designs yet</h3>
                            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>Start designing and save your first room!</p>
                            <button onClick={() => setActiveSection('designer')} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.5rem', borderRadius: '1rem', backgroundColor: '#D4F670', color: '#000', fontWeight: '700', fontSize: '0.8rem', border: 'none', cursor: 'pointer' }}>
                                <PenTool style={{ width: '0.875rem', height: '0.875rem' }} /> Start Designing
                            </button>
                        </div>
                    ) : (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '2rem' }}>
                            {savedDesigns.map((d, i) => (
                                <motion.div key={d._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05, duration: 0.4, ease: [0.22, 1, 0.36, 1] }} style={{ backgroundColor: 'var(--bg-card)', borderRadius: '1.5rem', border: '1px solid var(--border-color)', overflow: 'hidden', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column' }} whileHover={{ y: -6, boxShadow: '0 20px 40px rgba(0,0,0,0.08)' }}>
                                    <div style={{ height: '140px', background: `linear-gradient(135deg, ${d.wallColor || '#F5F5DC'}, ${d.floorColor || '#DEB887'})`, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                                        <PenTool style={{ width: '2.5rem', height: '2.5rem', color: 'rgba(0,0,0,0.15)' }} />
                                        <div style={{ position: 'absolute', top: '0.75rem', right: '0.75rem', display: 'flex', gap: '0.375rem' }}>
                                            <button onClick={() => loadDesign(d)} style={{ width: '2rem', height: '2rem', borderRadius: '0.5rem', backgroundColor: 'rgba(255,255,255,0.9)', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#3B82F6' }}><Edit style={{ width: '0.875rem', height: '0.875rem' }} /></button>
                                            <button onClick={() => deleteDesign(d._id)} style={{ width: '2rem', height: '2rem', borderRadius: '0.5rem', backgroundColor: 'rgba(255,255,255,0.9)', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#EF4444' }}><Trash2 style={{ width: '0.875rem', height: '0.875rem' }} /></button>
                                        </div>
                                    </div>
                                    <div style={{ padding: '1.25rem' }}>
                                        <h3 style={{ fontSize: '1rem', fontWeight: '800', color: 'var(--text-primary)', margin: '0 0 0.5rem 0' }}>{d.name || 'Untitled'}</h3>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                                            <span style={{ fontSize: '0.7rem', fontWeight: '700', color: 'var(--text-muted)', backgroundColor: 'var(--bg-secondary)', padding: '0.25rem 0.625rem', borderRadius: '9999px' }}>{d.roomWidth}m × {d.roomLength}m</span>
                                            <span style={{ fontSize: '0.7rem', fontWeight: '700', color: 'var(--text-muted)', backgroundColor: 'var(--bg-secondary)', padding: '0.25rem 0.625rem', borderRadius: '9999px' }}>{d.furniture?.length || 0} items</span>
                                            <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}><Clock style={{ width: '0.7rem', height: '0.7rem' }} /> {new Date(d.updatedAt).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
