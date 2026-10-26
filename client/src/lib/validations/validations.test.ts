import { describe, expect, it } from 'vitest';

import {
  accountPasswordSchema,
  addAddressSchema,
  addCategorySchema,
  addProductSchema,
  addReviewSchema,
  contactSchema,
  createQuantitySchema,
  editAddressSchema,
  editBrandSchema,
  editProductSchema,
  forgotPasswordSchema,
  getMaxPurchaseQuantity,
  loginSchema,
  merchantSchema,
  productToFormValues,
  resetPasswordSchema,
  signupSchema
} from './index';
import type { ProductDetail } from '@/types';

// First message of the first issue for a field, or undefined when the field is valid.
const messageFor = (
  result: {
    success: boolean;
    error?: { issues: Array<{ path: PropertyKey[]; message: string }> };
  },
  field: string
) => result.error?.issues.find(issue => issue.path[0] === field)?.message;

describe('auth schemas', () => {
  it('login uses the legacy messages', () => {
    const empty = loginSchema.safeParse({ email: '', password: '' });
    expect(messageFor(empty, 'email')).toBe('Email is required.');
    expect(messageFor(empty, 'password')).toBe('Password is required.');

    const invalid = loginSchema.safeParse({ email: 'nope', password: '123' });
    expect(messageFor(invalid, 'email')).toBe('Email format is invalid.');
    expect(messageFor(invalid, 'password')).toBe(
      'Password must be at least 6 characters.'
    );

    expect(
      loginSchema.safeParse({ email: 'a@b.co', password: '123456' }).success
    ).toBe(true);
  });

  it('signup requires every field and keeps the subscription flag', () => {
    const empty = signupSchema.safeParse({
      email: '',
      firstName: ' ',
      lastName: '',
      password: ''
    });
    expect(messageFor(empty, 'firstName')).toBe('First Name is required.');
    expect(messageFor(empty, 'lastName')).toBe('Last Name is required.');

    const ok = signupSchema.parse({
      email: ' me@example.com ',
      firstName: 'Me',
      lastName: 'Too',
      password: 'secret1'
    });
    expect(ok.email).toBe('me@example.com');
  });

  it('forgot password validates the email', () => {
    expect(
      messageFor(forgotPasswordSchema.safeParse({ email: '' }), 'email')
    ).toBe('Email is required.');
    expect(
      messageFor(forgotPasswordSchema.safeParse({ email: 'x' }), 'email')
    ).toBe('Email format is invalid.');
  });

  it('reset password needs matching passwords, account password does not compare them', () => {
    const mismatch = resetPasswordSchema.safeParse({
      password: 'abcdef',
      confirmPassword: 'abcdeg'
    });
    expect(messageFor(mismatch, 'confirmPassword')).toBe(
      'Confirm password and password fields must match.'
    );
    expect(
      resetPasswordSchema.safeParse({
        password: 'abcdef',
        confirmPassword: 'abcdef'
      }).success
    ).toBe(true);

    // old password + new password: they are different by design
    expect(
      accountPasswordSchema.safeParse({
        password: 'old-secret',
        confirmPassword: 'new-secret'
      }).success
    ).toBe(true);
    const short = accountPasswordSchema.safeParse({
      password: 'old-secret',
      confirmPassword: '123'
    });
    expect(messageFor(short, 'confirmPassword')).toBe(
      'Confirm password must be at least 6 characters.'
    );
  });
});

describe('contact and merchant schemas', () => {
  it('contact needs a 10 character message', () => {
    const result = contactSchema.safeParse({
      name: 'A',
      email: 'a@b.co',
      message: 'too short'
    });
    expect(messageFor(result, 'message')).toBe(
      'Message must be at least 10 characters.'
    );
  });

  it('merchant validates the phone number and business description', () => {
    const base = {
      name: 'Shop',
      email: 'shop@example.com',
      phoneNumber: '951-999-9999',
      brandName: 'Brand',
      business: 'We sell things.'
    };
    expect(merchantSchema.safeParse(base).success).toBe(true);
    expect(
      merchantSchema.safeParse({ ...base, phoneNumber: '(951) 999 9999' })
        .success
    ).toBe(true);

    const bad = merchantSchema.safeParse({
      ...base,
      phoneNumber: '12345',
      business: 'short'
    });
    expect(messageFor(bad, 'phoneNumber')).toBe(
      'Phone number format is invalid.'
    );
    expect(messageFor(bad, 'business')).toBe(
      'Business must be at least 10 characters.'
    );
  });
});

describe('address schemas', () => {
  const address = {
    address: '1 Main St',
    city: 'Riverside',
    state: 'CA',
    country: 'USA',
    isDefault: false
  };

  it('add requires a 5 character zip code, edit only a non empty one', () => {
    expect(
      messageFor(
        addAddressSchema.safeParse({ ...address, zipCode: '1234' }),
        'zipCode'
      )
    ).toBe('Zipcode must be at least 5 characters.');
    expect(
      messageFor(
        addAddressSchema.safeParse({ ...address, zipCode: '' }),
        'zipCode'
      )
    ).toBe('Zipcode is required.');
    expect(
      editAddressSchema.safeParse({ ...address, zipCode: '1234' }).success
    ).toBe(true);
  });
});

