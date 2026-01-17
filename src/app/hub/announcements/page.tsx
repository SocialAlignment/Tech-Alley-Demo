import { Megaphone } from "lucide-react";

export default function AnnouncementsPage() {
    return (
        <div className="h-full w-full p-8 overflow-y-auto">
            <div className="max-w-4xl mx-auto space-y-8">

                {/* Header */}
                <div className="space-y-4">
                    <div className="inline-flex items-center justify-center p-3 bg-blue-100 rounded-xl">
                        <Megaphone className="w-8 h-8 text-blue-600" />
                    </div>
                    <h1 className="text-4xl font-bold text-slate-900 tracking-tight">
                        Announcements
                    </h1>
                    <p className="text-lg text-slate-500 max-w-2xl">
                        Stay tuned for real-time updates, special offers, and important news during the event.
                    </p>
                </div>

                {/* Placeholder Content */}
                <div className="grid gap-6">
                    <div className="p-6 bg-white rounded-2xl border border-slate-100 shadow-sm">
                        <div className="flex items-start gap-4">
                            <div className="p-2 bg-green-100 rounded-lg shrink-0">
                                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-slate-900 mb-1">Welcome to Tech Alley Henderson!</h3>
                                <p className="text-slate-500">We're excited to see you here. Check back often for live updates.</p>
                                <span className="text-xs font-medium text-slate-400 mt-3 block">Just now</span>
                            </div>
                        </div>
                    </div>
                    {/* More items can be added here dynamically later */}
                </div>

            </div>
        </div>
    );
}
