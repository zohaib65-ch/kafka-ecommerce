'use client';

import { ThemeProvider } from 'next-themes';

import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { StoreProvider } from '@/store/provider';

import { AnalyticsTracker } from './analytics-tracker';
import { AppBootstrap } from './app-bootstrap';
import { NavigationBridge } from './navigation-bridge';
import { SocketProvider } from './socket-provider';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute='class'
      defaultTheme='system'
      enableSystem
      disableTransitionOnChange
    >
      <StoreProvider>
        <SocketProvider>
          <TooltipProvider delayDuration={150}>
            <NavigationBridge />
            <AppBootstrap />
            <AnalyticsTracker />
            {children}
            <Toaster position='top-right' richColors closeButton />
          </TooltipProvider>
        </SocketProvider>
      </StoreProvider>
    </ThemeProvider>
  );
}
