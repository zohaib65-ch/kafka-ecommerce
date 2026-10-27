'use client';

import { useId } from 'react';
import { useWatch } from 'react-hook-form';
import { SendHorizontal } from 'lucide-react';

import { Form, SubmitButton, useZodForm } from '@/components/forms';
import { Input } from '@/components/ui/input';
import { supportMessageDefaultValues, supportMessageSchema } from './schema';

type MessageComposerProps = {
  disabled?: boolean;
  onSend: (text: string) => void;
};

export function MessageComposer({ disabled, onSend }: MessageComposerProps) {
  const inputId = useId();
  const form = useZodForm(supportMessageSchema, {
    defaultValues: supportMessageDefaultValues
  });
  const message = useWatch({ control: form.control, name: 'message' });
  const error = form.formState.errors.message;

  return (
    <Form
      form={form}
      onSubmit={values => {
        onSend(values.message);
        form.reset();
      }}
      className='space-y-2 border-t p-3 sm:p-4'
    >
      <div className='flex'>
        <Input
          id={inputId}
          {...form.register('message')}
          placeholder='Type a message'
          aria-label='Message'
          autoComplete='off'
          disabled={disabled}
          aria-invalid={!!error}
          className='rounded-r-none border-r-0'
        />
        <SubmitButton
          disabled={disabled || !message?.trim()}
          aria-label='Send message'
          className='rounded-l-none'
        >
          <SendHorizontal /> <span className='hidden sm:inline'>Send</span>
        </SubmitButton>
      </div>
      {error && (
        <p role='alert' className='text-sm text-destructive'>
          {error.message}
        </p>
      )}
    </Form>
  );
}
