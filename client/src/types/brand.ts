export interface Brand {
  _id: string;
  name: string;
  slug: string;
  description: string;
  isActive: boolean;
  merchant?: string | null;
  created?: string;
  updated?: string;
}

/** A brand as embedded in products. */
export interface BrandRef {
  _id?: string;
  name: string;
  slug?: string;
  isActive?: boolean;
}
