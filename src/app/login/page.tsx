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
        <div className="flex flex-col items-center mb-8 w-full">
          <img
            src="/tech-alley-logo.png"
            alt="Tech Alley Henderson"
            className="w-48 h-48 object-contain drop-shadow-2xl hover:scale-105 transition-transform duration-500"
          />
        </div>
      }
      onGoogleSignIn={() => signIn("google", { callbackUrl: "/auth/verify" })}
    />
  );
}
