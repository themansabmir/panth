"use client";

import Link from 'next/link';
import { useTheme } from "next-themes";
import {
    HeartPulse,
    Users,
    Activity,
    ClipboardList,
    BarChart3,
    Settings,
    Sun,
    Moon,
    Menu,
    FileText
} from "lucide-react";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

export function DashboardLayout({ children }: { children: React.ReactNode }) {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const pathname = usePathname();

    useEffect(() => {
        setMounted(true);
    }, []);

    return (
        <div className="flex h-screen overflow-hidden bg-[var(--background)] text-[var(--foreground)]">
            {/* SIDEBAR */}
            <aside className={`
        ${sidebarOpen ? 'w-64' : 'w-20'}
        transition-all duration-300 ease-in-out
        bg-[var(--card)] border-r border-[var(--border)]
        flex flex-col h-full shrink-0
      `}>
                <div className="h-16 flex items-center justify-between px-4 border-b border-[var(--border)] shrink-0">
                    {sidebarOpen ? (
                        <div className="flex items-center gap-2 font-bold text-lg text-[var(--primary)]">
                            <HeartPulse className="w-6 h-6" />
                            <span>Panth Admin</span>
                        </div>
                    ) : (
                        <HeartPulse className="w-6 h-6 mx-auto text-[var(--primary)]" />
                    )}
                </div>

                <nav className="flex-1 py-4 overflow-y-auto space-y-1 px-2">
                    <Link href="/" className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors group ${pathname === "/" ? "bg-[var(--primary)] text-[var(--primary-foreground)]" : "hover:bg-[var(--muted)] text-[var(--muted-foreground)] hover:text-[var(--foreground)]"}`}>
                        <Activity className="w-5 h-5 shrink-0" />
                        {sidebarOpen && <span>Dashboard</span>}
                    </Link>

                    <div className="pt-4 pb-2">
                        {sidebarOpen && <p className="px-3 text-xs font-semibold text-[var(--muted-foreground)] uppercase tracking-wider">Patients</p>}
                    </div>

                    {/* <Link href="/enroll" className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${pathname === "/enroll" ? "bg-[var(--primary)] text-[var(--primary-foreground)]" : "hover:bg-[var(--muted)] text-[var(--muted-foreground)] hover:text-[var(--foreground)]"}`}>
                        <ClipboardList className="w-5 h-5 shrink-0" />
                        {sidebarOpen && <span>Enroll Patient</span>}
                    </Link> */}

                    <Link href="/patients" className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${pathname === "/patients" ? "bg-[var(--primary)] text-[var(--primary-foreground)]" : "hover:bg-[var(--muted)] text-[var(--muted-foreground)] hover:text-[var(--foreground)]"}`}>
                        <Users className="w-5 h-5 shrink-0" />
                        {sidebarOpen && <span>Patient Directory</span>}
                    </Link>

                    {/* <Link href="/records" className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${pathname === "/records" ? "bg-[var(--primary)] text-[var(--primary-foreground)]" : "hover:bg-[var(--muted)] text-[var(--muted-foreground)] hover:text-[var(--foreground)]"}`}>
                        <FileText className="w-5 h-5 shrink-0" />
                        {sidebarOpen && <span>Patient Records</span>}
                    </Link> */}

                    <div className="pt-4 pb-2">
                        {sidebarOpen && <p className="px-3 text-xs font-semibold text-[var(--muted-foreground)] uppercase tracking-wider">Analytics</p>}
                    </div>

                    <Link href="#" className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-[var(--muted)] text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors">
                        <BarChart3 className="w-5 h-5 shrink-0" />
                        {sidebarOpen && <span>Graphs & Trends</span>}
                    </Link>

                </nav>

                <div className="p-4 border-t border-[var(--border)] space-y-2 shrink-0">
                    <button className="flex w-full items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-[var(--muted)] text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors">
                        <Settings className="w-5 h-5 shrink-0" />
                        {sidebarOpen && <span>Settings</span>}
                    </button>
                </div>
            </aside>

            {/* MAIN CONTENT */}
            <main className="flex-1 flex flex-col h-full overflow-hidden">
                {/* TOPBAR */}
                <header className="h-16 flex items-center justify-between px-6 bg-[var(--card)] border-b border-[var(--border)] z-10 shrink-0">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                            className="p-2 rounded-md hover:bg-[var(--muted)] text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
                        >
                            <Menu className="w-5 h-5" />
                        </button>
                        <h1 className="text-xl font-semibold">
                            {pathname === "/enroll" ? "Patient Enrollment" : pathname === "/patients" ? "Patient Directory" : "Registry Dashboard"}
                        </h1>
                    </div>

                    <div className="flex items-center gap-4">
                        {mounted && (
                            <button
                                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                                className="p-2 rounded-full hover:bg-[var(--muted)] text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors"
                                aria-label="Toggle theme"
                            >
                                {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                            </button>
                        )}

                        <div className="w-9 h-9 rounded-full bg-[var(--action)] border border-[var(--action)] flex items-center justify-center text-[var(--action-foreground)] font-bold shrink-0">
                            AD
                        </div>
                    </div>
                </header>

                {/* SCROLLABLE CONTENT */}
                <div className="flex-1 overflow-y-auto w-full relative">
                    {children}
                </div>
            </main>
        </div>
    );
}
