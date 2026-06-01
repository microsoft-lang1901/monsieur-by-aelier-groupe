import type { Material } from "./materials";
import type { Collection, FibrePassport, Product } from "./products";

export type Campaign = {
  id: string;
  title: string;
  season: string;
  heroProductSkus: string[];
  editorialCopy: string;
};

export type Lookbook = {
  id: string;
  title: string;
  collectionIds: string[];
  productSkus: string[];
};

export type Journal = {
  id: string;
  title: string;
  dek: string;
  body: string;
  relatedSkus: string[];
};

export type AtelierService = {
  id: string;
  name: string;
  description: string;
  phase: "private-client" | "made-to-measure" | "digital-passport";
};

export type PrivateClientRelease = {
  id: string;
  title: string;
  eligibleClientTiers: string[];
  productSkus: string[];
};

export type CmsContentModelMap = {
  product: Product;
  collection: Collection;
  campaign: Campaign;
  lookbook: Lookbook;
  journal: Journal;
  material: Material;
  fibrePassport: FibrePassport;
  atelierService: AtelierService;
  privateClientRelease: PrivateClientRelease;
};
