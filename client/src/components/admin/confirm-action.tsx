'use client';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from '@/components/ui/alert-dialog';

type ConfirmActionProps = {
  trigger: React.ReactNode;
  title: string;
  description: string;
  confirmLabel: string;
  /** 'destructive' (red confirm button) for removals, 'default' for reversible changes. */
  tone?: 'destructive' | 'default';
  onConfirm: () => void;
};

/** Confirmation dialog for reversible and destructive actions (ConfirmDialog is destructive only). */
export function ConfirmAction({
  trigger,
  title,
  description,
  confirmLabel,
  tone = 'destructive',
  onConfirm
}: ConfirmActionProps) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction variant={tone} onClick={onConfirm}>
            {confirmLabel}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
