"use client";

import React, { useState, useEffect, useCallback, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Patient {
    _id: string;
    HCN_Number: string;
    patient_name: string;
    age: string | number;
    gender: string;
    provisional_diagnosis: string;
    date_of_first_assessment: string;
    phone_number: string;
}

interface Pagination {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
}

// ─── Inner component (uses useSearchParams) ───────────────────────────────────

function PatientsTableContent() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const pageFromUrl = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10));

    const [patients, setPatients] = useState<Patient[]>([]);
    const [pagination, setPagination] = useState<Pagination>({
        page: 1, limit: 100, total: 0, totalPages: 1,
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [search, setSearch] = useState("");
    const [currentPage, setCurrentPage] = useState(pageFromUrl);

    const fetchPatients = useCallback(async (page: number) => {
        setIsLoading(true);
        setError("");
        try {
            const res = await fetch(`/api/enroll?page=${page}&limit=100`);
            const result = await res.json();
            if (result.success) {
                setPatients(result.data);
                setPagination(result.pagination);
            } else {
                setError(result.error ?? "Failed to load patients.");
            }
        } catch {
            setError("Network error. Please try again.");
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchPatients(currentPage);
    }, [currentPage, fetchPatients]);

    const goToPage = (page: number) => {
        setCurrentPage(page);
        router.push(`/patients?page=${page}`, { scroll: false });
    };

    // Client-side search filter (already-loaded page)
    const filtered = patients.filter((p) => {
        const q = search.toLowerCase();
        if (!q) return true;
        return (
            p.HCN_Number?.toLowerCase().includes(q) ||
            p.patient_name?.toLowerCase().includes(q) ||
            String(p.age).includes(q) ||
            p.gender?.toLowerCase().includes(q) ||
            p.provisional_diagnosis?.toLowerCase().includes(q) ||
            p.phone_number?.includes(q)
        );
    });

    const formatDate = (iso: string) => {
        if (!iso) return "—";
        try { return new Date(iso).toLocaleDateString("en-IN"); } catch { return iso; }
    };

    return (
        <div className="p-6 lg:p-8">
            <div className="max-w-7xl mx-auto">
                {/* Header / Actions */}
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-[var(--foreground)] tracking-tight">Patient Directory</h2>
                    <Link
                        href="/enroll"
                        className="bg-[var(--primary)] text-[var(--primary-foreground)] text-sm font-semibold px-5 py-2.5 rounded-lg hover:opacity-90 transition shadow-sm flex items-center gap-2"
                    >
                        + New Enrollment
                    </Link>
                </div>

                {/* Toolbar */}
                <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between mb-5">
                    <div>
                        <p className="text-sm text-[var(--muted-foreground)]">
                            {isLoading
                                ? "Loading…"
                                : `${pagination.total} total · page ${pagination.page} of ${pagination.totalPages}`}
                        </p>
                    </div>

                    {/* Search bar */}
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search name, HCN, diagnosis…"
                        className="w-full sm:w-80 border border-[var(--border)] bg-[var(--card)] text-[var(--card-foreground)] rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                    />
                </div>

                {/* Error */}
                {error && (
                    <div className="bg-red-900/10 border border-red-500/50 text-red-600 rounded-lg px-4 py-3 mb-4 text-sm">
                        {error}
                    </div>
                )}

                {/* Table */}
                <div className="bg-[var(--card)] text-[var(--card-foreground)] rounded-xl shadow-sm border border-[var(--border)] overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="bg-[var(--primary)] text-[var(--primary-foreground)] text-left">
                                    <th className="px-4 py-3 font-semibold whitespace-nowrap">#</th>
                                    <th className="px-4 py-3 font-semibold whitespace-nowrap">HCN No.</th>
                                    <th className="px-4 py-3 font-semibold whitespace-nowrap">Patient Name</th>
                                    <th className="px-4 py-3 font-semibold whitespace-nowrap">Age</th>
                                    <th className="px-4 py-3 font-semibold whitespace-nowrap">Gender</th>
                                    <th className="px-4 py-3 font-semibold whitespace-nowrap">Diagnosis</th>
                                    <th className="px-4 py-3 font-semibold whitespace-nowrap">First Visit</th>
                                    <th className="px-4 py-3 font-semibold whitespace-nowrap">Phone</th>
                                    <th className="px-4 py-3 font-semibold whitespace-nowrap text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {isLoading ? (
                                    <tr>
                                        <td colSpan={9} className="text-center py-16 text-[var(--muted-foreground)]">
                                            <div className="flex flex-col items-center gap-2">
                                                <div className="w-8 h-8 border-4 border-[var(--primary)] border-t-transparent rounded-full animate-spin" />
                                                <span>Loading patients…</span>
                                            </div>
                                        </td>
                                    </tr>
                                ) : filtered.length === 0 ? (
                                    <tr>
                                        <td colSpan={9} className="text-center py-16 text-[var(--muted-foreground)]">
                                            {search ? "No patients match your search." : "No patients found."}
                                        </td>
                                    </tr>
                                ) : (
                                    filtered.map((p, idx) => {
                                        const rowNum = (currentPage - 1) * 100 + idx + 1;
                                        return (
                                            <tr
                                                key={p._id}
                                                className="border-t border-[var(--border)] hover:bg-[var(--muted)] transition-colors"
                                            >
                                                <td className="px-4 py-3 text-[var(--muted-foreground)] text-xs">{rowNum}</td>
                                                <td className="px-4 py-3 font-mono text-[var(--action)] font-semibold">
                                                    {p.HCN_Number || "—"}
                                                </td>
                                                <td className="px-4 py-3 font-medium text-[var(--foreground)]">
                                                    {p.patient_name || "—"}
                                                </td>
                                                <td className="px-4 py-3 text-[var(--muted-foreground)]">{p.age || "—"}</td>
                                                <td className="px-4 py-3">
                                                    {p.gender ? (
                                                        <span
                                                            className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold ${p.gender === "Male"
                                                                ? "bg-[var(--data)]/10 text-[var(--data)]"
                                                                : p.gender === "Female"
                                                                    ? "bg-[var(--action)]/10 text-[var(--action)]"
                                                                    : "bg-[var(--muted)] text-[var(--muted-foreground)]"
                                                                }`}
                                                        >
                                                            {p.gender}
                                                        </span>
                                                    ) : (
                                                        "—"
                                                    )}
                                                </td>
                                                <td className="px-4 py-3 text-[var(--muted-foreground)] max-w-[180px] truncate" title={p.provisional_diagnosis}>
                                                    {p.provisional_diagnosis || "—"}
                                                </td>
                                                <td className="px-4 py-3 text-[var(--muted-foreground)] whitespace-nowrap">
                                                    {formatDate(p.date_of_first_assessment)}
                                                </td>
                                                <td className="px-4 py-3 text-[var(--muted-foreground)]">{p.phone_number || "—"}</td>
                                                <td className="px-4 py-3 text-center">
                                                    <Link
                                                        href={`/enroll?id=${p._id}`}
                                                        className="inline-block bg-[var(--action)] hover:opacity-90 text-[var(--action-foreground)] text-xs font-semibold px-3 py-1.5 rounded-lg transition"
                                                    >
                                                        View / Edit
                                                    </Link>
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination footer */}
                    {!isLoading && pagination.totalPages > 1 && (
                        <div className="border-t border-[var(--border)] px-4 py-3 flex items-center justify-between bg-[var(--muted)]">
                            <p className="text-xs text-[var(--muted-foreground)]">
                                Showing rows {(currentPage - 1) * 100 + 1}–
                                {Math.min(currentPage * 100, pagination.total)} of {pagination.total}
                            </p>
                            <div className="flex items-center gap-1">
                                <PaginationButton
                                    label="«"
                                    disabled={currentPage === 1}
                                    onClick={() => goToPage(1)}
                                />
                                <PaginationButton
                                    label="‹"
                                    disabled={currentPage === 1}
                                    onClick={() => goToPage(currentPage - 1)}
                                />

                                {/* Page number pills */}
                                {buildPageRange(currentPage, pagination.totalPages).map((p, i) =>
                                    p === "…" ? (
                                        <span key={`ellipsis-${i}`} className="px-2 text-[var(--muted-foreground)] text-sm">…</span>
                                    ) : (
                                        <PaginationButton
                                            key={p}
                                            label={String(p)}
                                            active={p === currentPage}
                                            onClick={() => goToPage(p as number)}
                                        />
                                    )
                                )}

                                <PaginationButton
                                    label="›"
                                    disabled={currentPage === pagination.totalPages}
                                    onClick={() => goToPage(currentPage + 1)}
                                />
                                <PaginationButton
                                    label="»"
                                    disabled={currentPage === pagination.totalPages}
                                    onClick={() => goToPage(pagination.totalPages)}
                                />
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

// ─── Pagination helpers ────────────────────────────────────────────────────────

function PaginationButton({
    label, onClick, disabled = false, active = false,
}: {
    label: string; onClick?: () => void; disabled?: boolean; active?: boolean;
}) {
    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={`min-w-[32px] h-8 px-2 rounded text-sm font-medium transition
        ${active
                    ? "bg-[var(--primary)] text-[var(--primary-foreground)]"
                    : disabled
                        ? "text-[var(--muted-foreground)] cursor-not-allowed opacity-50"
                        : "text-[var(--foreground)] hover:bg-[var(--muted)] hover:text-[var(--primary)]"
                }`}
        >
            {label}
        </button>
    );
}

function buildPageRange(current: number, total: number): (number | "…")[] {
    if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
    const pages: (number | "…")[] = [];
    pages.push(1);
    if (current > 3) pages.push("…");
    for (let p = Math.max(2, current - 1); p <= Math.min(total - 1, current + 1); p++) {
        pages.push(p);
    }
    if (current < total - 2) pages.push("…");
    pages.push(total);
    return pages;
}

// ─── Default export with Suspense (required for useSearchParams) ──────────────

export default function PatientsPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center text-[var(--muted-foreground)]">
                Loading…
            </div>
        }>
            <PatientsTableContent />
        </Suspense>
    );
}
