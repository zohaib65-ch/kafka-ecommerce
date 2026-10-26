import { z } from 'zod';

import { requiredText, yesNoField, yesNoOptions } from './common';

export { yesNoOptions as recommendOptions };

/**
 * Product review.
 *  - `rating`: a number from the star input (1-5); 0 means "not rated yet".
 *  - `isRecommended`: '1' (Yes) | '0' (No).
 */
export const addReviewSchema = z.object({
  title: requiredText('Title is required.'),
  review: requiredText('Review is required.'),
  rating: z
    .number({ error: 'Rating is required.' })
    .min(1, 'Rating is required.')
    .max(5, 'Rating may not be greater than 5.'),
  isRecommended: yesNoField('Recommendable is required.')
});
export type AddReviewValues = z.infer<typeof addReviewSchema>;
export const addReviewDefaultValues: AddReviewValues = {
  title: '',
  review: '',
  rating: 0,
  isRecommended: '1'
};
