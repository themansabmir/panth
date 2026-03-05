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
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-blue-800 text-white px-6 py-4 flex items-center justify-between shadow">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-white text-blue-800 font-bold text-base flex items-center justify-center">
                        HR
                    </div>
                    <div>
                        <h1 className="text-xl font-bold">Headache Registry</h1>
                        <p className="text-xs text-blue-200">Patient List</p>
                    </div>
                </div>
                <Link
                    href="/enroll"
                    className="bg-white text-blue-800 text-sm font-semibold px-4 py-2 rounded-lg hover:bg-blue-50 transition"
                >
                    + New Enrolment
                </Link>
            </header>

            <div className="max-w-7xl mx-auto px-4 py-6">
                {/* Toolbar */}
                <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between mb-5">
                    <div>
                        <h2 className="text-lg font-semibold text-gray-800">All Patients</h2>
                        <p className="text-sm text-gray-500">
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
                        className="w-full sm:w-80 border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                </div>

                {/* Error */}
                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 mb-4 text-sm">
                        {error}
                    </div>
                )}

                {/* Table */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="bg-blue-700 text-white text-left">
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
                                        <td colSpan={9} className="text-center py-16 text-gray-400">
                                            <div className="flex flex-col items-center gap-2">
                                                <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
                                                <span>Loading patients…</span>
                                            </div>
                                        </td>
                                    </tr>
                                ) : filtered.length === 0 ? (
                                    <tr>
                                        <td colSpan={9} className="text-center py-16 text-gray-400">
                                            {search ? "No patients match your search." : "No patients found."}
                                        </td>
                                    </tr>
                                ) : (
                                    filtered.map((p, idx) => {
                                        const rowNum = (currentPage - 1) * 100 + idx + 1;
                                        return (
                                            <tr
                                                key={p._id}
                                                className="border-t border-gray-100 hover:bg-blue-50 transition-colors"
                                            >
                                                <td className="px-4 py-3 text-gray-400 text-xs">{rowNum}</td>
                                                <td className="px-4 py-3 font-mono text-blue-700 font-semibold">
                                                    {p.HCN_Number || "—"}
                                                </td>
                                                <td className="px-4 py-3 font-medium text-gray-800">
                                                    {p.patient_name || "—"}
                                                </td>
                                                <td className="px-4 py-3 text-gray-600">{p.age || "—"}</td>
                                                <td className="px-4 py-3">
                                                    {p.gender ? (
                                                        <span
                                                            className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold ${p.gender === "Male"
                                                                    ? "bg-blue-100 text-blue-700"
                                                                    : p.gender === "Female"
                                                                        ? "bg-pink-100 text-pink-700"
                                                                        : "bg-gray-100 text-gray-600"
                                                                }`}
                                                        >
                                                            {p.gender}
                                                        </span>
                                                    ) : (
                                                        "—"
                                                    )}
                                                </td>
                                                <td className="px-4 py-3 text-gray-600 max-w-[180px] truncate" title={p.provisional_diagnosis}>
                                                    {p.provisional_diagnosis || "—"}
                                                </td>
                                                <td className="px-4 py-3 text-gray-500 whitespace-nowrap">
                                                    {formatDate(p.date_of_first_assessment)}
                                                </td>
                                                <td className="px-4 py-3 text-gray-500">{p.phone_number || "—"}</td>
                                                <td className="px-4 py-3 text-center">
                                                    <Link
                                                        href={`/enroll?id=${p._id}`}
                                                        className="inline-block bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition"
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
                        <div className="border-t border-gray-100 px-4 py-3 flex items-center justify-between bg-gray-50">
                            <p className="text-xs text-gray-500">
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
                                        <span key={`ellipsis-${i}`} className="px-2 text-gray-400 text-sm">…</span>
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
                    ? "bg-blue-700 text-white"
                    : disabled
                        ? "text-gray-300 cursor-not-allowed"
                        : "text-gray-600 hover:bg-blue-100 hover:text-blue-700"
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
            <div className="min-h-screen flex items-center justify-center bg-gray-50 text-gray-500">
                Loading…
            </div>
        }>
            <PatientsTableContent />
        </Suspense>
    );
}
