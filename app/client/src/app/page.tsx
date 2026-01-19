import Link from "next/link";
import { Button } from "@/components/ui";

/**
 * Page d'accueil du Starter Kit.
 * Page de présentation statique ultra-premium.
 */
export default function HomePage() {
    return (
        <main className="relative min-h-screen flex flex-col items-center justify-center p-8 overflow-hidden bg-white selection:bg-blue-100 selection:text-blue-900">
            {/* Background Decorative Elements */}
            <div className="absolute top-0 left-0 w-full h-full -z-10 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-100/30 blur-[120px] rounded-full" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-100/30 blur-[120px] rounded-full" />
            </div>

            <div className="text-center max-w-3xl mx-auto space-y-16 animate-fade-in">
                {/* Logo / Badge */}
                <div className="flex justify-center">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900 text-white text-[10px] font-bold tracking-[0.2em] uppercase">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                        </span>
                        Starter Kit Ready
                    </div>
                </div>

                <div className="space-y-8">
                    <div className="flex justify-center">
                        <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-2xl shadow-blue-500/30 -rotate-6 transition-transform hover:rotate-0 duration-500 cursor-default">
                            <span className="text-4xl text-white font-black tracking-tighter italic">SK</span>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <h1 className="text-6xl md:text-8xl font-black text-slate-900 tracking-tight leading-[0.9]">
                            Build <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-500 to-blue-600 animate-shimmer">
                                Perfect.
                            </span>
                        </h1>

                        <p className="text-xl md:text-2xl text-slate-500 max-w-xl mx-auto leading-relaxed font-medium">
                            Une fondation robuste pour vos projets SaaS plus ambitieux.
                            Clean Architecture native et performance exceptionnelle.
                        </p>
                    </div>
                </div>

                {/* Neutral CTA for Presentation only */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-4">
                    <Link href="https://github.com/OElKoujouk/starter-kit" target="_blank" className="w-full sm:w-auto">
                        <Button size="lg" className="w-full h-14 px-10 text-base shadow-xl shadow-blue-500/25">
                            Voir sur GitHub
                        </Button>
                    </Link>
                    <div className="text-sm font-semibold text-slate-400 uppercase tracking-widest px-8">
                        V1.0.0 Alpha
                    </div>
                </div>

                {/* Features Grid */}
                <div className="pt-20 grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 max-w-4xl mx-auto border-t border-slate-100">
                    <div className="space-y-3 group cursor-default">
                        <div className="w-12 h-12 mx-auto rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 shadow-sm transition-all duration-300 group-hover:scale-110 group-hover:shadow-md">
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                {/* Next.js Lightning/Speed Icon */}
                            </svg>
                        </div>
                        <div className="space-y-1">
                            <div className="text-slate-900 font-bold">Next.js 16</div>
                            <div className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold">App Router</div>
                        </div>
                    </div>
                    <div className="space-y-3 group cursor-default">
                        <div className="w-12 h-12 mx-auto rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 shadow-sm transition-all duration-300 group-hover:scale-110 group-hover:shadow-md">
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M5 12l4-4m-4 4l4 4" />
                                {/* Express API Flow Icon */}
                            </svg>
                        </div>
                        <div className="space-y-1">
                            <div className="text-slate-900 font-bold">Express</div>
                            <div className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold">Node.js API</div>
                        </div>
                    </div>
                    <div className="space-y-3 group cursor-default">
                        <div className="w-12 h-12 mx-auto rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600 shadow-sm transition-all duration-300 group-hover:scale-110 group-hover:shadow-md">
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
                                {/* Prisma Database Icon */}
                            </svg>
                        </div>
                        <div className="space-y-1">
                            <div className="text-slate-900 font-bold">Prisma</div>
                            <div className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold">Type-safe DB</div>
                        </div>
                    </div>
                    <div className="space-y-3 group cursor-default">
                        <div className="w-12 h-12 mx-auto rounded-2xl bg-cyan-50 flex items-center justify-center text-cyan-600 shadow-sm transition-all duration-300 group-hover:scale-110 group-hover:shadow-md">
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                                {/* Tailwind Design Icon */}
                            </svg>
                        </div>
                        <div className="space-y-1">
                            <div className="text-slate-900 font-bold">Tailwind 4</div>
                            <div className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold">Modern UI</div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
