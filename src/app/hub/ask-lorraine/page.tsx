import { MessageCircleQuestion } from 'lucide-react';

export default function AskLorrainePage() {
    return (
        <div className="flex flex-col items-center justify-center h-full text-center p-6 space-y-4">
            <div className="w-16 h-16 bg-pink-500/10 rounded-full flex items-center justify-center text-pink-400 mb-4">
                <MessageCircleQuestion size={32} />
            </div>
            <h1 className="text-2xl font-bold text-white">Ask Lorraine</h1>
            <p className="text-slate-400 max-w-md">
                Have a question for the organizer? Submit it here directly! Feature coming soon.
            </p>
        </div>
    );
}
