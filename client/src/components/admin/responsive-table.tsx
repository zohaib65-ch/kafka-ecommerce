import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { cn } from '@/lib/utils';

export type Column<T> = {
  id: string;
  header: string;
  cell: (row: T) => React.ReactNode;
  /** The row's main cell: the title of the card on small screens (rendered without a label). */
  primary?: boolean;
  className?: string;
  /** Hide the label on the card layout (e.g. for the actions cell). */
  hideLabel?: boolean;
};

type ResponsiveTableProps<T> = {
  caption: string;
  rows: T[];
  columns: Column<T>[];
  getRowKey: (row: T, index: number) => string;
};

/** A table from `md` up, a stack of cards (label / value pairs) below it. */
export function ResponsiveTable<T>({
  caption,
  rows,
  columns,
  getRowKey
}: ResponsiveTableProps<T>) {
  const primary = columns.find(column => column.primary) ?? columns[0];
  const secondary = columns.filter(column => column !== primary);

  return (
    <>
      <div className='hidden overflow-hidden rounded-2xl border bg-card md:block'>
        <Table>
          <caption className='sr-only'>{caption}</caption>
          <TableHeader>
            <TableRow className='bg-muted/40 hover:bg-muted/40'>
              {columns.map(column => (
                <TableHead
                  key={column.id}
                  scope='col'
                  className={cn(
                    'h-11 text-xs font-semibold text-muted-foreground uppercase',
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
              <TableRow key={getRowKey(row, index)}>
                {columns.map(column => (
                  <TableCell
                    key={column.id}
                    className={cn('py-3', column.className)}
                  >
                    {column.cell(row)}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <ul className='space-y-3 md:hidden' aria-label={caption}>
        {rows.map((row, index) => (
          <li
            key={getRowKey(row, index)}
            className='space-y-3 rounded-2xl border bg-card p-4'
          >
            <div>{primary.cell(row)}</div>
            <dl className='grid grid-cols-[auto_1fr] items-center gap-x-4 gap-y-2 text-sm'>
              {secondary.map(column => (
                <div key={column.id} className='contents'>
                  {column.hideLabel ? null : (
                    <dt className='text-muted-foreground'>{column.header}</dt>
                  )}
                  <dd
                    className={cn(
                      'min-w-0 break-words',
                      column.hideLabel && 'col-span-2'
                    )}
                  >
                    {column.cell(row)}
                  </dd>
                </div>
              ))}
            </dl>
          </li>
        ))}
      </ul>
    </>
  );
}
