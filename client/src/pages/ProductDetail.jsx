import { useState, useEffect, useMemo, Suspense } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Star, Minus, Plus, ArrowLeft, Check, ShoppingBag, Truck, Shield, RotateCcw, Cuboid, Image as ImageIcon } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import toast from 'react-hot-toast';
import api from '../api';
import { FURNITURE_CATALOG } from './RoomDesigner';

function GLBProductModel({ url, color }) {
    const { scene } = useGLTF(url);
    const clonedScene = useMemo(() => scene.clone(), [scene]);

    useMemo(() => {
        clonedScene.traverse((child) => {
            if (child.isMesh) {
                child.castShadow = true;
                child.receiveShadow = true;
                if (color) {
                    const applyColor = (mat) => {
                        const m = mat.clone();
                        m.color.set(color);
                        return m;
                    };
                    if (Array.isArray(child.material)) {
                        child.material = child.material.map(applyColor);
                    } else if (child.material) {
                        child.material = applyColor(child.material);
                    }
                }
            }
        });
    }, [clonedScene, color]);

    const { positionOffset, scale } = useMemo(() => {
        const box = new THREE.Box3().setFromObject(clonedScene);
        const size = box.getSize(new THREE.Vector3());
        const center = box.getCenter(new THREE.Vector3());
        const maxDim = Math.max(size.x, size.y, size.z);
        const s = 3.5 / maxDim;
        return {
            positionOffset: [-center.x * s, -center.y * s, -center.z * s],
            scale: [s, s, s]
        };
    }, [clonedScene]);

    return (
        <group position={positionOffset} scale={scale}>
            <primitive object={clonedScene} />
        </group>
    );
}

function getFallbackImage(catName) {
    const name = (catName || '').toLowerCase();
    if (name.includes('sofa')) return 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=900';
    if (name.includes('chair')) return 'https://images.unsplash.com/photo-1592078615290-033ee584e267?auto=format&fit=crop&q=80&w=900';
    if (name.includes('table')) return 'https://images.unsplash.com/photo-1577140917170-2856f6aa9ec5?auto=format&fit=crop&q=80&w=900';
    if (name.includes('bed')) return 'https://images.unsplash.com/photo-1505693314120-0d443867891c?auto=format&fit=crop&q=80&w=900';
    if (name.includes('light')) return 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&q=80&w=900';
    return 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&q=80&w=900';
}

