'use client';

import { useWatch } from 'react-hook-form';
import { SendHorizontal } from 'lucide-react';

import { Form, SubmitButton, TextField, useZodForm } from '@/components/forms';
import { supportMessageDefaultValues, supportMessageSchema } from './schema';

type MessageComposerProps = {
  disabled?: boolean;
  onSend: (text: string) => void;
};

export function MessageComposer({ disabled, onSend }: MessageComposerProps) {
  const form = useZodForm(supportMessageSchema, {
    defaultValues: supportMessageDefaultValues
  });
  const message = useWatch({ control: form.control, name: 'message' });

  return (
    <Form
      form={form}
      onSubmit={values => {
        onSend(values.message);
        form.reset();
      }}
      className='border-t p-3 sm:p-4'
    >
      <TextField
        control={form.control}
        name='message'
        placeholder='Type a message'
        autoComplete='off'
        disabled={disabled}
        inlineElement={
          <SubmitButton
            disabled={disabled || !message?.trim()}
            aria-label='Send message'
          >
            <SendHorizontal /> <span className='hidden sm:inline'>Send</span>
          </SubmitButton>
        }
      />
    </Form>
  );
}
