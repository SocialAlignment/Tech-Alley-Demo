"use client";

import { AuthComponent } from '@/components/ui/sign-up';
import { signIn } from 'next-auth/react';
import { RocketIcon } from 'lucide-react';

const TechAlleyLogo = () => (
  <div className="bg-blue-600 text-white rounded-xl p-2 shadow-lg shadow-blue-500/20">
    <RocketIcon className="h-6 w-6" />
  </div>
);

export default function LoginPage() {
  return (
    <AuthComponent
      brandName=""
      logo={null}
      heading={
        <div className="flex flex-col items-center mb-4">
          <img
            src="/tech-alley-logo.png"
            alt="Tech Alley Henderson"
            className="w-64 h-auto object-contain"
          />
        </div>
      }
      onGoogleSignIn={() => signIn("google", { callbackUrl: "http://localhost:3007/auth/verify" })}
    />
  );
}
