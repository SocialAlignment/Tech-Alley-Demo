import { Suspense } from "react";
import { CircuitBoardBackground } from "@/components/ui/circuit-board-background";
import { RegisterForm } from "@/components/demo/RegisterForm";

export const dynamic = "force-dynamic";

export default function DemoRegisterPage() {
    return (
        <main className="relative min-h-screen w-full bg-[#0a0a0a] text-white flex items-center justify-center p-4">
            <CircuitBoardBackground />
            <Suspense fallback={<div className="min-h-screen bg-black" />}>
                <RegisterForm />
            </Suspense>
        </main>
    );
}
