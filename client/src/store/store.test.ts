import axios from 'axios';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { CART_ITEMS, CART_TOTAL, ROLES } from '@/lib/constants';
import { registerRouter } from '@/lib/navigation';
import type { CartItem, StoreProduct } from '@/types';
import { makeStore } from './index';

vi.mock('@/lib/notify', () => ({
  default: {
    success: vi.fn(),
    error: vi.fn(),
    warning: vi.fn(),
    info: vi.fn()
  }
}));

// Imported after the mock so the thunks pick it up.
import notify from '@/lib/notify';
import { setAuth, clearAuth } from './authentication/actions';
import {
  handleAddToCart,
  handleCart,
  handleRemoveFromCart,
  clearCart
} from './cart/actions';
import { filterProducts } from './product/actions';
import { fetchStoreProduct } from './product/actions';
import { toggleCart, toggleMenu, setCartOpen } from './navigation/actions';
import { getProductReviewsSummary } from './review/actions';
import { removeAddress, setAddresses } from './address/slice';
import { updateWishlist } from './wishlist/actions';
import { setStoreProducts } from './product/slice';
import { signOut } from './login/actions';
import { login } from './login/actions';
import { addProduct, updateProduct } from './product/actions';
import { setProfile } from './account/slice';
import { setBrandsSelect } from './brand/slice';
import { resetAccountPassword } from './reset-password/actions';
import { updateOrderItemStatus } from './order/actions';
import { setOrder } from './order/slice';

// A minimal window/localStorage for the thunks (the tests run in node).
const createStorage = () => {
  const data = new Map<string, string>();
  return {
    getItem: (key: string) => data.get(key) ?? null,
    setItem: (key: string, value: string) => void data.set(key, value),
    removeItem: (key: string) => void data.delete(key),
    clear: () => data.clear()
  };
};

const storage = createStorage();
const router = { push: vi.fn(), replace: vi.fn(), back: vi.fn() };

beforeEach(() => {
  storage.clear();
  registerRouter(router);
  router.push.mockClear();
  router.back.mockClear();
  vi.stubGlobal('window', { localStorage: storage });
  vi.mocked(notify.success).mockClear();
  vi.mocked(notify.error).mockClear();
});

