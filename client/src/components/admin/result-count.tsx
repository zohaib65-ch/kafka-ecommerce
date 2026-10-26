type ResultCountProps = {
  count: number;
  singular: string;
  plural: string;
};

export function ResultCount({ count, singular, plural }: ResultCountProps) {
  return (
    <p className='text-sm text-muted-foreground' aria-live='polite'>
      <span className='font-medium text-foreground'>{count}</span>{' '}
      {count === 1 ? singular : plural}
    </p>
  );
}
