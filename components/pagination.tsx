import React from "react";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    pageSize: number;
    onPageChange: (page: number) => void;
}

export function Pagination({
    currentPage,
    totalPages,
    totalItems,
    pageSize,
    onPageChange,
}: PaginationProps) {
    if (totalPages <= 1 && totalItems === 0) return null;

    const buildPageRange = () => {
        if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);
        const pages: (number | "…")[] = [];
        pages.push(1);
        if (currentPage > 3) pages.push("…");
        for (let p = Math.max(2, currentPage - 1); p <= Math.min(totalPages - 1, currentPage + 1); p++) {
            pages.push(p);
        }
        if (currentPage < totalPages - 2) pages.push("…");
        pages.push(totalPages);
        return pages;
    };

    const startRow = (currentPage - 1) * pageSize + 1;
    const endRow = Math.min(currentPage * pageSize, totalItems);

    return (
        <div className="flex flex-col sm:flex-row items-center justify-between px-4 py-4 border-t border-[var(--border)] bg-[var(--card)] gap-4">
            <div className="text-sm text-[var(--muted-foreground)]">
                Showing <span className="font-medium text-[var(--foreground)]">{startRow}</span> to <span className="font-medium text-[var(--foreground)]">{endRow}</span> of{" "}
                <span className="font-medium text-[var(--foreground)]">{totalItems}</span> results
            </div>

            <div className="flex items-center gap-1 justify-center">
                <PaginationButton
                    onClick={() => onPageChange(1)}
                    disabled={currentPage === 1}
                    aria-label="First page"
                >
                    <ChevronsLeft className="w-4 h-4" />
                </PaginationButton>
                <PaginationButton
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    aria-label="Previous page"
                >
                    <ChevronLeft className="w-4 h-4" />
                </PaginationButton>

                <div className="flex items-center gap-1 mx-2">
                    {buildPageRange().map((p, i) =>
                        p === "…" ? (
                            <span key={`ellipsis-${i}`} className="px-2 text-[var(--muted-foreground)] text-sm font-medium">…</span>
                        ) : (
                            <PaginationButton
                                key={p}
                                active={p === currentPage}
                                onClick={() => onPageChange(p as number)}
                            >
                                {p}
                            </PaginationButton>
                        )
                    )}
                </div>

                <PaginationButton
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    aria-label="Next page"
                >
                    <ChevronRight className="w-4 h-4" />
                </PaginationButton>
                <PaginationButton
                    onClick={() => onPageChange(totalPages)}
                    disabled={currentPage === totalPages}
                    aria-label="Last page"
                >
                    <ChevronsRight className="w-4 h-4" />
                </PaginationButton>
            </div>
        </div>
    );
}

function PaginationButton({
    children,
    onClick,
    disabled = false,
    active = false,
    "aria-label": ariaLabel,
}: {
    children: React.ReactNode;
    onClick?: () => void;
    disabled?: boolean;
    active?: boolean;
    "aria-label"?: string;
}) {
    return (
        <button
            onClick={onClick}
            disabled={disabled}
            aria-label={ariaLabel}
            className={`
                min-w-[32px] h-8 px-2 flex items-center justify-center rounded-md text-sm font-medium transition-all
                ${active
                    ? "bg-[var(--primary)] text-[var(--primary-foreground)] shadow-sm"
                    : disabled
                        ? "text-[var(--muted-foreground)] opacity-50 cursor-not-allowed"
                        : "text-[var(--foreground)] hover:bg-[var(--muted)] hover:text-[var(--primary)] border border-transparent hover:border-[var(--border)]"
                }
            `}
        >
            {children}
        </button>
    );
}