describe('brand, category and product schemas', () => {
  it('edit brand slug is alpha-dash', () => {
    const result = editBrandSchema.safeParse({
      name: 'Brand',
      slug: 'not valid!',
      description: 'ok'
    });
    expect(messageFor(result, 'slug')).toBe(
      'Slug may have alpha-numeric characters, as well as dashes and underscores only.'
    );
  });

  it('descriptions are limited to 200 characters', () => {
    const result = editBrandSchema.safeParse({
      name: 'Brand',
      slug: 'brand',
      description: 'x'.repeat(201)
    });
    expect(messageFor(result, 'description')).toBe(
      'Description may not be greater than 200 characters.'
    );
  });

  it('category needs at least one product', () => {
    const result = addCategorySchema.safeParse({
      name: 'Shoes',
      description: 'Shoes',
      products: [],
      isActive: true
    });
    expect(messageFor(result, 'products')).toBe('Products are required.');
  });

  const product = {
    sku: 'sku_1-a',
    name: 'Chair',
    description: 'A chair',
    quantity: '10',
    price: '19.99',
    taxable: '1',
    brand: 'abc123',
    isActive: true
  };

  it('add product requires a jpg/png image', () => {
    const missing = addProductSchema.safeParse(product);
    expect(messageFor(missing, 'image')).toBe(
      'Please upload files with jpg, jpeg, png format.'
    );

    const gif = new File(['x'], 'a.gif', { type: 'image/gif' });
    expect(
      messageFor(
        addProductSchema.safeParse({ ...product, image: gif }),
        'image'
      )
    ).toBe('Please upload files with jpg, jpeg, png format.');

    const png = new File(['x'], 'a.png', { type: 'image/png' });
    expect(addProductSchema.safeParse({ ...product, image: png }).success).toBe(
      true
    );
  });

  it('add product rejects the "no brand" option and bad numbers', () => {
    const png = new File(['x'], 'a.png', { type: 'image/png' });
    const result = addProductSchema.safeParse({
      ...product,
      image: png,
      brand: '0',
      quantity: '1.5',
      price: 'abc',
      sku: 'bad sku'
    });
    expect(messageFor(result, 'brand')).toBe('Brand is required.');
    expect(messageFor(result, 'quantity')).toBe(
      'Quantity must be a whole number.'
    );
    expect(messageFor(result, 'price')).toBe('Price must be a number.');
    expect(messageFor(result, 'sku')).toBe(
      'Sku may have alpha-numeric characters, as well as dashes and underscores only.'
    );
  });

  it('edit product allows detaching the brand and builds form values from the entity', () => {
    const detail: ProductDetail = {
      _id: '1',
      sku: 'sku1',
      name: 'Chair',
      slug: 'chair',
      description: 'A chair',
      quantity: 5,
      price: 12.5,
      taxable: true,
      isActive: true,
      brand: { value: 0, label: 'No option selected' },
      inventory: 5
    };
    const values = productToFormValues(detail);
    expect(values).toEqual({
      name: 'Chair',
      sku: 'sku1',
      slug: 'chair',
      description: 'A chair',
      quantity: '5',
      price: '12.5',
      taxable: '1',
      brand: '0'
    });
    expect(editProductSchema.safeParse(values).success).toBe(true);
  });
});

describe('review schema', () => {
  it('requires a rating of at least one star', () => {
    const result = addReviewSchema.safeParse({
      title: 'Great',
      review: 'Loved it',
      rating: 0,
      isRecommended: '1'
    });
    expect(messageFor(result, 'rating')).toBe('Rating is required.');
    expect(
      addReviewSchema.safeParse({
        title: 'Great',
        review: 'Loved it',
        rating: 4,
        isRecommended: '0'
      }).success
    ).toBe(true);
  });
});

describe('quantity schema', () => {
  it('maps the stock to the maximum purchase quantity', () => {
    expect(getMaxPurchaseQuantity(10)).toBe(1);
    expect(getMaxPurchaseQuantity(25)).toBe(1);
    expect(getMaxPurchaseQuantity(26)).toBe(5);
    expect(getMaxPurchaseQuantity(100)).toBe(5);
    expect(getMaxPurchaseQuantity(101)).toBe(25);
    expect(getMaxPurchaseQuantity(499)).toBe(25);
    expect(getMaxPurchaseQuantity(500)).toBe(50);
  });

  it('validates the range for the stock', () => {
    const schema = createQuantitySchema(50);
    expect(schema.safeParse({ quantity: '5' }).success).toBe(true);
    expect(messageFor(schema.safeParse({ quantity: '6' }), 'quantity')).toBe(
      'Quantity may not be greater than 5.'
    );
    expect(messageFor(schema.safeParse({ quantity: '0' }), 'quantity')).toBe(
      'Quantity must be at least 1.'
    );
    expect(messageFor(schema.safeParse({ quantity: '' }), 'quantity')).toBe(
      'Quantity must be at least 1.'
    );
  });
});
