'use client';

import { AuthComponent } from '@/components/ui/sign-up';
import { signIn } from 'next-auth/react';

export default function DemoLoginPage() {
    return (
        <AuthComponent
            brandName="Tech Alley Demo Raffle"
            logo={<h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">Win Big</h1>}
            heading={
                <div className="flex flex-col items-center mb-8 w-full text-center">
                    <h2 className="text-2xl font-bold text-white mb-2">Enter the Raffle</h2>
                    <p className="text-slate-400">Sign in with Google to secure your entry.</p>
                </div>
            }
            onGoogleSignIn={() => signIn("google", { callbackUrl: "/demo/processing" })}
        />
    );
}
