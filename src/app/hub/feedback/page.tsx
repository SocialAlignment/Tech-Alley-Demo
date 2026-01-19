import { MessageSquare } from 'lucide-react';

export default function FeedbackPage() {
    return (
        <div className="flex flex-col items-center justify-center h-full text-center p-6 space-y-4">
            <div className="w-16 h-16 bg-purple-500/10 rounded-full flex items-center justify-center text-purple-400 mb-4">
                <MessageSquare size={32} />
            </div>
            <h1 className="text-2xl font-bold text-white">Feedback</h1>
            <p className="text-slate-400 max-w-md">
                We value your input! A feedback form will be available here shortly.
            </p>
        </div>
    );
}
