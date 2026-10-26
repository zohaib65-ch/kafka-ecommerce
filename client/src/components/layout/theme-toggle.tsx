'use client';

import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';

import { Button } from '@/components/ui/button';

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();

  return (
    <Button
      variant='ghost'
      size='icon'
      aria-label='Toggle color theme'
      onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
    >
      <Sun className='size-[1.1rem] dark:hidden' aria-hidden='true' />
      <Moon className='hidden size-[1.1rem] dark:block' aria-hidden='true' />
    </Button>
  );
}
