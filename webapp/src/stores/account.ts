import type { Account } from '@/types/account';
import { defineStore } from 'pinia'
import dayjs from 'dayjs';
import { apiGet, apiPost } from '@/tools/api';

type Nullable<T> = T | null;

export const useAccountStore = defineStore(
  'account',
  {
    state: () => (
      {
        accounts: [] as Account[],
        loading: false,
        date: null as Nullable<Date>
      }
    ),
    getters: {
      debitAccounts(state) {
        return state.accounts.filter((acc) => acc.type == "debit");
      },
      creditAccounts(state) {
        return state.accounts.filter((acc) => acc.type == "credit");
      },
      investAccounts(state) {
        return state.accounts.filter((acc) => acc.type == "investment");
      },
      netWorthAccounts(state) {
        return state.accounts.filter((acc) => acc.include_net_worth);
      }
    },
    actions: {
      async retrieve(date: Date | null = null) {
        this.date = date;

        let url = "/api/v1/accounts";

        if (date !== null) {
            const startDate = dayjs(date).startOf('month');
            url = `/api/v1/accounts?date=${startDate.local().format()}`
        }

        this.loading = true;
        this.accounts = [];

        const response = await apiGet(url);

        this.loading = false;

        if (response === undefined || response.status != 200) {
          console.log("Failed to fetch accounts")
          return response;
        } else {
          this.accounts = await response.json();
          return response;
        }
      },

      async refresh() {
        if (this.date) {
          return this.retrieve(this.date)
        }
        return this.retrieve();
      },

      async addValue(id: string, date: Date, amount: number) {
        const payload = {
            value: amount,
            date: dayjs(date).startOf('month').local().format() 
        }

        const response = await apiPost(
          `/api/v1/accounts/${id}/set_value`,
          payload
        );

        return response;

      }
    },
  }
);