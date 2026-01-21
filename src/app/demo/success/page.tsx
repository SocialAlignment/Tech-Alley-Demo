import { Suspense } from "react";
import { SuccessContent } from "@/components/demo/SuccessContent";

export const dynamic = "force-dynamic";

export default function DemoSuccessPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-[#02040a]" />}>
            <SuccessContent />
        </Suspense>
    );
}
