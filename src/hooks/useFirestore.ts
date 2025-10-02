import { useState, useEffect } from "react";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import type { QuerySnapshot, DocumentData } from "firebase/firestore";
import { initializeFirebase } from "../lib/firebase";
import type { Recipe, Ingredient } from "../types";

export function useRecipes() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [groupIds, setGroupIds] = useState<string[]>([]);

  useEffect(() => {
    let unsubscribe: (() => void) | null = null;

    async function setupListener() {
      try {
        const { db } = await initializeFirebase();

        const q = query(
          collection(db, "recipes"),
          where("isArchived", "!=", true)
        );

        unsubscribe = onSnapshot(
          q,
          (snapshot: QuerySnapshot<DocumentData>) => {
            const recipesData = snapshot.docs.map((doc) => {
              const data = doc.data();
              return {
                id: doc.id,
                ...data,
              } as Recipe;
            });

            // Sort by updatedAt desc on client-side
            recipesData.sort((a, b) => {
              const aTime = a.updatedAt || "";
              const bTime = b.updatedAt || "";
              return bTime.localeCompare(aTime);
            });

            // Extract unique group IDs
            const uniqueGroupIds = Array.from(
              new Set(
                recipesData
                  .map((recipe) => recipe.createdByGroupId)
                  .filter(Boolean)
              )
            ).sort();

            setRecipes(recipesData);
            setGroupIds(uniqueGroupIds);
            setLoading(false);
          },
          (err) => {
            console.error("Error fetching recipes:", err);
            setError(err.message);
            setLoading(false);
          }
        );
      } catch (err) {
        console.error("Failed to setup recipes listener:", err);
        setError(err instanceof Error ? err.message : "Unknown error");
        setLoading(false);
      }
    }

    setupListener();

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, []);

  return { recipes, loading, error, groupIds };
}

export function useIngredients() {
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [groupIds, setGroupIds] = useState<string[]>([]);

  useEffect(() => {
    let unsubscribe: (() => void) | null = null;

    async function setupListener() {
      try {
        const { db } = await initializeFirebase();

        const q = query(
          collection(db, "ingredients"),
          where("isArchived", "!=", true)
        );

        unsubscribe = onSnapshot(
          q,
          (snapshot: QuerySnapshot<DocumentData>) => {
            const ingredientsData = snapshot.docs.map((doc) => {
              const data = doc.data();
              return {
                id: doc.id,
                ...data,
              } as Ingredient;
            });
            // Extract unique group IDs
            const uniqueGroupIds = Array.from(
              new Set(
                ingredientsData
                  .map((ingredient) => ingredient.createdByGroupId)
                  .filter(Boolean)
              )
            ).sort();

            setIngredients(ingredientsData);
            setGroupIds(uniqueGroupIds);
            setLoading(false);
          },
          (err) => {
            console.error("Error fetching ingredients:", err);
            setError(err.message);
            setLoading(false);
          }
        );
      } catch (err) {
        console.error("Failed to setup ingredients listener:", err);
        setError(err instanceof Error ? err.message : "Unknown error");
        setLoading(false);
      }
    }

    setupListener();

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, []);

  return { ingredients, loading, error, groupIds };
}
