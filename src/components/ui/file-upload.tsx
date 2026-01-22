"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { FileSpreadsheet, Upload, X, CheckCircle2, Loader2, Image as ImageIcon } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useIdentity } from "@/context/IdentityContext";
import RetroGrid from "@/components/ui/retro-grid";
import { BorderBeam } from "@/components/ui/border-beam";
import ShimmerButton from "@/components/ui/shimmer-button";

export default function FileUpload05() {
    const [file, setFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [caption, setCaption] = useState("");
    const { leadId, userName, instagram: contextInstagram } = useIdentity();
    const [instagram, setInstagram] = useState("");
    const [yourName, setYourName] = useState("");

    useEffect(() => {
        if (contextInstagram) setInstagram(contextInstagram);
    }, [contextInstagram]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const selectedFile = e.target.files[0];
            // Simple validation
            if (selectedFile.size > 10 * 1024 * 1024) {
                setError("File is too large (max 10MB)");
                return;
            }
            if (!selectedFile.type.startsWith("image/") && !selectedFile.type.startsWith("video/")) {
                setError("Only images and videos are allowed");
                return;
            }

            setFile(selectedFile);
            setError(null);
            setSuccess(false);
            setProgress(0);
        }
    };

    const handleDrop = (e: React.DragEvent<HTMLElement>) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            const selectedFile = e.dataTransfer.files[0];
            if (selectedFile.size > 10 * 1024 * 1024) {
                setError("File is too large (max 10MB)");
                return;
            }
            if (!selectedFile.type.startsWith("image/") && !selectedFile.type.startsWith("video/")) {
                setError("Only images and videos are allowed");
                return;
            }
            setFile(selectedFile);
            setError(null);
            setSuccess(false);
            setProgress(0);
        }
    };

    const handleDragOver = (e: React.DragEvent<HTMLElement>) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleRemoveFile = () => {
        setFile(null);
        setSuccess(false);
        setError(null);
        setProgress(0);
    };

    const handleUpload = async () => {
        if (!file) return;

        setUploading(true);
        setError(null);
        setProgress(10); // Start progress

        console.log("Starting upload process...", { filename: file.name, type: file.type });

        try {
            // 1. Get Presigned URL
            console.log("Fetching presigned URL...");
            const res = await fetch(`/api/upload?filename=${encodeURIComponent(file.name)}&contentType=${encodeURIComponent(file.type)}`);
            const data = await res.json();

            if (!res.ok) {
                console.error("Presigned URL error:", data);
                throw new Error(data.error || "Failed to get upload URL");
            }

            console.log("Presigned URL received:", data.url);
            setProgress(30); // Url received

            // 2. Upload to S3
            console.log("Uploading to S3...");
            const uploadRes = await fetch(data.url, {
                method: "PUT",
                body: file,
                headers: {
                    "Content-Type": file.type,
                },
            });

            if (!uploadRes.ok) {
                console.error("S3 Upload Failed:", uploadRes.status, uploadRes.statusText);
                throw new Error(`Failed to upload to storage (S3: ${uploadRes.status})`);
            }

            console.log("S3 Upload Successful");
            setProgress(80);

            // 3. Confirm & Save to Notion
            console.log("Confirming upload with Notion/Supabase...");
            const confirmRes = await fetch('/api/upload/confirm', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    s3Key: data.key,
                    caption: caption,
                    userId: userName ? `${userName} (${leadId || 'No ID'})` : undefined,
                    yourName: yourName,
                    instagramHandle: instagram || contextInstagram
                })
            });

            if (!confirmRes.ok) {
                const errorData = await confirmRes.json();
                console.error("Failed to save metadata:", errorData);
                // We DON'T throw here if we want to show partial success, but the user is complaining about "nothing updating".
                // Let's THROW so they see the error and we can fix the schema.
                throw new Error(errorData.error || "Failed to save to Gallery (Database Error)");
            }

            setProgress(100);
            setSuccess(true);
            setFile(null);
            setCaption("");
            // Keep the file preview URL if possible, or just the S3 key? 
            // We can't use the file object after setting to null. 
            // Let's store a successPreviewUrl state.

        } catch (err: any) {
            console.error("Upload error caught:", err);
            setError(err.message || "Something went wrong during upload");
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="sm:mx-auto sm:max-w-lg flex flex-col items-center justify-center p-10 w-full max-w-lg">

            {success ? (
                <div className="relative w-full overflow-hidden rounded-2xl border border-white/10 bg-slate-950/80 p-8 text-center shadow-2xl backdrop-blur-xl">
                    {/* Background Grid - Made clearer */}
                    <div className="absolute inset-0 z-0 opacity-60">
                        <RetroGrid angle={65} />
                    </div>

                    {/* Glowing Border effect - Adjusted color */}
                    <BorderBeam size={300} duration={10} delay={5} colorFrom="#818cf8" colorTo="#c084fc" />

                    <div className="relative z-10 flex flex-col items-center">
                        <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-indigo-500/20 shadow-[0_0_40px_-5px_theme(colors.indigo.500)] ring-1 ring-indigo-500/50">
                            <CheckCircle2 className="h-10 w-10 text-indigo-400" />
                        </div>

                        <h3 className="mb-2 text-3xl font-bold tracking-tight text-white drop-shadow-lg">
                            Upload Complete
                        </h3>
                        <p className="mb-8 max-w-xs text-sm text-slate-300">
                            Your memory has been captured and shared with the galaxy.
                        </p>

                        <div className="flex w-full flex-col gap-4">
                            <Link href="/photo-booth/gallery" className="w-full">
                                <ShimmerButton className="w-full text-lg font-medium" shimmerColor="#c084fc" background="rgba(79, 70, 229, 0.4)">
                                    <span className="flex items-center gap-2">
                                        View in Gallery
                                    </span>
                                </ShimmerButton>
                            </Link>

                            <Button
                                onClick={() => { setSuccess(false); setFile(null); setProgress(0); }}
                                variant="ghost"
                                className="w-full text-slate-400 hover:bg-white/10 hover:text-white"
                            >
                                Upload Another
                            </Button>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="w-full">
                    {/* Upload State */}
                    {!file ? (
                        <label
                            htmlFor="file-upload"
                            className={cn(
                                "group relative mt-4 flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed px-6 py-12 transition-all duration-300",
                                "bg-slate-950/30 backdrop-blur-md", // Glass effect
                                error
                                    ? "border-red-500/50 bg-red-500/10"
                                    : "border-slate-700 hover:border-indigo-500 hover:bg-slate-900/50"
                            )}
                            onDrop={handleDrop}
                            onDragOver={handleDragOver}
                        >
                            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-800/50 text-slate-300 ring-1 ring-white/10 transition-transform group-hover:scale-110">
                                <Upload className="h-8 w-8" aria-hidden={true} />
                            </div>

                            <div className="text-center">
                                <div
                                    className="relative cursor-pointer text-lg font-semibold text-white transition-colors hover:text-indigo-400"
                                >
                                    <span>Click to upload</span>
                                    <input
                                        id="file-upload"
                                        name="file-upload"
                                        type="file"
                                        accept="image/*,video/*"
                                        className="sr-only"
                                        onChange={handleFileChange}
                                    />
                                </div>
                                <p className="mt-1 text-sm text-slate-400">or drag and drop</p>
                                <p className="mt-2 text-xs text-slate-500">
                                    Images or Videos up to 10MB
                                </p>
                            </div>

                            {error && (
                                <p className="mt-4 inline-block rounded-full bg-red-500/20 px-3 py-1 text-sm font-medium text-red-300">
                                    {error}
                                </p>
                            )}
                        </label>
                    ) : (
                        <div className="relative mt-4 overflow-hidden rounded-xl border border-white/10 bg-slate-900/60 p-4 backdrop-blur-sm">
                            <div className="flex items-start gap-4">
                                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-indigo-500/20 text-indigo-300">
                                    {file.type.startsWith('video') ? <FileSpreadsheet className="h-6 w-6" /> : <ImageIcon className="h-6 w-6" />}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="truncate pr-8 text-sm font-medium text-white">
                                        {file.name}
                                    </p>
                                    <p className="mb-3 mt-1 text-xs text-slate-400">
                                        {(file.size / (1024 * 1024)).toFixed(2)} MB
                                    </p>

                                    <input
                                        type="text"
                                        placeholder="Add a caption..."
                                        value={caption}
                                        onChange={(e) => setCaption(e.target.value)}
                                        className="mb-2 w-full border-b border-slate-700 bg-transparent py-1 text-sm text-white placeholder:text-slate-600 focus:border-indigo-500 focus:outline-none"
                                        disabled={uploading}
                                    />

                                    <input
                                        type="text"
                                        placeholder="Your Name (Optional)"
                                        value={yourName}
                                        onChange={(e) => setYourName(e.target.value)}
                                        className="mb-2 w-full border-b border-slate-700 bg-transparent py-1 text-sm text-white placeholder:text-slate-600 focus:border-indigo-500 focus:outline-none"
                                        disabled={uploading}
                                    />

                                    <input
                                        type="text"
                                        placeholder="@instagram_handle (Optional)"
                                        value={instagram}
                                        onChange={(e) => setInstagram(e.target.value)}
                                        className="mb-2 w-full border-b border-slate-700 bg-transparent py-1 text-sm text-white placeholder:text-slate-600 focus:border-indigo-500 focus:outline-none"
                                        disabled={uploading}
                                    />

                                    {/* Progress Bar */}
                                    {uploading && (
                                        <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-slate-800">
                                            <div
                                                className="h-full rounded-full bg-indigo-500 transition-all duration-300"
                                                style={{ width: `${progress}%` }}
                                            />
                                        </div>
                                    )}
                                </div>

                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    className="absolute right-2 top-2 h-8 w-8 p-0 text-slate-400 hover:bg-white/10 hover:text-red-400"
                                    onClick={handleRemoveFile}
                                    disabled={uploading}
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    )}

                    <div className="mt-8 flex items-center justify-end space-x-3">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => { setFile(null); setError(null); }}
                            className="border-slate-700 bg-transparent text-slate-300 hover:bg-slate-800 hover:text-white"
                            disabled={uploading}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="button"
                            onClick={handleUpload}
                            disabled={!file || uploading}
                            className="min-w-[100px] bg-indigo-600 text-white hover:bg-indigo-500 shadow-[0_0_20px_-5px_theme(colors.indigo.500)]"
                        >
                            {uploading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    {progress < 100 ? `${progress}%` : 'Finalizing...'}
                                </>
                            ) : (
                                "Upload"
                            )}
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}
