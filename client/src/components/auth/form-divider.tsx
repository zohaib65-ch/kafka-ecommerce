/** "or" separator between the social buttons and the email form. */
export function FormDivider({ children }: { children: React.ReactNode }) {
  return (
    <div className='my-6 flex items-center gap-4 text-xs tracking-wide text-muted-foreground uppercase'>
      <span className='h-px flex-1 bg-border' />
      {children}
      <span className='h-px flex-1 bg-border' />
    </div>
  );
}
