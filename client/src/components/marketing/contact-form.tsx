'use client';

import {
  Form,
  SubmitButton,
  TextField,
  TextareaField,
  useZodForm
} from '@/components/forms';
import { contactDefaultValues, contactSchema } from '@/lib/validations/contact';
import { contactUs } from '@/store/contact/actions';
import { useAppDispatch } from '@/store/hooks';

export function ContactForm() {
  const dispatch = useAppDispatch();
  const form = useZodForm(contactSchema, {
    defaultValues: contactDefaultValues
  });

  return (
    <Form
      form={form}
      onSubmit={async values => {
        const ok = await dispatch(contactUs(values));
        if (ok) form.reset();
      }}
    >
      <div className='grid gap-5 sm:grid-cols-2'>
        <TextField
          control={form.control}
          name='name'
          label='Name'
          placeholder='You Full Name'
          autoComplete='name'
        />
        <TextField
          control={form.control}
          name='email'
          type='email'
          label='Email'
          placeholder='Your Email Address'
          autoComplete='email'
        />
      </div>
      <TextareaField
        control={form.control}
        name='message'
        label='Message'
        placeholder='Please Describe Your Message'
        rows={6}
      />
      <SubmitButton
        size='lg'
        className='w-full sm:w-auto'
        loading={form.formState.isSubmitting}
      >
        Submit
      </SubmitButton>
    </Form>
  );
}
