type ResultCountProps = {
  count: number;
  singular: string;
  plural: string;
};

export function ResultCount({ count, singular, plural }: ResultCountProps) {
  return (
    <p className='meta' aria-live='polite'>
      <span className='tabular text-foreground'>{count}</span>{' '}
      {count === 1 ? singular : plural}
    </p>
  );
}
