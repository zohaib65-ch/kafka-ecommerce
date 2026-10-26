'use client';

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious
} from '@/components/ui/pagination';

type PaginationBarProps = {
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
  className?: string;
};

// Mirrors the old react-paginate setup: 2 edge pages on each side, 3 pages around the current one.
const MARGIN_PAGES = 2;
const RANGE = 3;

const buildPages = (total: number, current: number): Array<number | 'gap'> => {
  const pages = new Set<number>();
  for (let i = 1; i <= Math.min(MARGIN_PAGES, total); i += 1) pages.add(i);
  for (let i = Math.max(1, total - MARGIN_PAGES + 1); i <= total; i += 1)
    pages.add(i);
  const half = Math.floor(RANGE / 2);
  for (let i = current - half; i <= current + half; i += 1) {
    if (i >= 1 && i <= total) pages.add(i);
  }

  const sorted = [...pages].sort((a, b) => a - b);
  const result: Array<number | 'gap'> = [];
  sorted.forEach((page, index) => {
    if (index > 0 && page - sorted[index - 1] > 1) result.push('gap');
    result.push(page);
  });
  return result;
};

export function PaginationBar({
  totalPages,
  currentPage,
  onPageChange,
  className
}: PaginationBarProps) {
  if (totalPages <= 1) return null;

  const go = (page: number) => (event: React.MouseEvent) => {
    event.preventDefault();
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      onPageChange(page);
    }
  };

  return (
    <Pagination className={className}>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href='#'
            onClick={go(currentPage - 1)}
            aria-disabled={currentPage <= 1}
            className={
              currentPage <= 1 ? 'pointer-events-none opacity-50' : undefined
            }
          />
        </PaginationItem>
        {buildPages(totalPages, currentPage).map((page, index) =>
          page === 'gap' ? (
            <PaginationItem key={`gap-${index}`}>
              <PaginationEllipsis />
            </PaginationItem>
          ) : (
            <PaginationItem key={page}>
              <PaginationLink
                href='#'
                isActive={page === currentPage}
                onClick={go(page)}
              >
                {page}
              </PaginationLink>
            </PaginationItem>
          )
        )}
        <PaginationItem>
          <PaginationNext
            href='#'
            onClick={go(currentPage + 1)}
            aria-disabled={currentPage >= totalPages}
            className={
              currentPage >= totalPages
                ? 'pointer-events-none opacity-50'
                : undefined
            }
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
