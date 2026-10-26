/**
 * Fallback photos for products that have no uploaded image (the seeded demo catalog has none).
 *
 * Photos live in public/images/products (800 x 800 JPEG); sources and licenses are listed in
 * docs/image-credits/products.md. productFallbackImage() always returns the path of a file that exists.
 */

const IMAGE_DIR = '/images/products';

export type ProductFallbackNoun = {
  /** Lowercase noun; also the file name without extension. */
  noun: string;
  /** Used in the alt text, e.g. "Chair product photo". */
  label: string;
  src: string;
  /** Lowercase singular and plural forms recognised in product and category names. */
  keywords: readonly string[];
};

const entry = (
  noun: string,
  label: string,
  keywords: readonly string[]
): ProductFallbackNoun => ({
  noun,
  label,
  src: `${IMAGE_DIR}/${noun}.jpg`,
  keywords: [noun, ...keywords]
});

// Nouns produced by faker's commerce.productName() in server/utils/seed.js.
export const PRODUCT_FALLBACK_NOUNS: readonly ProductFallbackNoun[] = [
  entry('chair', 'Chair', ['chairs']),
  entry('car', 'Car', ['cars']),
  entry('computer', 'Computer', ['computers']),
  entry('keyboard', 'Keyboard', ['keyboards']),
  entry('mouse', 'Mouse', ['mice']),
  entry('bike', 'Bike', ['bikes', 'bicycle', 'bicycles']),
  entry('ball', 'Ball', ['balls']),
  entry('gloves', 'Gloves', ['glove']),
  entry('pants', 'Pants', ['pant', 'jeans', 'trousers']),
  entry('shirt', 'Shirt', ['shirts', 'tshirt', 'tshirts']),
  entry('table', 'Table', ['tables']),
  entry('shoes', 'Shoes', ['shoe', 'sneaker', 'sneakers']),
  entry('hat', 'Hat', ['hats', 'cap', 'caps']),
  entry('towels', 'Towels', ['towel']),
  entry('soap', 'Soap', ['soaps']),
  entry('tuna', 'Tuna', []),
  entry('chicken', 'Chicken', ['chickens']),
  entry('fish', 'Fish', ['fishes']),
  entry('cheese', 'Cheese', ['cheeses']),
  entry('bacon', 'Bacon', []),
  entry('pizza', 'Pizza', ['pizzas']),
  entry('salad', 'Salad', ['salads']),
  entry('sausages', 'Sausages', ['sausage']),
  entry('chips', 'Chips', ['chip'])
];

/** Neutral photos for products whose name matches no noun above. */
export const PRODUCT_GENERIC_IMAGES: readonly string[] = [
  `${IMAGE_DIR}/generic-1.jpg`,
  `${IMAGE_DIR}/generic-2.jpg`,
  `${IMAGE_DIR}/generic-3.jpg`,
  `${IMAGE_DIR}/generic-4.jpg`
];

type ProductImageSource = {
  _id?: string;
  name?: string;
  slug?: string;
  category?: { name?: string } | null;
};

const NOUN_BY_KEYWORD = new Map<string, ProductFallbackNoun>();
PRODUCT_FALLBACK_NOUNS.forEach(item =>
  item.keywords.forEach(keyword => NOUN_BY_KEYWORD.set(keyword, item))
);

// Whole words only, with simple plural tolerance: "Glove" -> gloves, "Sausages" -> sausage, "Chips" -> chip.
const findNoun = (text?: string): ProductFallbackNoun | null => {
  if (!text) return null;

  const words = text.toLowerCase().match(/[a-z]+/g) ?? [];
  // The last noun is the head of the name ("Computer Mouse" is a mouse).
  for (let i = words.length - 1; i >= 0; i -= 1) {
    const word = words[i];
    const found =
      NOUN_BY_KEYWORD.get(word) ??
      NOUN_BY_KEYWORD.get(word.replace(/s$/, '')) ??
      NOUN_BY_KEYWORD.get(word.replace(/es$/, ''));
    if (found) return found;
  }

  return null;
};

// FNV-1a: tiny, stable across runtimes (server and browser render the same image).
const hash = (value: string): number => {
  let result = 0x811c9dc5;
  for (let i = 0; i < value.length; i += 1) {
    result ^= value.charCodeAt(i);
    result = Math.imul(result, 0x01000193);
  }
  return result >>> 0;
};

export const productFallbackImage = (
  product: ProductImageSource
): { src: string; alt: string } => {
  // The product name wins; the category name ("Shoes", "Computers") is the second signal.
  const match = findNoun(product.name) ?? findNoun(product.category?.name);
  if (match) {
    return { src: match.src, alt: `${match.label} product photo` };
  }

  const seed = product._id || product.slug || product.name || '';
  return {
    src: PRODUCT_GENERIC_IMAGES[hash(seed) % PRODUCT_GENERIC_IMAGES.length],
    alt: 'Product photo'
  };
};
