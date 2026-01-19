"use client";

import { Button } from "@/components/ui/button";

export function GenAICTA() {
    return (
        <section id="cta" className="w-full py-20 relative bg-gradient-to-b from-slate-900 to-slate-950 border-y border-white/5">
            <div className="absolute inset-0 bg-blue-600/5 blur-[100px] pointer-events-none" />

            <div className="container mx-auto px-6 text-center relative z-10">
                <div className="max-w-3xl mx-auto space-y-8">
                    <h2 className="text-3xl md:text-4xl font-bold text-white">
                        Ready to Align Your Socials?
                    </h2>
                    <p className="text-xl text-slate-300">
                        Enter the raffle or grab a time on the calendar to map out your next GenAI video sprint.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                        <Button
                            size="lg"
                            className="bg-blue-600 hover:bg-blue-500 text-white rounded-full px-8 h-14 text-lg w-full sm:w-auto shadow-lg shadow-blue-900/20"
                            onClick={() => window.location.href = '/hub/raffle'}
                        >
                            🎁 Enter GenAI Raffle
                        </Button>
                        <Button
                            variant="outline"
                            size="lg"
                            className="border-slate-700 bg-slate-800/50 backdrop-blur-sm text-white hover:bg-slate-700 hover:text-white rounded-full px-8 h-14 text-lg w-full sm:w-auto"
                            onClick={() => window.open('https://cal.com/jonathans-alignment/30min', '_blank')}
                        >
                            📅 Book Discovery Call
                        </Button>
                    </div>
                </div>
            </div>
        </section>
    );
}
