/**
 * Typed manifest of the site photography in /public/images (hero, categories, site).
 * Sources and licenses are listed in docs/image-credits/site.md.
 */

export type SiteImage = {
  src: string;
  alt: string;
  width: number;
  height: number;
};

export type HeroSlide = {
  id: string;
  image: string;
  alt: string;
  width: number;
  height: number;
};

export const heroSlides: HeroSlide[] = [
  {
    id: 'fashion',
    image: '/images/hero/hero-1.jpg',
    alt: 'Shopper in a burgundy coat carrying paper shopping bags',
    width: 1600,
    height: 900
  },
  {
    id: 'tech',
    image: '/images/hero/hero-2.jpg',
    alt: 'Laptop on a light wooden desk with brass decor and a small plant',
    width: 1600,
    height: 900
  },
  {
    id: 'home',
    image: '/images/hero/hero-3.jpg',
    alt: 'Bright modern living room with tall windows and a wooden coffee table',
    width: 1600,
    height: 900
  }
];

export const siteImages = {
  sell: {
    src: '/images/site/sell.jpg',
    alt: 'Seller scanning a parcel on a phone beside a stack of packed boxes',
    width: 1200,
    height: 900
  },
  auth: {
    src: '/images/site/auth.jpg',
    alt: 'Still life of white ceramic vases with red berry branches against a soft curtain',
    width: 1000,
    height: 1400
  },
  contact: {
    src: '/images/site/contact.jpg',
    alt: 'Smiling customer support agent wearing a headset at a desk',
    width: 1200,
    height: 800
  },
  promo1: {
    src: '/images/site/promo-1.jpg',
    alt: 'Candles and a small plant on a round table in a cozy bedroom corner',
    width: 1000,
    height: 700
  },
  promo2: {
    src: '/images/site/promo-2.jpg',
    alt: 'Hand holding red, white, blue and kraft paper shopping bags',
    width: 1000,
    height: 700
  }
} satisfies Record<string, SiteImage>;

const CATEGORY_SIZE = 640;

const categoryImages = {
  books: 'Curved library shelves full of books',
  movies: 'Glass bowl of fresh popcorn',
  music: 'Amber vinyl record spinning on a turntable',
  games: 'Board game pieces and dice',
  electronics: 'Wireless headphones on a yellow background',
  computers: 'Hands typing on a laptop keyboard',
  home: 'Living room with an orange armchair, plants and a sideboard',
  garden: 'Potted herbs seen from above',
  tools: 'Sunlit woodworking workshop',
  grocery: 'Fresh vegetables on grocery shelves',
  health: 'Outdoor yoga class on a lawn',
  beauty: 'Makeup brushes and cosmetics arranged flat',
  toys: 'Colorful toys arranged flat on white',
  kids: 'Children playing with a ball in a green forest lane',
  baby: 'Pastel baby clothes hanging on a rail',
  clothing: 'Knitwear hanging on a clothing rail',
  shoes: 'Pair of colorful sneakers on a white block',
  jewelery: 'Gemstone earrings resting on a monstera leaf',
  sports: 'Dumbbells on a red running track',
  outdoors: 'Camping tents beside an alpine lake',
  automotive: 'Close-up of a modern car headlight',
  industrial: 'Warehouse racking stacked with boxes',
  default: 'Paper shopping bags'
} as const;

type CategorySlug = keyof typeof categoryImages;

// Whole-word aliases, checked in the order the words appear in the category name, so
// 'Health & Beauty' resolves to health and 'Baby Shoes' to baby.
const WORD_ALIASES: Record<string, CategorySlug> = {
  book: 'books',
  books: 'books',
  stationery: 'books',
  movie: 'movies',
  movies: 'movies',
  film: 'movies',
  films: 'movies',
  cinema: 'movies',
  music: 'music',
  audio: 'music',
  instruments: 'music',
  game: 'games',
  games: 'games',
  gaming: 'games',
  puzzles: 'games',
  electronic: 'electronics',
  electronics: 'electronics',
  gadgets: 'electronics',
  phones: 'electronics',
  headphones: 'electronics',
  computer: 'computers',
  computers: 'computers',
  laptops: 'computers',
  software: 'computers',
  home: 'home',
  furniture: 'home',
  decor: 'home',
  kitchen: 'home',
  living: 'home',
  garden: 'garden',
  gardening: 'garden',
  plants: 'garden',
  lawn: 'garden',
  patio: 'garden',
  tool: 'tools',
  tools: 'tools',
  hardware: 'tools',
  diy: 'tools',
  grocery: 'grocery',
  groceries: 'grocery',
  food: 'grocery',
  foods: 'grocery',
  beverages: 'grocery',
  snacks: 'grocery',
  health: 'health',
  wellness: 'health',
  pharmacy: 'health',
  vitamins: 'health',
  beauty: 'beauty',
  cosmetics: 'beauty',
  makeup: 'beauty',
  skincare: 'beauty',
  fragrance: 'beauty',
  toy: 'toys',
  toys: 'toys',
  hobbies: 'toys',
  kid: 'kids',
  kids: 'kids',
  children: 'kids',
  youth: 'kids',
  baby: 'baby',
  babies: 'baby',
  infant: 'baby',
  nursery: 'baby',
  clothing: 'clothing',
  clothes: 'clothing',
  apparel: 'clothing',
  fashion: 'clothing',
  shoe: 'shoes',
  shoes: 'shoes',
  footwear: 'shoes',
  sneakers: 'shoes',
  boots: 'shoes',
  jewelery: 'jewelery',
  jewelry: 'jewelery',
  jewellery: 'jewelery',
  watches: 'jewelery',
  sport: 'sports',
  sports: 'sports',
  fitness: 'sports',
  gym: 'sports',
  athletic: 'sports',
  outdoor: 'outdoors',
  outdoors: 'outdoors',
  camping: 'outdoors',
  hiking: 'outdoors',
  automotive: 'automotive',
  auto: 'automotive',
  car: 'automotive',
  cars: 'automotive',
  vehicles: 'automotive',
  motors: 'automotive',
  industrial: 'industrial',
  warehouse: 'industrial',
  wholesale: 'industrial',
  manufacturing: 'industrial'
};

/** Picks the photo tile for a category name, falling back to a generic shopping photo. */
export const categoryImageFor = (
  name?: string | null
): { src: string; alt: string; width: number; height: number } => {
  const words = (name ?? '')
    .toLowerCase()
    .split(/[^a-z]+/)
    .filter(Boolean);

  let slug: CategorySlug = 'default';
  for (const word of words) {
    const match = WORD_ALIASES[word];
    if (match) {
      slug = match;
      break;
    }
  }

  return {
    src: `/images/categories/${slug}.jpg`,
    alt: categoryImages[slug],
    width: CATEGORY_SIZE,
    height: CATEGORY_SIZE
  };
};
