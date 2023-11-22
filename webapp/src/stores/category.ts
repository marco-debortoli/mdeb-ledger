import type { Category } from '@/types/category';
import { defineStore } from 'pinia'

export const useCategoryStore = defineStore(
  'category',
  {
    state: () => (
      {
        categories: [] as Category[],
        loading: false
      }
    ),
    getters: {
      debitCategories(state) {
        const filtered = state.categories.filter((cat) => {
          return cat.type == "debit";
        });
        return filtered;
      },
      creditCategories(state) {
        const filtered = state.categories.filter((cat) => {
          return cat.type == "credit";
        });
        return filtered;
      },
    },
    actions: {
      async retrieve() {
        this.loading = true;

        const response = await fetch(
          "http://localhost:8080/api/v1/categories"
        );

        this.loading = false;

        if (response.status != 200) {
          console.log("Failed to fetch transactions")
          return response;
        } else {
          this.categories = await response.json();
          return response;
        }
      }
    },
  }
);