import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { FileSpreadsheet, Upload, X, CheckCircle2, Loader2, Image as ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useIdentity } from "@/context/IdentityContext";

export default function FileUpload05() {
    const [file, setFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [caption, setCaption] = useState("");
    const { leadId, userName, instagram } = useIdentity();

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

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
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

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
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

        try {
            // 1. Get Presigned URL
            const res = await fetch(`/api/upload?filename=${encodeURIComponent(file.name)}&contentType=${encodeURIComponent(file.type)}`);
            const data = await res.json();

            if (!res.ok) throw new Error(data.error || "Failed to get upload URL");

            setProgress(30); // Url received

            // 2. Upload to S3
            const uploadRes = await fetch(data.url, {
                method: "PUT",
                body: file,
                headers: {
                    "Content-Type": file.type,
                },
            });

            if (!uploadRes.ok) throw new Error("Failed to upload to storage");

            setProgress(80);

            // 3. Confirm & Save to Notion
            try {
                const confirmRes = await fetch('/api/upload/confirm', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        caption: caption,
                        userId: userName ? `${userName} (${leadId || 'No ID'})` : undefined,
                        instagramHandle: instagram
                    })
                });

                if (!confirmRes.ok) {
                    console.error("Failed to save metadata to Notion");
                }
            } catch (e) {
                console.error("Confirmation error:", e);
            }

            setProgress(100);
            setSuccess(true);
            setFile(null);
            setCaption("");

        } catch (err: any) {
            console.error(err);
            setError(err.message || "Something went wrong during upload");
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="sm:mx-auto sm:max-w-lg flex flex-col items-center justify-center p-10 w-full max-w-lg">

            {success ? (
                <div className="text-center space-y-4 animate-in fade-in zoom-in duration-300">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CheckCircle2 className="w-10 h-10 text-green-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-slate-800">Upload Complete!</h3>
                    <p className="text-slate-500">Your memory has been shared with the galaxy.</p>
                    <Button
                        onClick={() => { setSuccess(false); setFile(null); setProgress(0); }}
                        className="mt-6 bg-indigo-600 hover:bg-indigo-500 text-white font-bold"
                    >
                        Upload Another
                    </Button>
                </div>
            ) : (
                <div className="w-full">
                    <h3 className="text-lg font-semibold text-foreground text-center mb-4">File Upload</h3>

                    {!file ? (
                        <div
                            className={cn(
                                "mt-4 flex justify-center space-x-4 rounded-xl border-2 border-dashed px-6 py-10 transition-colors",
                                error ? "border-red-300 bg-red-50" : "border-slate-300 hover:border-indigo-400 hover:bg-slate-50"
                            )}
                            onDrop={handleDrop}
                            onDragOver={handleDragOver}
                        >
                            <div className="text-center">
                                <div className="mx-auto h-12 w-12 text-slate-300 rounded-full bg-slate-50 flex items-center justify-center mb-4">
                                    <Upload className="h-6 w-6 text-indigo-500" aria-hidden={true} />
                                </div>
                                <div className="mt-4 flex text-sm leading-6 text-foreground justify-center">
                                    <Label
                                        htmlFor="file-upload"
                                        className="relative cursor-pointer rounded-sm font-semibold text-indigo-600 hover:text-indigo-500"
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
                                    </Label>
                                    <p className="pl-1 text-slate-500">or drag and drop</p>
                                </div>
                                <p className="text-xs leading-5 text-slate-400 mt-2">
                                    Images or Videos up to 10MB
                                </p>
                                {error && (
                                    <p className="text-sm font-medium text-red-600 mt-4 bg-red-100 px-3 py-1 rounded-full inline-block">
                                        {error}
                                    </p>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="relative mt-4 rounded-xl bg-slate-50 border border-slate-200 p-4">
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 rounded-lg bg-indigo-100 flex items-center justify-center shrink-0 text-indigo-600">
                                    {file.type.startsWith('video') ? <FileSpreadsheet className="w-6 h-6" /> : <ImageIcon className="w-6 h-6" />}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-slate-900 truncate pr-8">
                                        {file.name}
                                    </p>
                                    <p className="text-xs text-slate-500 mt-1 mb-3">
                                        {(file.size / (1024 * 1024)).toFixed(2)} MB
                                    </p>

                                    <input
                                        type="text"
                                        placeholder="Add a caption..."
                                        value={caption}
                                        onChange={(e) => setCaption(e.target.value)}
                                        className="w-full text-sm border-b border-slate-300 bg-transparent py-1 mb-2 focus:outline-none focus:border-indigo-500 placeholder:text-slate-400"
                                        disabled={uploading}
                                    />

                                    {/* Progress Bar */}
                                    {uploading && (
                                        <div className="mt-3 h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-indigo-500 rounded-full transition-all duration-300"
                                                style={{ width: `${progress}%` }}
                                            />
                                        </div>
                                    )}
                                </div>

                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    className="absolute top-2 right-2 text-slate-400 hover:text-red-500 h-8 w-8 p-0"
                                    onClick={handleRemoveFile}
                                    disabled={uploading}
                                >
                                    <X className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>
                    )}

                    <div className="mt-8 flex items-center justify-end space-x-3">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => { setFile(null); setError(null); }}
                            className="bg-white"
                            disabled={uploading}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="button"
                            onClick={handleUpload}
                            disabled={!file || uploading}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white min-w-[100px]"
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