afterEach(() => {
  registerRouter(null);
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

const product: StoreProduct = {
  _id: 'p1',
  sku: 'sku1',
  name: 'Chair',
  slug: 'chair',
  description: 'A chair',
  quantity: 40,
  inventory: 40,
  price: 19.99,
  taxable: false,
  isActive: true,
  brand: { name: 'Acme', slug: 'acme' }
};

describe('authentication and navigation', () => {
  it('starts signed out and not initialized', () => {
    const store = makeStore();
    expect(store.getState().authentication).toEqual({
      authenticated: false,
      initialized: false
    });
    store.dispatch(setAuth());
    expect(store.getState().authentication.authenticated).toBe(true);
    store.dispatch(clearAuth());
    expect(store.getState().authentication.authenticated).toBe(false);
  });

  it('the menu and cart drawers are mutually exclusive', () => {
    const store = makeStore();
    store.dispatch(toggleMenu());
    expect(store.getState().navigation).toMatchObject({
      isMenuOpen: true,
      isCartOpen: false
    });
    store.dispatch(toggleCart());
    expect(store.getState().navigation).toMatchObject({
      isMenuOpen: false,
      isCartOpen: true
    });
    store.dispatch(setCartOpen(false));
    expect(store.getState().navigation.isCartOpen).toBe(false);
  });

  it('each makeStore call returns an independent store', () => {
    const a = makeStore();
    const b = makeStore();
    a.dispatch(setAuth());
    expect(b.getState().authentication.authenticated).toBe(false);
  });
});

describe('cart', () => {
  it('adds an item, persists it and opens the drawer', () => {
    const store = makeStore();

    expect(store.dispatch(handleAddToCart(product, '1'))).toBe(true);

    const { cartItems, cartTotal } = store.getState().cart;
    expect(cartItems).toHaveLength(1);
    expect(cartItems[0]).toMatchObject({
      _id: 'p1',
      quantity: 1,
      inventory: 40,
      totalPrice: 19.99
    });
    expect(cartTotal).toBe(19.99);
    expect(store.getState().navigation.isCartOpen).toBe(true);

    const stored = JSON.parse(
      storage.getItem(CART_ITEMS) as string
    ) as CartItem[];
    expect(stored).toHaveLength(1);
    expect(storage.getItem(CART_TOTAL)).toBe('19.99');
  });

  it('computes the line total with two decimals', () => {
    const store = makeStore();
    store.dispatch(handleAddToCart({ ...product, price: 0.1 + 0.2 }, 3));
    expect(store.getState().cart.cartItems[0].totalPrice).toBe(0.9);
  });

  it('refuses quantities above the allowed maximum', () => {
    const store = makeStore();
    // inventory 40 => at most 5 per order
    expect(store.dispatch(handleAddToCart(product, 6))).toBe(false);
    expect(store.getState().cart.cartItems).toHaveLength(0);
    expect(notify.error).toHaveBeenCalledWith(
      'Quantity may not be greater than 5.'
    );
  });

  it('removes only the matching item and recalculates the total', () => {
    const store = makeStore();
    const other = { ...product, _id: 'p2', slug: 'table', price: 10 };
    store.dispatch(handleAddToCart(product, 1));
    store.dispatch(handleAddToCart(other, 2));
    expect(store.getState().cart.cartTotal).toBe(39.99);

    store.dispatch(handleRemoveFromCart({ _id: 'p1', slug: 'chair' }));
    expect(store.getState().cart.cartItems.map(item => item._id)).toEqual([
      'p2'
    ]);
    expect(store.getState().cart.cartTotal).toBe(20);

    // removing an item that is not in the cart leaves the cart alone (legacy sliced the wrong one)
    store.dispatch(handleRemoveFromCart({ _id: 'missing' }));
    expect(store.getState().cart.cartItems.map(item => item._id)).toEqual([
      'p2'
    ]);
  });

  it('restores the cart from localStorage and clears it', () => {
    const first = makeStore();
    first.dispatch(handleAddToCart(product, 1));

    const second = makeStore();
    second.dispatch(handleCart());
    expect(second.getState().cart.cartItems).toHaveLength(1);
    expect(second.getState().cart.cartTotal).toBe(19.99);

    second.dispatch(clearCart());
    expect(second.getState().cart).toEqual({
      cartItems: [],
      cartTotal: 0,
      cartId: ''
    });
    expect(storage.getItem(CART_ITEMS)).toBeNull();
  });

  it('ignores a corrupt stored cart', () => {
    storage.setItem(CART_ITEMS, '{not json');
    const store = makeStore();
    store.dispatch(handleCart());
    expect(store.getState().cart.cartItems).toEqual([]);
  });
});

describe('products', () => {
  it('sends sortOrder as a JSON string (the API JSON.parses it)', async () => {
    const get = vi.spyOn(axios, 'get').mockResolvedValue({
      data: { products: [product], totalPages: 3, currentPage: 2, count: 25 }
    });

    const store = makeStore();
    await store.dispatch(filterProducts('sorting', 1));

    expect(get).toHaveBeenCalledTimes(1);
    const [, config] = get.mock.calls[0];
    const params = config?.params as Record<string, unknown>;
    expect(params.sortOrder).toBe('{"price":-1}');
    // every param must be a primitive so axios serializes it as key=value
    for (const value of Object.values(params)) {
      expect(['string', 'number']).toContain(typeof value);
    }
    expect(params).toMatchObject({
      order: 1,
      page: 1,
      limit: 10,
      category: 'all'
    });

    const state = store.getState().product;
    expect(state.storeProducts).toHaveLength(1);
    expect(state.advancedFilters).toMatchObject({
      order: 1,
      totalPages: 3,
      currentPage: 2,
      count: 25
    });
    expect(state.isLoading).toBe(false);
  });

  it('keeps the loading flag consistent when the request fails', async () => {
    vi.spyOn(axios, 'get').mockRejectedValue(new Error('Network Error'));
    const store = makeStore();
    await store.dispatch(filterProducts());
    expect(store.getState().product.isLoading).toBe(false);
    expect(notify.error).toHaveBeenCalledWith('Network Error');
  });

  it('adds the stock as inventory to the product page product and clears it when missing', async () => {
    const store = makeStore();
    vi.spyOn(axios, 'get').mockResolvedValueOnce({
      data: { product: { ...product, inventory: undefined } }
    });
    await store.dispatch(fetchStoreProduct('chair'));
    expect(store.getState().product.storeProduct?.inventory).toBe(40);

    vi.spyOn(axios, 'get').mockRejectedValueOnce(
      Object.assign(new Error('not found'), {
        isAxiosError: true,
        response: { status: 404, data: {} }
      })
    );
    await store.dispatch(fetchStoreProduct('missing'));
    expect(store.getState().product.storeProduct).toBeNull();
  });
});

describe('wishlist', () => {
  it('asks to log in when signed out', async () => {
    const post = vi.spyOn(axios, 'post');
    const store = makeStore();
    expect(await store.dispatch(updateWishlist(true, 'p1'))).toBe(false);
    expect(post).not.toHaveBeenCalled();
    expect(notify.warning).toHaveBeenCalledWith(
      'Please login to wishlist a product'
    );
  });

  it('updates the liked flag of listed products', async () => {
    vi.spyOn(axios, 'post').mockResolvedValue({
      data: { success: true, message: 'Added to your Wishlist successfully!' }
    });
    vi.spyOn(axios, 'get').mockResolvedValue({ data: { wishlist: [] } });

    const store = makeStore();
    store.dispatch(setAuth());
    store.dispatch(setStoreProducts([{ ...product, isLiked: false }]));

    expect(await store.dispatch(updateWishlist(true, 'p1'))).toBe(true);
    expect(store.getState().product.storeProducts[0].isLiked).toBe(true);
  });
});

describe('auth thunks', () => {
  it('login stores the token and authenticates', async () => {
    vi.spyOn(axios, 'post').mockResolvedValue({
      data: {
        success: true,
        token: 'Bearer abc',
        user: { id: '1', firstName: 'Ada' }
      }
    });

    const store = makeStore();
    const ok = await store.dispatch(
      login({ email: 'a@b.co', password: '123456' })
    );

    expect(ok).toBe(true);
    expect(store.getState().authentication.authenticated).toBe(true);
    expect(storage.getItem('token')).toBe('Bearer abc');
    expect(axios.defaults.headers.common['Authorization']).toBe('Bearer abc');
    expect(notify.success).toHaveBeenCalledWith('Hey Ada, Welcome Back!');
  });

  it('signOut clears the session', () => {
    const store = makeStore();
    storage.setItem('token', 'Bearer abc');
    store.dispatch(setAuth());

    store.dispatch(signOut());

    expect(store.getState().authentication.authenticated).toBe(false);
    expect(storage.getItem('token')).toBeNull();
    expect(notify.success).toHaveBeenCalledWith('You have signed out!');
    expect(router.push).toHaveBeenCalledWith('/login');
  });
});

describe('lists', () => {
  it('removing an unknown id does not drop another item', () => {
    const store = makeStore();
    const base = {
      user: 'u',
      address: 'a',
      city: 'c',
      state: 's',
      country: 'x',
      zipCode: '12345',
      isDefault: false
    };
    store.dispatch(
      setAddresses([
        { _id: '1', ...base },
        { _id: '2', ...base }
      ])
    );
    store.dispatch(removeAddress('nope'));
    expect(store.getState().address.addresses).toHaveLength(2);
    store.dispatch(removeAddress('1'));
    expect(store.getState().address.addresses.map(a => a._id)).toEqual(['2']);
  });
});

describe('review summary', () => {
  it('buckets reviews by rounded rating', () => {
    const summary = getProductReviewsSummary([
      { rating: 5 },
      { rating: 4.6 },
      { rating: 4 },
      { rating: 1 }
    ]);
    expect(summary.totalReviews).toBe(4);
    expect(summary.totalRatings).toBeCloseTo(14.6);
    expect(summary.totalSummary).toBe(4);
    expect(summary.ratingSummary).toEqual([
      { 5: 2 },
      { 4: 1 },
      { 3: 0 },
      { 2: 0 },
      { 1: 1 }
    ]);
  });

  it('is empty without reviews', () => {
    expect(getProductReviewsSummary([])).toEqual({
      ratingSummary: [{ 5: 0 }, { 4: 0 }, { 3: 0 }, { 2: 0 }, { 1: 0 }],
      totalRatings: 0,
      totalReviews: 0,
      totalSummary: 0
    });
  });
});

describe('product forms', () => {
  const values = {
    sku: 'sku1',
    name: 'Chair',
    description: 'A chair',
    quantity: '10',
    price: '19.99',
    taxable: '1' as const,
    brand: 'brand-admin',
    image: new File(['x'], 'chair.png', { type: 'image/png' }),
    isActive: true
  };

  it('posts multipart form data and goes back on success', async () => {
    const post = vi.spyOn(axios, 'post').mockResolvedValue({
      data: {
        success: true,
        message: 'Product has been added successfully!',
        product: { _id: 'p9' }
      }
    });
    const store = makeStore();
    store.dispatch(setProfile({ role: ROLES.Admin }));

    expect(await store.dispatch(addProduct(values))).toBe(true);

    const [url, body, config] = post.mock.calls[0];
    expect(String(url)).toMatch(/\/product\/add$/);
    const form = body as FormData;
    expect(form.get('sku')).toBe('sku1');
    expect(form.get('taxable')).toBe('1');
    expect(form.get('isActive')).toBe('true');
    expect(form.get('brand')).toBe('brand-admin');
    expect(form.get('image')).toBeInstanceOf(File);
    expect(config?.headers).toMatchObject({
      'Content-Type': 'multipart/form-data'
    });
    expect(store.getState().product.products.map(p => p._id)).toEqual(['p9']);
    expect(router.back).toHaveBeenCalled();
    expect(notify.success).toHaveBeenCalledWith(
      'Product has been added successfully!'
    );
  });

  it('locks merchants to their own brand and omits an empty brand', async () => {
    const post = vi.spyOn(axios, 'post').mockResolvedValue({
      data: { success: true, message: 'ok', product: { _id: 'p9' } }
    });
    const store = makeStore();
    store.dispatch(setProfile({ role: ROLES.Merchant }));
    store.dispatch(
      setBrandsSelect([
        { value: 0, label: 'No option selected' },
        { value: 'my-brand', label: 'Mine' }
      ])
    );

    await store.dispatch(addProduct({ ...values, brand: 'other-brand' }));
    expect((post.mock.calls[0][1] as FormData).get('brand')).toBe('my-brand');

    const admin = makeStore();
    admin.dispatch(setProfile({ role: ROLES.Admin }));
    await admin.dispatch(addProduct({ ...values, brand: '0' }));
    expect((post.mock.calls[1][1] as FormData).has('brand')).toBe(false);
  });

  it('keeps the page on failure and reports false', async () => {
    vi.spyOn(axios, 'post').mockRejectedValue(new Error('Network Error'));
    const store = makeStore();
    expect(await store.dispatch(addProduct(values))).toBe(false);
    expect(router.back).not.toHaveBeenCalled();
  });

  it('updates with numbers, a boolean taxable and a null brand for "no option"', async () => {
    const put = vi.spyOn(axios, 'put').mockResolvedValue({
      data: {
        success: true,
        message: 'Product has been updated successfully!'
      }
    });
    const store = makeStore();

    const ok = await store.dispatch(
      updateProduct('p1', {
        name: 'Chair',
        sku: 'sku1',
        slug: 'chair',
        description: 'A chair',
        quantity: '7',
        price: '12.5',
        taxable: '0',
        brand: '0'
      })
    );

    expect(ok).toBe(true);
    expect(put.mock.calls[0][1]).toEqual({
      product: {
        name: 'Chair',
        sku: 'sku1',
        slug: 'chair',
        description: 'A chair',
        quantity: 7,
        price: 12.5,
        taxable: false,
        brand: null
      }
    });
  });
});

describe('account password and orders', () => {
  it('changing the password signs the user out', async () => {
    vi.spyOn(axios, 'post').mockResolvedValue({
      data: { success: true, message: 'Password changed successfully.' }
    });
    const store = makeStore();
    store.dispatch(setAuth());

    const ok = await store.dispatch(
      resetAccountPassword({
        password: 'old-secret',
        confirmPassword: 'new-secret'
      })
    );

    expect(ok).toBe(true);
    expect(store.getState().authentication.authenticated).toBe(false);
    expect(router.push).toHaveBeenCalledWith('/login');
    expect(notify.success).toHaveBeenCalledWith(
      'Password changed successfully.'
    );
  });

  it('updates an order item status and refetches the order', async () => {
    const order = {
      _id: 'o1',
      cartId: 'c1',
      created: '2026-01-01',
      total: 10,
      products: [
        {
          _id: 'i1',
          product: null,
          quantity: 1,
          purchasePrice: 10,
          totalPrice: 10,
          priceWithTax: 10,
          totalTax: 0,
          status: 'Not processed' as const
        }
      ]
    };
    const put = vi.spyOn(axios, 'put').mockResolvedValue({
      data: {
        success: true,
        message: 'Item status has been updated successfully!'
      }
    });
    // the refetch returns what the server now holds
    const updated = {
      ...order,
      products: [{ ...order.products[0], status: 'Shipped' as const }]
    };
    const get = vi
      .spyOn(axios, 'get')
      .mockResolvedValue({ data: { order: updated } });

    const store = makeStore();
    store.dispatch(setOrder(order));
    await store.dispatch(updateOrderItemStatus('i1', 'Shipped'));
    expect(String(get.mock.calls[0][0])).toMatch(/\/order\/o1$/);

    expect(put.mock.calls[0][1]).toEqual({
      orderId: 'o1',
      cartId: 'c1',
      status: 'Shipped'
    });
    expect(store.getState().order.order?.products[0].status).toBe('Shipped');
    expect(notify.success).toHaveBeenCalledWith(
      'Item status has been updated successfully!'
    );
  });

  it('sends the user to the orders list when every item was cancelled', async () => {
    vi.spyOn(axios, 'put').mockResolvedValue({
      data: { success: true, orderCancelled: true, message: 'cancelled' }
    });
    const store = makeStore();
    store.dispatch(
      setOrder({
        _id: 'o1',
        cartId: 'c1',
        created: 'x',
        total: 1,
        products: []
      })
    );
    await store.dispatch(updateOrderItemStatus('i1', 'Cancelled'));
    expect(router.push).toHaveBeenCalledWith('/dashboard/orders');
  });
});
