'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { cn } from '@/lib/utils';

import { useIsDesktop } from './use-is-desktop';

export type Column<T> = {
  id: string;
  header: string;
  cell: (row: T) => React.ReactNode;
  /** The row's main cell: the title of the stacked row on small screens (rendered without a label). */
  primary?: boolean;
  className?: string;
  /** Hide the label on the stacked layout (e.g. for the actions cell). */
  hideLabel?: boolean;
};

type ResponsiveTableProps<T> = {
  caption: string;
  rows: T[];
  columns: Column<T>[];
  getRowKey: (row: T, index: number) => string;
  /** Label / value pairs per line on small screens (default 2). */
  mobileColumns?: 2 | 3;
};

/** A ruled table from `md` up, ruled rows with label / value pairs below it. */
export function ResponsiveTable<T>({
  caption,
  rows,
  columns,
  getRowKey,
  mobileColumns = 2
}: ResponsiveTableProps<T>) {
  const isDesktop = useIsDesktop();
  const primary = columns.find(column => column.primary) ?? columns[0];
  const secondary = columns.filter(column => column !== primary);

  if (isDesktop) {
    return (
      <Table>
        <caption className='sr-only'>{caption}</caption>
        <TableHeader>
          <TableRow className='border-b-foreground hover:bg-transparent'>
            {columns.map(column => (
              <TableHead
                key={column.id}
                scope='col'
                className={cn(
                  'meta h-10 px-3 first:pl-0 last:pr-0',
                  column.className
                )}
              >
                {column.hideLabel ? (
                  <span className='sr-only'>{column.header}</span>
                ) : (
                  column.header
                )}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row, index) => (
            <TableRow
              key={getRowKey(row, index)}
              className='hover:bg-accent/40'
            >
              {columns.map(column => (
                <TableCell
                  key={column.id}
                  className={cn(
                    'px-3 py-3 first:pl-0 last:pr-0',
                    column.className
                  )}
                >
                  {column.cell(row)}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  }

  return (
    <ul className='divide-y border-y border-foreground' aria-label={caption}>
      {rows.map((row, index) => (
        <li key={getRowKey(row, index)} className='space-y-3 py-4'>
          <div>{primary.cell(row)}</div>
          <dl
            className={cn(
              'grid gap-x-4 gap-y-3 text-sm',
              mobileColumns === 3 ? 'grid-cols-3' : 'grid-cols-2'
            )}
          >
            {secondary.map(column => (
              <div
                key={column.id}
                className={cn('min-w-0', column.hideLabel && 'col-span-full')}
              >
                {column.hideLabel ? null : (
                  <dt className='meta mb-0.5'>{column.header}</dt>
                )}
                <dd className='min-w-0 break-words'>{column.cell(row)}</dd>
              </div>
            ))}
          </dl>
        </li>
      ))}
    </ul>
  );
}