export default function ProductDetail() {
    const { id } = useParams();
    const { addItem } = useCart();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedColor, setSelectedColor] = useState(0);
    const [qty, setQty] = useState(1);
    const [viewMode, setViewMode] = useState('image'); // 'image' | '3d'

    useEffect(() => {
        api.get(`/products/${id}`)
            .then(r => setProduct(r.data.product))
            .catch(() => {})
            .finally(() => setLoading(false));
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-(--bg-primary)">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-10 h-10 border-2 border-(--border-color) border-t-(--text-primary) rounded-full animate-spin" />
                    <p className="text-sm text-(--text-muted) tracking-widest uppercase">Loading…</p>
                </div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-(--bg-primary) text-center px-6">
                <p className="text-2xl font-bold text-(--text-primary) mb-4">Product not found</p>
                <Link to="/shop" className="btn-primary px-8 py-3 rounded-xl text-sm font-semibold">Back to Shop</Link>
            </div>
        );
    }

    const imageUrl = product.images?.[0]?.url || product.images?.[0] || getFallbackImage(product.category?.name);
    const catalogMatch = FURNITURE_CATALOG.find(item => item.name.toLowerCase() === product.name.toLowerCase());
    const has3DModel = !!catalogMatch?.model;
    const activeHexColor = product.colors?.[selectedColor]?.hex;
    const rating = product.rating || 5;

    return (
        <div className="min-h-screen bg-(--bg-primary)">
            {/* Top nav */}
            <div className="container-centered pt-32 pb-4">
                <Link
                    to="/shop"
                    className="inline-flex items-center gap-2 text-sm font-medium text-(--text-muted) hover:text-(--text-primary) transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Shop
                </Link>
            </div>

            {/* Main grid */}
            <div className="container-centered pb-32">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">

                    {/* ── LEFT: image / 3D viewer ── */}
                    <div className="flex flex-col gap-4">
                        {/* Media frame */}
                        <div className="relative w-full aspect-square rounded-2xl overflow-hidden bg-(--bg-secondary)">
                            {viewMode === 'image' ? (
                                <img
                                    src={imageUrl}
                                    alt={product.name}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <Canvas shadows camera={{ position: [0, 1.5, 6], fov: 42 }} className="w-full h-full">
                                    <ambientLight intensity={0.7} />
                                    <directionalLight position={[8, 12, 8]} intensity={1.5} castShadow shadow-bias={-0.0001} />
                                    <Environment preset="apartment" />
                                    <Suspense fallback={null}>
                                        <GLBProductModel url={catalogMatch.model} color={activeHexColor} />
                                    </Suspense>
                                    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2, 0]} receiveShadow>
                                        <planeGeometry args={[40, 40]} />
                                        <shadowMaterial transparent opacity={0.12} />
                                    </mesh>
                                    <OrbitControls
                                        enableZoom={false}
                                        enablePan={false}
                                        autoRotate
                                        autoRotateSpeed={0.6}
                                        minPolarAngle={Math.PI / 5}
                                        maxPolarAngle={Math.PI / 2}
                                    />
                                </Canvas>
                            )}

                            {/* 3D hint badge */}
                            {viewMode === '3d' && (
                                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 backdrop-blur-sm text-white text-[10px] font-semibold tracking-widest uppercase px-4 py-1.5 rounded-full pointer-events-none">
                                    Drag to rotate
                                </div>
                            )}
                        </div>

                        {/* View toggle row */}
                        {has3DModel && (
                            <div className="flex items-center gap-1 p-1 rounded-xl bg-(--bg-secondary) border border-(--border-color) w-fit">
                                <button
                                    onClick={() => setViewMode('image')}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-[13px] font-semibold transition-all ${viewMode === 'image' ? 'bg-(--bg-primary) text-(--text-primary) shadow-sm' : 'text-(--text-muted) hover:text-(--text-primary)'}`}
                                >
                                    <ImageIcon className="w-3.5 h-3.5" /> Photo
                                </button>
                                <button
                                    onClick={() => setViewMode('3d')}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-[13px] font-semibold transition-all ${viewMode === '3d' ? 'bg-(--bg-primary) text-(--text-primary) shadow-sm' : 'text-(--text-muted) hover:text-(--text-primary)'}`}
                                >
                                    <Cuboid className="w-3.5 h-3.5" /> 3D View
                                </button>
                            </div>
                        )}
                    </div>

                    {/* ── RIGHT: details ── */}
                    <div className="flex flex-col gap-6 pt-2">
                        {/* Category badge */}
                        <span className="text-xs font-bold tracking-[0.2em] uppercase text-(--accent)">
                            {product.category?.name || 'Furniture'}
                        </span>

                        {/* Name */}
                        <h1 className="text-3xl md:text-4xl font-bold text-(--text-primary) leading-tight">
                            {product.name}
                        </h1>

                        {/* Stars + reviews */}
                        <div className="flex items-center gap-3">
                            <div className="flex gap-0.5">
                                {[...Array(5)].map((_, i) => (
                                    <Star
                                        key={i}
                                        className="w-4 h-4"
                                        fill={i < Math.floor(rating) ? '#f59e0b' : 'none'}
                                        color={i < Math.floor(rating) ? '#f59e0b' : 'var(--border-color)'}
                                    />
                                ))}
                            </div>
                            <span className="text-sm text-(--text-muted)">
                                {product.reviewCount > 0 ? `${product.reviewCount} reviews` : 'No reviews yet'}
                            </span>
                        </div>

                        {/* Price */}
                        <p className="text-3xl font-extrabold text-(--text-primary)">
                            ${product.price?.toLocaleString()}
                        </p>

                        {/* Divider */}
                        <hr className="border-(--border-color)" />

                        {/* Description */}
                        <p className="text-[15px] text-(--text-secondary) leading-relaxed">
                            {product.description}
                        </p>

                        {/* Color selector */}
                        {product.colors?.length > 0 && (
                            <div className="flex flex-col gap-3">
                                <p className="text-sm font-semibold text-(--text-primary)">
                                    Color: <span className="text-(--text-muted) font-normal">{product.colors[selectedColor]?.name}</span>
                                </p>
                                <div className="flex flex-wrap gap-3">
                                    {product.colors.map((c, i) => (
                                        <button
                                            key={i}
                                            onClick={() => setSelectedColor(i)}
                                            title={c.name}
                                            className="w-9 h-9 rounded-full flex items-center justify-center transition-transform hover:scale-110"
                                            style={{
                                                backgroundColor: c.hex,
                                                boxShadow: selectedColor === i
                                                    ? `0 0 0 2px var(--bg-primary), 0 0 0 4px var(--text-primary)`
                                                    : '0 0 0 1.5px var(--border-color)'
                                            }}
                                        >
                                            {selectedColor === i && (
                                                <Check className="w-4 h-4 text-white mix-blend-difference drop-shadow" />
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Dimensions */}
                        {product.dimensions && (
                            <div className="grid grid-cols-3 gap-4 p-4 rounded-xl bg-(--bg-secondary) border border-(--border-color)">
                                {[
                                    { label: 'Width', val: product.dimensions.width },
                                    { label: 'Height', val: product.dimensions.height },
                                    { label: 'Depth', val: product.dimensions.depth },
                                ].map(d => (
                                    <div key={d.label} className="text-center">
                                        <p className="text-[11px] text-(--text-muted) uppercase tracking-wider mb-1">{d.label}</p>
                                        <p className="text-base font-bold text-(--text-primary)">{d.val}m</p>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Quantity + Add to Cart */}
                        <div className="flex items-center gap-3 mt-2">
                            {/* Qty */}
                            <div className="flex items-center border border-(--border-color) rounded-xl overflow-hidden">
                                <button
                                    onClick={() => setQty(q => Math.max(1, q - 1))}
                                    className="w-11 h-12 flex items-center justify-center text-(--text-primary) hover:bg-(--bg-secondary) transition-colors"
                                >
                                    <Minus className="w-4 h-4" />
                                </button>
                                <span className="w-10 h-12 flex items-center justify-center text-[15px] font-bold text-(--text-primary) border-x border-(--border-color) select-none">
                                    {qty}
                                </span>
                                <button
                                    onClick={() => setQty(q => q + 1)}
                                    className="w-11 h-12 flex items-center justify-center text-(--text-primary) hover:bg-(--bg-secondary) transition-colors"
                                >
                                    <Plus className="w-4 h-4" />
                                </button>
                            </div>

                            {/* Add to cart */}
                            <button
                                onClick={() => {
                                    addItem({ ...product, quantity: qty, selectedColor: product.colors?.[selectedColor]?.name });
                                    toast.success(`${product.name} added to cart!`);
                                }}
                                disabled={!product.inStock}
                                className="flex-1 h-12 flex items-center justify-center gap-2 rounded-xl bg-(--text-primary) text-(--bg-primary) text-sm font-bold uppercase tracking-wider hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-40 disabled:pointer-events-none"
                            >
                                <ShoppingBag className="w-4 h-4" />
                                {product.inStock ? 'Add to Cart' : 'Out of Stock'}
                            </button>
                        </div>

                        {/* Trust badges */}
                        <div className="grid grid-cols-3 gap-4 pt-4">
                            {[
                                { icon: Truck, label: 'Free Shipping', sub: 'Orders over $999' },
                                { icon: Shield, label: '2-Year Warranty', sub: 'All products' },
                                { icon: RotateCcw, label: '30-Day Returns', sub: 'Hassle free' },
                            ].map(b => (
                                <div key={b.label} className="flex flex-col items-center text-center gap-2">
                                    <div className="w-9 h-9 rounded-full bg-(--bg-secondary) flex items-center justify-center">
                                        <b.icon className="w-4 h-4 text-(--accent)" />
                                    </div>
                                    <p className="text-[12px] font-semibold text-(--text-primary) leading-tight">{b.label}</p>
                                    <p className="text-[11px] text-(--text-muted)">{b.sub}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
