'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, Trash2, Calendar, User, RefreshCw, ExternalLink } from 'lucide-react';
import Image from 'next/image';

interface Photo {
    id: string;
    url: string;
    caption: string;
    user: string;
    uploadedAt: string;
    status: string;
}

export default function AdminGalleryPage() {
    const router = useRouter();
    const [photos, setPhotos] = useState<Photo[]>([]);
    const [loading, setLoading] = useState(true);
    const [deletingId, setDeletingId] = useState<string | null>(null);

    const fetchPhotos = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/admin/gallery');
            const data = await res.json();
            if (data.photos) {
                setPhotos(data.photos);
            }
        } catch (error) {
            console.error("Failed to fetch photos", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPhotos();
    }, []);

    const handleDelete = async (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        if (!window.confirm("Are you sure you want to archive this photo?")) return;

        setDeletingId(id);
        try {
            const res = await fetch('/api/admin/gallery/delete', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ pageId: id })
            });

            if (res.ok) {
                setPhotos(prev => prev.filter(p => p.id !== id));
            } else {
                alert("Failed to delete photo");
            }
        } catch (error) {
            console.error("Delete error", error);
            alert("Error archiving photo");
        } finally {
            setDeletingId(null);
        }
    };

    return (
        <main className="min-h-screen bg-slate-950 text-white p-6 md:p-12 relative overflow-hidden">
            {/* Background Gradients */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
                <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[100px]" />
                <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[100px]" />
            </div>

            <div className="max-w-7xl mx-auto relative z-10">
                {/* Header */}
                <div className="flex items-center justify-between mb-8 cursor-pointer group" onClick={() => router.push('/admin')}>
                    <div className="flex items-center gap-4">
                        <div className="p-2 bg-slate-800/50 rounded-full border border-white/10 group-hover:bg-slate-800 transition-colors">
                            <ArrowLeft className="w-5 h-5 text-slate-400 group-hover:text-white" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
                                Gallery Management
                            </h1>
                            <p className="text-slate-400 text-sm">Manage Photo Booth uploads</p>
                        </div>
                    </div>
                    <button
                        onClick={(e) => { e.stopPropagation(); fetchPhotos(); }}
                        className="p-2 bg-slate-800/50 hover:bg-slate-800 rounded-lg border border-white/10 transition-colors"
                    >
                        <RefreshCw className={`w-5 h-5 text-slate-400 ${loading ? 'animate-spin' : ''}`} />
                    </button>
                </div>

                {/* Grid */}
                {loading && photos.length === 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                            <div key={n} className="aspect-square bg-slate-900/50 rounded-xl animate-pulse border border-white/5" />
                        ))}
                    </div>
                ) : photos.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-slate-500">
                        <div className="w-16 h-16 bg-slate-900/50 rounded-full flex items-center justify-center mb-4 border border-white/5">
                            <ExternalLink className="w-8 h-8 opacity-50" />
                        </div>
                        <p>No photos uploaded yet.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {photos.map((photo, index) => (
                            <motion.div
                                key={photo.id}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: index * 0.05 }}
                                className="group relative bg-slate-900/40 border border-white/10 rounded-xl overflow-hidden hover:border-white/20 transition-colors"
                            >
                                <div className="aspect-square relative bg-slate-950">
                                    <Image
                                        src={photo.url}
                                        alt={photo.caption}
                                        fill
                                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                                        unoptimized // Using Signed URLs directly from S3
                                    />
                                    {/* Overlay Actions */}
                                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                        <a
                                            href={photo.url}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="p-2 bg-white/10 hover:bg-white/20 rounded-full text-white backdrop-blur-md transition-colors"
                                            title="View Full Size"
                                        >
                                            <ExternalLink className="w-5 h-5" />
                                        </a>
                                        <button
                                            onClick={(e) => handleDelete(photo.id, e)}
                                            disabled={deletingId === photo.id}
                                            className="p-2 bg-red-500/20 hover:bg-red-500/40 rounded-full text-red-400 backdrop-blur-md transition-colors border border-red-500/30"
                                            title="Archive Photo"
                                        >
                                            {deletingId === photo.id ? (
                                                <RefreshCw className="w-5 h-5 animate-spin" />
                                            ) : (
                                                <Trash2 className="w-5 h-5" />
                                            )}
                                        </button>
                                    </div>
                                </div>
                                <div className="p-4">
                                    <h3 className="font-bold text-white truncate text-sm mb-1" title={photo.caption}>
                                        {photo.caption}
                                    </h3>
                                    <div className="flex items-center justify-between text-[10px] text-slate-400">
                                        <div className="flex items-center gap-1">
                                            <User className="w-3 h-3" />
                                            <span className="truncate max-w-[80px]">{photo.user}</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Calendar className="w-3 h-3" />
                                            <span>{new Date(photo.uploadedAt).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </main>
    );
}
