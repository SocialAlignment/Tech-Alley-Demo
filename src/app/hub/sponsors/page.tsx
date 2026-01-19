import { Construction } from 'lucide-react';

export default function SponsorsPage() {
    return (
        <div className="flex flex-col items-center justify-center h-full text-center p-6 space-y-4">
            <div className="w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center text-blue-400 mb-4">
                <Construction size={32} />
            </div>
            <h1 className="text-2xl font-bold text-white">Sponsors</h1>
            <p className="text-slate-400 max-w-md">
                We are currently coordinating with our amazing partners. Check back soon for more details!
            </p>
        </div>
    );
}
