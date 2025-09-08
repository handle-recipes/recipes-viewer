import { useState, useEffect } from "react";
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
} from "firebase/firestore";
import type { QuerySnapshot, DocumentData } from "firebase/firestore";
import { initializeFirebase } from "../lib/firebase";
import type { Recipe, Ingredient } from "../types";

export function useRecipes() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
              const aTime = a.updatedAt?.seconds || 0;
              const bTime = b.updatedAt?.seconds || 0;
              return bTime - aTime;
            });
            
            setRecipes(recipesData);
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

  return { recipes, loading, error };
}

export function useIngredients() {
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
            setIngredients(ingredientsData);
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

  return { ingredients, loading, error };
}
