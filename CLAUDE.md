# Project Goal
Read-only live viewer for a shared Firestore database of recipes and ingredients.
- **No writes**, no auth UI.
- Reads directly from Firestore with **public read rules**.
- Uses Firebase Hosting’s **auto-init config** served at `/_ _/firebase/init.json` (no API keys in env).

# Tech
- Vite + React + TypeScript
- Firebase Web SDK (App, Firestore, Storage for image URLs only)
- Build output: `dist/`

# Data Model (shared)
We will copy `src/types.ts` into this repo. Use:
- `Recipe` with fields: `id` (autoId), `slug`, `name`, `description`, `servings`, `ingredients[]`, `steps[]`, `tags[]`, `categories[]`, optional `imageUrl`, optional `embedding`, audit fields, `isArchived`.
- `Ingredient` with id = normalized name (string), `aliases[]`, `categories[]`, `allergens[]`, optional `embedding`, audit fields, `isArchived`.
- `RecipeIngredient` supports `unit` ∈ `['g','kg','ml','l','piece','free_text']`. When `unit==='free_text'`, render `quantityText` and omit unit.

# Requirements
- Subscribe to **both** collections:
  - `recipes` (filter `isArchived == false`, order by `updatedAt` desc)
  - `ingredients` (filter `isArchived == false`)
- Maintain local store of documents and reactively update UI on snapshot changes (add/update/remove).
- UI:
  - Left: searchable list (client-side filter by name/tags/categories).
  - Right: detail view for the selected recipe.
  - All images shown at a **fix**
