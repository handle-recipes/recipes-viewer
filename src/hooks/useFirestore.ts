import { useState, useEffect } from 'react';
import { collection, query, where, orderBy, onSnapshot, QuerySnapshot, DocumentData } from 'firebase/firestore';
import { initializeFirebase } from '../lib/firebase';
import { Recipe, Ingredient } from '../types';

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
          collection(db, 'recipes'),
          where('isArchived', '==', false),
          orderBy('updatedAt', 'desc')
        );

        unsubscribe = onSnapshot(
          q,
          (snapshot: QuerySnapshot<DocumentData>) => {
            const recipesData = snapshot.docs.map(doc => ({
              id: doc.id,
              ...doc.data()
            }));
            setRecipes(recipesData);
            setLoading(false);
          },
          (err) => {
            console.error('Error fetching recipes:', err);
            setError(err.message);
            setLoading(false);
          }
        );
      } catch (err) {
        console.error('Failed to setup recipes listener:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
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
          collection(db, 'ingredients'),
          where('isArchived', '==', false)
        );

        unsubscribe = onSnapshot(
          q,
          (snapshot: QuerySnapshot<DocumentData>) => {
            const ingredientsData = snapshot.docs.map(doc => ({
              id: doc.id,
              ...doc.data()
            }));
            setIngredients(ingredientsData);
            setLoading(false);
          },
          (err) => {
            console.error('Error fetching ingredients:', err);
            setError(err.message);
            setLoading(false);
          }
        );
      } catch (err) {
        console.error('Failed to setup ingredients listener:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
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