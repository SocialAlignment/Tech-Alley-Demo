'use client';

import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function GenAIQualifyPlaceholder() {
    return (
        <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 text-center">
            <div className="max-w-md space-y-6">
                <h1 className="text-3xl font-bold text-white">GenAI Qualifier</h1>
                <p className="text-slate-400">
                    This is the placeholder for the "Gain 5 extra entries" flow.
                    You would ask the specific qualification questions here.
                </p>
                <Button variant="outline" asChild>
                    <Link href="/demo/success">
                        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Success
                    </Link>
                </Button>
            </div>
        </div>
    );
}
