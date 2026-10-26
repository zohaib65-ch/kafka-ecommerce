'use client';

import Link from 'next/link';

import {
  Form,
  RatingField,
  SelectField,
  SubmitButton,
  TextareaField,
  TextField,
  useZodForm
} from '@/components/forms';
import { Button } from '@/components/ui/button';
import {
  addReviewDefaultValues,
  addReviewSchema,
  recommendOptions
} from '@/lib/validations';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { addProductReview } from '@/store/review/actions';

const options = recommendOptions.map(option => ({ ...option }));

/** "Add Review" form. Reviews need an account (the API requires it), so guests are invited to sign in. */
export function ReviewForm() {
  const dispatch = useAppDispatch();
  const initialized = useAppSelector(state => state.authentication.initialized);
  const authenticated = useAppSelector(
    state => state.authentication.authenticated
  );
  const form = useZodForm(addReviewSchema, {
    defaultValues: addReviewDefaultValues
  });

  if (!initialized) return null;

  if (!authenticated) {
    return (
      <div className='rounded-2xl border bg-card p-6 text-center shadow-soft sm:p-8'>
        <h3 className='text-xl font-semibold'>Add Review</h3>
        <p className='mx-auto mt-2 max-w-sm text-sm text-muted-foreground'>
          Sign in to share what you think about this product.
        </p>
        <Button asChild className='mt-5'>
          <Link href='/login'>Login to write a review</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className='rounded-2xl border bg-card p-6 shadow-soft sm:p-8'>
      <h3 className='mb-5 text-xl font-semibold'>Add Review</h3>
      <Form
        form={form}
        onSubmit={async values => {
          const ok = await dispatch(addProductReview(values));
          if (ok) form.reset(addReviewDefaultValues);
        }}
      >
        <TextField
          control={form.control}
          name='title'
          label='Title'
          placeholder='Enter Review title'
        />
        <TextareaField
          control={form.control}
          name='review'
          label='Comment'
          placeholder='Write Review'
        />
        <RatingField control={form.control} name='rating' label='Rating' />
        <SelectField
          control={form.control}
          name='isRecommended'
          label='Will you recommend this product?'
          options={options}
        />
        <SubmitButton loading={form.formState.isSubmitting} size='lg'>
          Publish Review
        </SubmitButton>
      </Form>
    </div>
  );
}
