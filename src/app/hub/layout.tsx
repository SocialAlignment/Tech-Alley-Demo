import Sidebar from "@/components/Sidebar";

export default function HubLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex h-screen w-full relative overflow-hidden bg-background">
            {/* Sidebar (Desktop Relative, Mobile Fixed) */}
            <Sidebar />

            {/* Main Content Area - Scrollable */}
            <main className="flex-1 h-screen overflow-y-auto scroll-smooth relative z-0 w-full bg-background p-6 md:p-10">
                <div className="max-w-7xl mx-auto pb-32 md:pb-12 pt-16 md:pt-4">
                    {children}
                </div>
            </main>
        </div>
    );
}
