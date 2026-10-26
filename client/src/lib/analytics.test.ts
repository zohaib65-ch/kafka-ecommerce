import { describe, expect, it } from 'vitest';

import { analyticsProductId, normalizePath } from './analytics';

describe('normalizePath', () => {
  it('keeps the tracked storefront routes', () => {
    expect(normalizePath('/')).toBe('/');
    expect(normalizePath('/shop')).toBe('/shop');
    expect(normalizePath('/shop/category/toys')).toBe('/shop/category/toys');
    expect(normalizePath('/product/blue-chair')).toBe('/product/blue-chair');
    expect(normalizePath('/login/')).toBe('/login');
    expect(normalizePath('/register')).toBe('/register');
    expect(normalizePath('/contact')).toBe('/contact');
  });

  it('strips query strings and hashes', () => {
    expect(normalizePath('/shop?min=1&max=50')).toBe('/shop');
    expect(normalizePath('/product/blue-chair#reviews')).toBe(
      '/product/blue-chair'
    );
  });

  it('collapses order pages to /order/success and drops record ids', () => {
    expect(normalizePath('/order/success/65f0c0ffee')).toBe('/order/success');
    expect(normalizePath('/order/65f0c0ffee')).toBeNull();
  });

  it('never tracks routes that carry secrets or private data', () => {
    expect(normalizePath('/reset-password/abc123')).toBeNull();
    expect(normalizePath('/merchant-signup/abc123')).toBeNull();
    expect(normalizePath('/auth/success')).toBeNull();
    expect(normalizePath('/dashboard/orders')).toBeNull();
    expect(normalizePath(undefined)).toBeNull();
  });
});

describe('analyticsProductId', () => {
  it('prefers a valid slug', () => {
    expect(analyticsProductId({ slug: 'blue-chair', _id: 'ABC' })).toBe(
      'blue-chair'
    );
  });

  it('falls back to the lower-cased id when the slug does not fit', () => {
    expect(analyticsProductId({ slug: 'Not A Slug!', _id: '65F0C0FFEE' })).toBe(
      '65f0c0ffee'
    );
    expect(analyticsProductId({ slug: 'x'.repeat(65), _id: 'abc' })).toBe(
      'abc'
    );
  });

  it('returns null without usable identifiers', () => {
    expect(analyticsProductId(null)).toBeNull();
    expect(analyticsProductId({})).toBeNull();
  });
});
