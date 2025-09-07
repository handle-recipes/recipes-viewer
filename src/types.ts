// types.ts
// Shared models for recipes + ingredients across viewer / functions / MCP servers.

// ----------------------
// Common / utility types
// ----------------------
export type FirestoreTimestamp = { seconds: number; nanoseconds: number };

export type GroupId = string; // Injected into MCP servers via ENV and forwarded in requests

export const UNITS = ["g", "kg", "ml", "l", "piece", "free_text"] as const;
/**
 * Units:
 * - Metric only + "piece"
 * - "free_text" = quantity is expressed in text (quantityText) and unit is visually omitted.
 */
export type Unit = (typeof UNITS)[number];

// ----------------------
// Ingredient
// ----------------------
export interface Ingredient {
  /** Document ID (string based on normalized name; not autoId) */
  id: string;

  /** Primary name, e.g., "egg" */
  name: string;

  /** Alternate names, spellings, languages */
  aliases: string[];

  /** Free-text categories (e.g., "dairy", "protein", "herb") */
  categories: string[];

  /** Allergen tags (e.g., "nuts", "gluten", "milk") */
  allergens: string[];

  /** Optional vector embedding of the ingredient name */
  embedding?: number[];

  /** Provenance / audit */
  createdAt: FirestoreTimestamp;
  updatedAt: FirestoreTimestamp;
  createdByGroupId: GroupId;
  updatedByGroupId: GroupId;

  /** Soft delete */
  isArchived: boolean;
}

// ----------------------
// Recipe ↔ Ingredient link
// ----------------------
export interface RecipeIngredient {
  /** String ID of the ingredient document (not a DocumentReference) */
  ingredientId: string;

  /**
   * For standard units, set quantity (e.g., 200 g, 500 ml, 2 piece).
   * If unit === "free_text", leave quantity undefined and use quantityText.
   */
  quantity?: number;

  /** Unit enum; "free_text" hides unit and uses quantityText instead */
  unit: Unit;

  /** Only used when unit === "free_text", e.g., "a pinch", "to taste", "1 large" */
  quantityText?: string;

  /** Free-form note, e.g., "finely chopped" */
  note?: string;
}

// ----------------------
// Recipe steps
// ----------------------
export interface RecipeStep {
  /** Instruction text */
  text: string;

  /** Optional fixed-size image (viewer enforces display size) */
  imageUrl?: string;

  /** Optional equipment suggested/required for this step */
  equipment?: string[];
}

// ----------------------
// Recipe
// ----------------------
export interface Recipe {
  /** Document ID (autoId) */
  id: string;

  /** Kebab-case slug, unique (e.g., "chocolate-cake" or "chocolate-cake-2") */
  slug: string;

  name: string;

  /**
   * Keep within reasonable length for a single embedding with gemini-embedding-001.
   * (Long, but not excessively large.)
   */
  description: string;

  /** Number of servings (viewer can scale UI; no auto conversions) */
  servings: number;

  /** Structured ingredients */
  ingredients: RecipeIngredient[];

  /** Ordered steps (implicit order by array index) */
  steps: RecipeStep[];

  /** Free-text tags, e.g., ["vegan", "spicy"] */
  tags: string[];

  /** Free-text categories, e.g., ["dessert", "norwegian"] */
  categories: string[];

  /** Optional hero image for the recipe (viewer renders at fixed size) */
  imageUrl?: string;

  /** Optional source attribution URL */
  sourceUrl?: string;

  /** Optional vector embedding of (name + description) */
  embedding?: number[];

  /** Provenance / audit */
  createdAt: FirestoreTimestamp;
  updatedAt: FirestoreTimestamp;
  createdByGroupId: GroupId;
  updatedByGroupId: GroupId;

  /** Soft delete */
  isArchived: boolean;
}

// ----------------------
// Helpers (optional, lightweight)
// ----------------------
export type RecipeCreate = Omit<
  Recipe,
  | "id"
  | "slug"
  | "embedding"
  | "createdAt"
  | "updatedAt"
  | "createdByGroupId"
  | "updatedByGroupId"
  | "isArchived"
> & {
  // allow omitting some fields at creation time
  imageUrl?: string;
  tags?: string[];
  categories?: string[];
};

export type IngredientCreate = Omit<
  Ingredient,
  | "embedding"
  | "createdAt"
  | "updatedAt"
  | "createdByGroupId"
  | "updatedByGroupId"
  | "isArchived"
>;

// Minimal guards you can use in Functions if desired
export const isUnit = (u: string): u is Unit =>
  (UNITS as readonly string[]).includes(u);
